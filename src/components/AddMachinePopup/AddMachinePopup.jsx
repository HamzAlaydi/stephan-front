import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  Box,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { DialogHeader } from "../custom/Dialog/DialogHeader/DialogHeader";
import ActionButtons from "../custom/ActionButtons/ActionButtons";
import { createMachine } from "../../redux/slices/machinesSlice";
import { fetchProductionLines } from "../../redux/slices/productionLinesSlice";
import useToast from "../../hooks/useToast";
import Loading from "../../components/Loading/Loading";
import "./AddMachinePopup.css";
import Toast from "../Toast/Toast";
import { useForm, Controller } from "react-hook-form";

const AddMachinePopup = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { showToast, hideToast, toast } = useToast();
  const { createStatus } = useSelector((state) => state.machines);
  const { lines: productionLines, status: productionLinesStatus } = useSelector(
    (state) => state.productionLines
  );
  const { id } = useParams(); // Get productionLineId from URL
  console.log({ id });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    dispatch(fetchProductionLines());
    if (open) {
      reset();
      setValue("productionLine", id); // Set production line ID from URL
    }
  }, [dispatch, open, reset, setValue, id]);

  const handleAddMachine = async (data) => {
    try {
      const payload = {
        ...data,
        productionId: id, // Use ID from URL
      };
      await dispatch(createMachine(payload)).unwrap();
      showToast({ message: "Machine added successfully", type: "success" });
      onClose();
      reset();
    } catch (error) {
      console.log({ error });

      showToast({
        message: error || "Failed to add machine",
        type: "error",
      });
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        className="add-machine-popup"
      >
        <DialogHeader title="Add Machine" onClose={onClose} />
        <DialogContent>
          <Box className="popup-content">
            <form onSubmit={handleSubmit(handleAddMachine)}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <label className="input-label">Machine ID</label>
                  <Controller
                    name="machineId"
                    control={control}
                    rules={{ required: "Machine ID is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Enter Machine ID"
                        error={!!error}
                        helperText={error?.message}
                        className="machine-id-field"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <label className="input-label">Machine Name</label>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Machine Name is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Enter Machine Name"
                        error={!!error}
                        helperText={error?.message}
                        className="machine-name-field"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <label className="input-label">Production Line</label>
                  <FormControl fullWidth>
                    <Controller
                      name="productionLine"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          size="small"
                          disabled // Disable selection
                          displayEmpty
                          style={{ height: "28px" }}
                          className="dropdown"
                        >
                          {productionLinesStatus === "loading" && (
                            <MenuItem disabled>
                              Loading production lines...
                            </MenuItem>
                          )}
                          {productionLinesStatus === "succeeded" &&
                            productionLines.map((line) => (
                              <MenuItem key={line._id} value={line._id}>
                                {line.name}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <label className="input-label">Description</label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Description is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Enter Description"
                        multiline
                        rows={1}
                        error={!!error}
                        helperText={error?.message}
                        className="description-field"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box className="popup-actions">
                <ActionButtons
                  onCancel={onClose}
                  confirmText={
                    createStatus === "loading" ? <Loading size={24} /> : "Add"
                  }
                  onConfirm={handleSubmit}
                  disabled={createStatus === "loading"}
                />
              </Box>
            </form>
          </Box>
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

export default AddMachinePopup;
