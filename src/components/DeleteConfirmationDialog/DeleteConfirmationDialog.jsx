import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./DeleteConfirmDialog.css";

const DeleteConfirmDialog = ({
  open,
  onClose,
  onDelete,
  isDeleting,
  title = "Confirm Production Line Deletion",
  description = "Are you sure you want to delete this production line? This action cannot be undone.",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle className="dialog-title">
        <Typography variant="h6" component="div" className="dialog-title-text">
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="close-button"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="dialog-content">
        <Typography variant="body1" className="dialog-description">
          {description}
        </Typography>
      </DialogContent>

      <DialogActions className="dialog-actions">
        <button
          onClick={onClose}
          className="cancel-button"
          type="button"
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="delete-button"
          type="button"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
