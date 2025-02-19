import React, { useState } from "react";
import { Dialog, DialogContent, Box, Button, Grid } from "@mui/material";
import { DialogHeader } from "../custom/Dialog/DialogHeader/DialogHeader";
import ActionButtons from "../custom/ActionButtons/ActionButtons";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import "./ImportDataPopup.css"; // Import the CSS file

const ImportDataPopup = ({ open, onClose }) => {
  const [file, setFile] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      // toast.error("Please upload a valid CSV file.");
    }
  };

  // Handle file upload
  const handleUpload = () => {
    if (file) {
      // Simulate file upload logic (replace with actual API call)
      setTimeout(() => {
        // toast.success("File uploaded successfully!");
        onClose();
      }, 1000);
    } else {
      // toast.error("No file selected.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="import-data-popup"
    >
      <DialogHeader title="Import Data" onClose={onClose} />
      <DialogContent>
        <Box className="popup-content">
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <label className="input-label">Upload CSV File</label>
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-upload"
                accept=".csv"
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  className="fileUploadButton"
                  startIcon={<AttachFileIcon />}
                >
                  {file ? file.name : "Choose File"}
                </Button>
              </label>
            </Grid>
          </Grid>
        </Box>

        {/* Action Buttons */}
        <Box className="popup-actions">
          <ActionButtons
            onCancel={onClose}
            confirmText={"Upload"}
            onConfirm={handleUpload}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDataPopup;
