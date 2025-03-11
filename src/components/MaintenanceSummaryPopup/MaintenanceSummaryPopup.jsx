import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachmentIcon from "@mui/icons-material/Attachment"; // Added for attachment icon
import { UserInfo } from "../custom/Dialog/UserInfo/UserInfo";
import "./MaintenanceSummaryPopup.css";

const calculateDowntime = (start, end) => {
  // Check if the start or end is invalid
  if (!start || !end || isNaN(new Date(start)) || isNaN(new Date(end)))
    return "0 minutes";

  const startDate = new Date(start);
  const endDate = new Date(end);

  const downtimeInMilliseconds = endDate - startDate;

  // If the downtime is zero or invalid, return 0 minutes
  if (downtimeInMilliseconds <= 0) return "0 minutes";

  const minutes = Math.floor(downtimeInMilliseconds / (1000 * 60));
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const remainingMinutes = minutes % 60;

  let result = [];
  if (days > 0) result.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) result.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (remainingMinutes > 0)
    result.push(`${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`);

  return result.join(", ");
};


const MaintenanceSummaryPopup = ({
  open,
  onClose,
  maintenanceData,
  machineDetails,
}) => {
  const [showAttachments, setShowAttachments] = useState(false);
  useEffect(() => {
    setShowAttachments(false);
  }, [maintenanceData, open]);
  if (!maintenanceData) return null;

  // Normalize data from both sources
  const {
    id,
    requestID,
    createdAt,
    updatedAt,
    productionLine: dataProductionLine,
    machineName: dataMachineName,
    machineId: dataMachineId,
    sparePartsUsed = [],
    breakDownCauses,
    solution,
    recommendations,
    failures,
    productionLineDownStart,
    productionLineDownEnd,
    machineDownStart,
    machineDownEnd,
    attachments,
    assignedTo,
    assignedBy,
    createdBy,
  } = maintenanceData;

  // Use machine details if provided (from MachineProfile) or fall back to data from maintenanceData
  const displayProductionLine =
    machineDetails?.productionLine || dataProductionLine;
  const displayMachineName = machineDetails?.name || dataMachineName;
  const displayMachineId = machineDetails?.machineId || dataMachineId;
  const displayRequestId = id || requestID;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : "";
  const formattedTime =
    createdAt && updatedAt
      ? `${new Date(createdAt).toLocaleTimeString()} to ${new Date(
          updatedAt
        ).toLocaleTimeString()}`
      : "";

  const productionLineDowntime = calculateDowntime(
    productionLineDownStart,
    productionLineDownEnd
  );
  const machineDowntime = calculateDowntime(machineDownStart, machineDownEnd);

  const subtotal = sparePartsUsed.reduce(
    (sum, part) => sum + part.quantity * part.price,
    0
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="maintenance-summary-popup"
    >
      <DialogTitle>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6" className="popup-title">
            Maintenance Summary
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Typography variant="body1" className="popup-full-id">
          Request ID: <span className="popup-id">{displayRequestId}</span>
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <Typography variant="body1" className="popup-date">
              {formattedDate}
            </Typography>
            <Typography variant="body2" className="popup-time">
              {formattedTime}
            </Typography>
          </Grid>
          <Grid item xs={6}></Grid>

          {/* Machine Information */}
          <Grid item xs={4}>
            <Typography variant="body1" className="popup-section-header">
              Production Line
            </Typography>
            <Typography variant="body2" className="popup-value">
              {displayProductionLine || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" className="popup-section-header">
              Machine Name
            </Typography>
            <Typography variant="body2" className="popup-value">
              {displayMachineName || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" className="popup-section-header">
              Machine ID
            </Typography>
            <Typography variant="body2" className="popup-value">
              {displayMachineId || "N/A"}
            </Typography>
          </Grid>
          {/* Downtime Information */}
          <Grid item xs={6}>
            <Typography variant="body1" className="popup-section-header">
              Production Line Downtime
            </Typography>
            <Typography variant="body2" className="popup-value">
              {productionLineDowntime}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" className="popup-section-header">
              Machine Downtime
            </Typography>
            <Typography variant="body2" className="popup-value">
              {machineDowntime}
            </Typography>
          </Grid>
          {/* Spare Parts Table */}
          <Grid item xs={12}>
            <Typography variant="h6" className="popup-table-header">
              Spare Parts Used
            </Typography>
            <Table className="popup-table">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Part Name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price (CA)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sparePartsUsed.map((part, index) => (
                  <TableRow key={index}>
                    <TableCell>{part.category}</TableCell>
                    <TableCell>{part.partName}</TableCell>
                    <TableCell align="right">{part.quantity}</TableCell>
                    <TableCell align="right">${part.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography variant="body1" className="popup-subtotal">
              Total Cost: <span className="subtotal-value">${subtotal}</span>
            </Typography>
          </Grid>
          {attachments?.length > 0 && (
            <Grid item xs={12} className="attachments-section">
              <Typography
                variant="subtitle1"
                className="popup-section-header"
                gutterBottom
              >
                Attachments
              </Typography>
              {showAttachments ? (
                <div className="image-gallery">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="image-item">
                      <img
                        src={attachment}
                        alt={`Attachment ${index + 1}`}
                        className="attachment-image"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<AttachmentIcon />}
                  onClick={() => setShowAttachments(true)}
                  className="show-attachments-btn"
                >
                  Show Attachments ({attachments.length})
                </Button>
              )}
            </Grid>
          )}
          {/* Issue Details */}
          <Grid item xs={12}>
            <Typography variant="body1" className="popup-label">
              Break Down Causes
            </Typography>
            <Typography variant="body2" className="popup-value">
              {breakDownCauses}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" className="popup-label">
              Failures:
              <Typography variant="body2" className="popup-value">
                {failures}
              </Typography>
            </Typography>
          </Grid>
          {/* Solution */}
          <Grid item xs={12}>
            <Typography variant="body1" className="popup-label">
              Solution
            </Typography>
            <Typography variant="body2" className="popup-value">
              {solution || "N/A"}
            </Typography>
          </Grid>
          {/* Recommendations */}
          <Grid item xs={12}>
            <Typography variant="body1" className="popup-label">
              Recommendations
            </Typography>
            <Typography variant="body2" className="popup-value">
              {recommendations || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <UserInfo showAssignedBy={true} request={maintenanceData} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceSummaryPopup;