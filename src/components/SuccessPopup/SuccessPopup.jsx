import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import "./SuccessPopup.css";

const SuccessPopup = ({
  open,
  onClose,
  message = "Operation completed successfully!",
  autoHideDuration = 3000,
}) => {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [open, onClose, autoHideDuration]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="success-popup"
      maxWidth="sm"
      fullWidth
    >
      <DialogContent className="success-content">
        <IconButton onClick={onClose} className="close-button" size="small">
          <CloseIcon />
        </IconButton>
        <Box className="success-icon-container">
          <CheckCircleIcon className="success-icon" />
        </Box>
        <Typography variant="h6" className="success-message">
          {message}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessPopup;
