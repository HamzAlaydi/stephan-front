import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";
import "./SchedulePopup.css";

const SchedulePopup = ({ open, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
      className="schedule-dialog"
    >
      <DialogTitle className="dialog-title">
        <Typography variant="h6" component="div" className="dialog-title-text">
          Schedule Maintenance
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Select Date & Time"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            className="date-time-picker"
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                sx: {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(22, 66, 60, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(22, 66, 60, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgba(22, 66, 60, 0.8)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(22, 66, 60, 0.8)",
                    "&.Mui-focused": {
                      color: "rgba(22, 66, 60, 0.8)",
                    },
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </DialogContent>

      <DialogActions className="dialog-actions">
        <button onClick={onClose} className="cancel-button" type="button">
          Cancel
        </button>
        <button
          onClick={() => onConfirm(selectedDate)}
          className="schedule-button"
          type="button"
        >
          Schedule
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default SchedulePopup;
