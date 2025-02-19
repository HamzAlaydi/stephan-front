import React, { forwardRef } from "react";
import { Snackbar, Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import "./Toast.css";

const Toast = forwardRef(
  (
    {
      open,
      onClose,
      message,
      type = "success", // 'success', 'error', 'warning', 'info'
      duration = 3000,
      position = { vertical: "top", horizontal: "right" },
    },
    ref
  ) => {
    const getIcon = () => {
      switch (type) {
        case "success":
          return <CheckCircleIcon className="toast-icon" />;
        case "error":
          return <ErrorIcon className="toast-icon" />;
        case "warning":
          return <WarningIcon className="toast-icon" />;
        case "info":
          return <InfoIcon className="toast-icon" />;
        default:
          return null;
      }
    };

    return (
      <Snackbar
        ref={ref}
        open={open}
        autoHideDuration={duration}
        onClose={onClose}
        anchorOrigin={position}
      >
        <Box className={`toast-container toast-${type}`}>
          <Box className="toast-content">
            {getIcon()}
            <Typography className="toast-message">{message}</Typography>
          </Box>
          <CloseIcon className="toast-close" onClick={onClose} />
        </Box>
      </Snackbar>
    );
  }
);

export default Toast;
