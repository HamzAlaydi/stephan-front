// src/components/TechnicianRequestPopup/TechnicianRequestPopup.jsx
import React, { useState } from "react";
import { Dialog, DialogContent, Grid, Button } from "@mui/material";
import { DialogHeader } from "../custom/Dialog/DialogHeader/DialogHeader";
import { InfoRow } from "../custom/Dialog/InfoRow/InfoRow";
import SchedulePopup from "../SchedulePopup/SchedulePopup";
import AddSparePartsPopup from "../AddSparePartsPopup/AddSparePartsPopup";
import { useDispatch } from "react-redux";
import {
  updateRequestStatus,
  addSpareParts,
} from "../../redux/slices/maintenanceRequestsSlice";

const TechnicianRequestPopup = ({ open, onClose, request }) => {
  const dispatch = useDispatch();
  const [showSchedule, setShowSchedule] = useState(false);
  const [showSpareParts, setShowSpareParts] = useState(false);

  const handleStart = () => {
    dispatch(
      updateRequestStatus({
        requestId: request._id,
        status: "In Progress",
      })
    );
    onClose();
  };

  const handleScheduleSuccess = (date) => {
    dispatch(
      updateRequestStatus({
        requestId: request._id,
        status: "Scheduled",
        scheduledDate: date,
      })
    );
    setShowSchedule(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogHeader onClose={onClose} title={"Request Details"} />
        <DialogContent>
          <Grid container spacing={3}>
            <InfoRow label="Request ID" value={request.requestID} />
            <InfoRow label="Machine" value={request.machine?.name} />
            <InfoRow label="Failures" value={request.failures} />
            <InfoRow label="Priority" value={request.priority} />

            {request.requestStatus === "Assigned" && (
              <Grid
                item
                xs={12}
                container
                spacing={2}
                justifyContent="flex-end"
              >
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleStart}
                    className="actionButton"
                  >
                    Start Now
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={() => setShowSchedule(true)}
                    className="actionButton"
                  >
                    Schedule
                  </Button>
                </Grid>
              </Grid>
            )}

            {request.requestStatus === "In Progress" && (
              <Grid item xs={12} container justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={() => setShowSpareParts(true)}
                  className="actionButton"
                >
                  Add Spare Parts111
                </Button>
              </Grid>
            )}
          </Grid>
        </DialogContent>
      </Dialog>

      {showSchedule && (
        <SchedulePopup
          open={showSchedule}
          onClose={() => setShowSchedule(false)}
          onConfirm={handleScheduleSuccess}
        />
      )}

      {showSpareParts && (
        <AddSparePartsPopup
          open={showSpareParts}
          onClose={() => setShowSpareParts(false)}
          requestId={request._id}
        />
      )}
    </>
  );
};

export default TechnicianRequestPopup;
