// src/components/ScheduleReminder/ScheduleReminder.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { DialogHeader } from "../custom/Dialog/DialogHeader/DialogHeader";
import { InfoRow } from "../custom/Dialog/InfoRow/InfoRow";
import { updateRequestStatus } from "../../redux/slices/maintenanceRequestsSlice";
// ScheduleReminder.jsx
const ScheduleReminder = () => {
  const { requests } = useSelector((state) => state.maintenanceRequests);
  const { user } = useSelector((state) => state.auth);
  const [reminder, setReminder] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkScheduled = () => {
      const now = new Date();
      const scheduled = requests.find(
        (req) =>
          req.assignedTo === user?._id &&
          req.requestStatus === "Scheduled" &&
          new Date(req.scheduledDate) <= now
      );

      if (scheduled) {
        setReminder(scheduled);
        // Update status to In Progress automatically
        dispatch(
          updateRequestStatus({
            requestId: scheduled._id,
            status: "In Progress",
          })
        );
      }
    };

    const interval = setInterval(checkScheduled, 60000);
    return () => clearInterval(interval);
  }, [requests, user]);

  return (
    <Dialog open={!!reminder} onClose={() => setReminder(null)}>
      <DialogHeader title="Scheduled Maintenance Reminder" />
      <DialogContent>
        {reminder && (
          <>
            <InfoRow label="Request ID" value={reminder.requestID} />
            <InfoRow label="Machine" value={reminder.machine?.name} />
            <InfoRow
              label="Scheduled Time"
              value={new Date(reminder.scheduledDate).toLocaleString()}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleReminder;
