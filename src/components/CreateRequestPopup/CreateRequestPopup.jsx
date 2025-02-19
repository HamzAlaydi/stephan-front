import React, { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  submitRequest,
  updateFormData,
  resetFormData,
} from "../../redux/slices/requestSlice";
import { DialogHeader } from "../custom/Dialog/DialogHeader/DialogHeader";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import "./CreateRequestPopup.css";
import ActionButtons from "../custom/ActionButtons/ActionButtons";
import { fetchProductionLines } from "../../redux/slices/productionLinesSlice";
import useToast from "../../hooks/useToast";
import Toast from "../Toast/Toast";

const STATUS = {
  PRODUCTION_LINE: {
    DOWN: "down",
    RUNNING: "running",
  },
  MACHINE: {
    DOWN: "down",
    UPNORMAL: "upNormal",
  },
};

const CreateRequestPopup = ({ open, onClose, addIcon = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { toast, showToast, hideToast } = useToast();
  const dispatch = useDispatch();
  const { formData, loading, error } = useSelector((state) => state.request);
  const { user } = useSelector((state) => state.auth);
  const { lines, status: productionLinesStatus } = useSelector(
    (state) => state.productionLines
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
  });

  const attachments = watch("attachments");
  const productionLineStatus = watch("productionLineStatus");

  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  useEffect(() => {
    if (open) {
      dispatch(resetFormData());
      dispatch(fetchProductionLines());
    }
  }, [open, dispatch]);

  const machines = useMemo(() => {
    const selectedLine = lines.find(
      (line) => line.name === formData.productionLine
    );
    return selectedLine ? selectedLine.machines : [];
  }, [formData.productionLine, lines]);

  const handleFieldChange = (field, value) => {
    dispatch(updateFormData({ [field]: value }));
  };

  const handleStatusChange = (fieldName, status) => {
    setValue(fieldName, status, { shouldValidate: true });
    handleFieldChange(fieldName, status);

    if (
      fieldName === "productionLineStatus" &&
      status === STATUS.PRODUCTION_LINE.DOWN
    ) {
      setValue("machineStatus", STATUS.MACHINE.DOWN, { shouldValidate: true });
      handleFieldChange("machineStatus", STATUS.MACHINE.DOWN);
    }
  };

  const onSubmit = (data) => {
    const selectedLine = lines.find(
      (line) => line.name === data.productionLine
    );
    const selectedMachine = machines.find(
      (machine) => machine.name === data.machineName
    );

    const requestData = {
      ...data,
      productionLine: selectedLine ? selectedLine._id : null,
      machineId: selectedMachine ? selectedMachine._id : null,
      createdBy: user?._id,
    };

    dispatch(submitRequest(requestData))
      .unwrap()
      .then(() => {
        showToast({
          message: "Request submitted successfully!",
          type: "success",
        });
        onClose();
        window.location.reload();
      })
      .catch((error) => {
        showToast({
          message: error.message || "Failed to submit request!",
          type: "error",
        });
        console.error("Submission error:", error);
      });
  };

  const renderStatusButtons = (fieldName, status) => (
    <Button
      disableRipple
      className={`switchButton ${
        watch(fieldName) === status ? "selected" : ""
      }`}
      onClick={() => handleStatusChange(fieldName, status)}
      disabled={
        fieldName === "machineStatus" &&
        productionLineStatus === STATUS.PRODUCTION_LINE.DOWN
      }
    >
      {status}
    </Button>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        classes={{ paper: "dialogPaper" }}
      >
        <DialogHeader
          onClose={onClose}
          title={"Create New Request"}
          addIcon={addIcon}
        />
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={isMobile ? 2 : isTablet ? 3 : 5}>
              {/* Production Line Dropdown */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Production Line
                </Typography>
                <Controller
                  name="productionLine"
                  control={control}
                  rules={{ required: "Production line is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <Select
                        {...field}
                        size="small"
                        className="dropdown"
                        onChange={(e) => {
                          field.onChange(e);
                          handleFieldChange("productionLine", e.target.value);
                          dispatch(
                            updateFormData({
                              machineName: "",
                              machineId: "",
                            })
                          );
                        }}
                      >
                        {lines.map((line) => (
                          <MenuItem key={line.id} value={line.name}>
                            {line.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {error && (
                        <Typography variant="caption" color="error">
                          {error.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Machine Name Dropdown */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Machine Name
                </Typography>
                <Controller
                  name="machineName"
                  control={control}
                  rules={{ required: "Machine name is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <Select
                        {...field}
                        size="small"
                        className="dropdown"
                        disabled={!formData.productionLine}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFieldChange("machineName", e.target.value);
                        }}
                      >
                        {machines.map((machine) => (
                          <MenuItem key={machine.id} value={machine.name}>
                            {machine.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {error && (
                        <Typography variant="caption" color="error">
                          {error.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Production Line Status */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Production Line Status
                </Typography>
                <Controller
                  name="productionLineStatus"
                  control={control}
                  rules={{ required: "Production line status is required" }}
                  render={({ field }) => (
                    <>
                      <Grid container className="switchContainer">
                        <Grid item>
                          {renderStatusButtons(
                            "productionLineStatus",
                            STATUS.PRODUCTION_LINE.DOWN
                          )}
                        </Grid>
                        <Grid item>
                          {renderStatusButtons(
                            "productionLineStatus",
                            STATUS.PRODUCTION_LINE.RUNNING
                          )}
                        </Grid>
                      </Grid>
                      {errors.productionLineStatus && (
                        <Typography variant="caption" color="error">
                          {errors.productionLineStatus.message}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </Grid>

              {/* Machine Status */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Machine Status
                </Typography>
                <Controller
                  name="machineStatus"
                  control={control}
                  rules={{ required: "Machine status is required" }}
                  render={({ field }) => (
                    <>
                      <Grid container className="switchContainer">
                        <Grid item>
                          {renderStatusButtons(
                            "machineStatus",
                            STATUS.MACHINE.DOWN
                          )}
                        </Grid>
                        <Grid item>
                          {renderStatusButtons(
                            "machineStatus",
                            STATUS.MACHINE.UPNORMAL
                          )}
                        </Grid>
                      </Grid>
                      {errors.machineStatus && (
                        <Typography variant="caption" color="error">
                          {errors.machineStatus.message}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </Grid>

              {/* Add Attachment (Optional) */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Add Attachments (Optional)
                </Typography>
                <Controller
                  name="attachments"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          onChange(files);
                          handleFieldChange("attachments", files);
                        }}
                        style={{ display: "none" }}
                        id="file-upload"
                        {...field}
                      />
                      <label htmlFor="file-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          fullWidth
                          className="fileUploadButton"
                          startIcon={<AttachFileIcon />}
                        >
                          {value?.length > 0
                            ? `${value.length} files selected`
                            : "Upload Files"}
                        </Button>
                      </label>
                    </>
                  )}
                />
              </Grid>

              {/* Failures */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Failures
                </Typography>
                <Controller
                  name="failures"
                  control={control}
                  rules={{ required: "Failures description is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="The machine on the production line has stopped, halting production"
                      className="textField"
                      error={!!error}
                      helperText={error?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("failures", e.target.value);
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Break Down Causes */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Break Down Causes
                </Typography>
                <Controller
                  name="breakDownCauses"
                  control={control}
                  rules={{ required: "Breakdown causes are required" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="The machine is experiencing frequent stoppages during operation, affecting its performance and causing overheating."
                      className="textField"
                      error={!!error}
                      helperText={error?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("breakDownCauses", e.target.value);
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Buttons */}
              <Grid item>
                <ActionButtons
                  cancelText="Cancel"
                  confirmText="Create"
                  onCancel={onClose}
                  loading={loading}
                  disabled={loading}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Toast
        open={toast.open}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />
    </>
  );
};

export default CreateRequestPopup;
