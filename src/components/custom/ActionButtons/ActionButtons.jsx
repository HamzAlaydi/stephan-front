import React from "react";
import { Button, Grid } from "@mui/material";
import "./ActionButtons.css";
const ActionButtons = ({
  cancelText = "Cancel",
  confirmText = "Create",
  onCancel,
  onConfirm,
  loading = false,
}) => {
  return (
    <div className="action-buttons">
      <Grid container justifyContent="center" spacing={3}>
        <Grid item>
          <Button onClick={onCancel} className="cancelButton">
            {cancelText}
          </Button>
        </Grid>
        <Grid item>
          <Button type="submit" className="createButton" disabled={loading}>
            {loading ? "Submitting..." : confirmText}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ActionButtons;
