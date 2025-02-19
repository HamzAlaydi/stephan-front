import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  TextField,
  Grid,
  FormHelperText,
} from "@mui/material";
import { DialogHeader } from "../custom/Dialog/DialogHeader/DialogHeader";
import ActionButtons from "../custom/ActionButtons/ActionButtons";
import { useDispatch, useSelector } from "react-redux";
import { createProductionLine } from "../../redux/slices/productionLinesSlice";
import Loading from "../../components/Loading/Loading";
import useToast from "../../hooks/useToast";
import "./AddProductionLinePopup.css";
import Toast from "../Toast/Toast";
import { useForm, Controller } from "react-hook-form";

const AddProductionLinePopup = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.productionLines);
  const { showToast, toast, hideToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(createProductionLine(data)).unwrap();
      showToast("Production line added successfully!", "success");
      onClose();
      reset(); // Reset the form after successful submission
    } catch (error) {
      showToast(error.message || "Failed to add production line", "error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      className="add-production-line-popup"
    >
      <DialogHeader title="Add Production Line" onClose={onClose} />
      <DialogContent>
        <Box className="popup-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              {/* Production Id */}
              <Grid item xs={12} md={6}>
                <label className="input-label">Production Id</label>
                <Controller
                  name="productionId"
                  control={control}
                  rules={{ required: "Production ID is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      fullWidth
                      placeholder="Enter Production Id"
                      error={!!error}
                      helperText={error?.message}
                      className="production-id-field"
                    />
                  )}
                />
              </Grid>

              {/* Production Name */}
              <Grid item xs={12} md={6}>
                <label className="input-label">Production Name</label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Production Name is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      fullWidth
                      placeholder="Enter Production Name"
                      error={!!error}
                      helperText={error?.message}
                      className="production-name-field"
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Description */}
            <Grid container spacing={3} className="description-row">
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
                      multiline
                      rows={1}
                      placeholder="Enter Description"
                      error={!!error}
                      helperText={error?.message}
                      className="description-field"
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box className="popup-actions">
              {status === "loading" ? (
                <Loading />
              ) : (
                <ActionButtons
                  onCancel={onClose}
                  confirmText={"Add"}
                  type="submit" // Important: Add type="submit" to the button
                  disabled={status === "loading"} // Disable while loading
                />
              )}
            </Box>
          </form>
        </Box>
      </DialogContent>
      <Toast
        open={toast.open}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />
    </Dialog>
  );
};

export default AddProductionLinePopup;
