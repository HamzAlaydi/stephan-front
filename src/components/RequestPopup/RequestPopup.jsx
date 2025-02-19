import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import { DialogHeader } from "../custom/Dialog/DialogHeader/DialogHeader";
import { InfoRow } from "../custom/Dialog/InfoRow/InfoRow";
import { UserInfo } from "../custom/Dialog/UserInfo/UserInfo";
import Loading from "../Loading/Loading";
import ActionButtons from "../custom/ActionButtons/ActionButtons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMaintenanceStaff,
  assignRequest,
  fetchMaintenanceRequests,
  updateRequestStatus,
} from "../../redux/slices/maintenanceRequestsSlice";
import useToast from "../../hooks/useToast"; // Import useToast
import Toast from "../Toast/Toast";
import SchedulePopup from "../SchedulePopup/SchedulePopup";
import AddSparePartsPopup from "../AddSparePartsPopup/AddSparePartsPopup";
import AddIcon from "@mui/icons-material/Add";
import "./RequestPopup.css";
const RequestPopup = ({
  open,
  onClose,
  selectedCard,
  addIcon = false,
  showSpareParts = false,
  isTechnicianView = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showSchedule, setShowSchedule] = useState(false);
  const [showSparePartsForm, setShowSparePartsForm] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { maintenanceStaff, status } = useSelector(
    (state) => state.maintenanceRequests
  );
  const { toast, showToast, hideToast } = useToast();

  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for button
  const [showAttachments, setShowAttachments] = useState(false);

  const isSupervisor = user?.department?.name === "maintenance supervisor";
  useEffect(() => {
    setShowAttachments(false);
  }, [selectedCard, open]);
  useEffect(() => {
    if (isSupervisor && open) {
      dispatch(fetchMaintenanceStaff());
      // Reset form fields when the dialog opens
      setSelectedStaff("");
      setSelectedPriority("");
    }
  }, [open, dispatch, isSupervisor]);

  const handleStart = () => {
    dispatch(
      updateRequestStatus({
        requestId: selectedCard?._id,
        status: "In Progress",
      })
    )
      .then(() => window.location.reload())
      .then(() => onClose());
  };

  const handleSchedule = (date) => {
    dispatch(
      updateRequestStatus({
        requestId: selectedCard?._id,
        status: "Scheduled",
        scheduledDate: date,
      })
    )
      .then(() => window.location.reload())
      .then(() => onClose());
  };

  const showTechnicianActions =
    isTechnicianView && selectedCard?.requestStatus !== "Closed";

  const handleAssignRequest = () => {
    setLoading(true); // Set button loading state to true
    dispatch(
      assignRequest({
        requestId: selectedCard?._id,
        assignedTo: selectedStaff,
        priority: selectedPriority,
        assignedBy: user._id,
      })
    )
      .unwrap()
      .then(() => {
        onClose();
        dispatch(fetchMaintenanceRequests());
        showToast({
          message: "Request assigned successfully!",
          type: "success",
        });
      })
      .catch((error) => {
        showToast({
          message: error.message || "Failed to assign request!",
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false); // Reset button loading state
      });
  };

  const {
    requestID,
    productionLine = {},
    machine,
    productionLineStatus,
    machineStatus,
    failures,
    breakDownCauses,
    createdBy = {},
    requestStatus = "Pending",
  } = selectedCard || {};

  const { name: productionLineName } = productionLine || {};
  const { name: machineName, machineId } = machine || {};
  const { name: createdByName } = createdBy || {};

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        className="request-information-popup"
      >
        <DialogHeader
          request={selectedCard}
          onClose={onClose}
          title={"Request Information"}
          addIcon={addIcon}
        />
        <DialogContent
          sx={{
            overflowY: "auto",
          }}
        >
          {selectedCard ? (
            <Grid container spacing={6}>
              {/* Mobile User Info */}
              {isMobile && (
                <Grid item xs={12}>
                  <UserInfo
                    showAssignedBy={isTechnicianView ? true : false}
                    request={selectedCard}
                  />
                </Grid>
              )}

              <InfoRow label="Request ID :" value={requestID} inline />

              {/* Desktop User Info */}
              {!isMobile && (
                <>
                  <Grid item xs={12}>
                    <UserInfo
                      showAssignedBy={isTechnicianView}
                      request={selectedCard}
                    />
                  </Grid>
                </>
              )}

              {/* Existing Info Rows */}
              <InfoRow label="Machine Name" value={machineName || "N/A"} />
              <InfoRow label="Machine Id" value={machineId || "N/A"} />

              {!isMobile && <InfoRow />}
              <InfoRow
                label="Production Line"
                value={productionLineName || "N/A"}
              />
              <InfoRow
                label="Production Line Status"
                value={productionLineStatus || "N/A"}
              />
              <InfoRow label="Machine Status" value={machineStatus || "N/A"} />
              <InfoRow label="Failures" value={failures || "N/A"} xs={12} />
              <InfoRow
                label="Break Down Causes"
                value={breakDownCauses || "N/A"}
                xs={12}
              />
              <InfoRow
                label="Production Line Downtime"
                value={`${selectedCard?.productionLineDowntime || 0} minutes`}
              />

              <InfoRow
                label="Machine Downtime"
                value={`${selectedCard?.machineDowntime || 0} minutes`}
              />
              {selectedCard?.attachments?.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Attachments
                  </Typography>
                  {showAttachments ? (
                    <div className="image-gallery">
                      {selectedCard.attachments.map((attachment, index) => (
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
                      variant="outlined"
                      onClick={() => setShowAttachments(true)}
                      className="show-attachments-btn"
                    >
                      Show Attachments ({selectedCard.attachments.length})
                    </Button>
                  )}
                </Grid>
              )}
              {showSpareParts && selectedCard?.sparePartsUsed?.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Spare Parts Used
                  </Typography>
                  {selectedCard?.sparePartsUsed.map((part, index) => (
                    <div key={index} style={{ marginBottom: "8px" }}>
                      <Typography variant="body2">
                        {part.partName} ({part.quantity} x {part.price}$)
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Category: {part.category}
                      </Typography>
                    </div>
                  ))}
                </Grid>
              )}

              {/* Technician-specific controls */}
              {showTechnicianActions && (
                <Grid item xs={12}>
                  {(selectedCard?.requestStatus === "Assigned" ||
                    selectedCard?.requestStatus === "Scheduled") && (
                    <Grid container spacing={2} justifyContent="center">
                      <Grid item>
                        <Button
                          variant="outlined"
                          onClick={() => setShowSchedule(true)}
                          className="action-button outline"
                        >
                          Schedule
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          onClick={handleStart}
                          className="action-button filled"
                        >
                          Start Now
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                  {selectedCard?.requestStatus === "In Progress" && (
                    <Grid container justifyContent="center">
                      <Button
                        variant="contained"
                        onClick={() => setShowSparePartsForm(true)}
                        className="action-button filled"
                        startIcon={<AddIcon />}
                      >
                        Submit Details
                      </Button>
                    </Grid>
                  )}
                </Grid>
              )}
              {/* Supervisor-specific Controls */}
              {isSupervisor &&
                !showSpareParts &&
                requestStatus !== "Assigned" && (
                  <>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle1" gutterBottom>
                          Maintenance Staff
                        </Typography>
                        <Select
                          value={selectedStaff}
                          onChange={(e) => setSelectedStaff(e.target.value)}
                          size="small"
                          className="dropdown"
                        >
                          {maintenanceStaff.map((staff) => (
                            <MenuItem key={staff._id} value={staff._id}>
                              {staff.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle1" gutterBottom>
                          Priority
                        </Typography>
                        <Select
                          value={selectedPriority}
                          onChange={(e) => setSelectedPriority(e.target.value)}
                          size="small"
                          className="dropdown"
                        >
                          <MenuItem value="Low">Low</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="High">High</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <ActionButtons
                        cancelText="Cancel"
                        confirmText="Assign Request"
                        onCancel={onClose}
                        onConfirm={handleAssignRequest}
                        disabled={!selectedStaff || !selectedPriority}
                        loading={loading} // Use loading state for button
                      />
                    </Grid>
                  </>
                )}
            </Grid>
          ) : (
            <Loading />
          )}
        </DialogContent>
      </Dialog>
      <Toast
        open={toast.open}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />
      {showSchedule && (
        <SchedulePopup
          open={showSchedule}
          onClose={() => setShowSchedule(false)}
          onConfirm={handleSchedule}
        />
      )}

      {/* Add spare parts dialog */}
      {showSparePartsForm && (
        <AddSparePartsPopup
          open={showSparePartsForm}
          onClose={() => setShowSparePartsForm(false)}
          requestId={selectedCard?._id}
        />
      )}
    </>
  );
};

export default RequestPopup;
