import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Typography, CircularProgress, Button } from "@mui/material";
import Top from "../../components/layout/Top/Top";
import PMTable from "../../components/PMTable/PMTable";
import MaintenanceSummaryPopup from "../../components/MaintenanceSummaryPopup/MaintenanceSummaryPopup";
import {
  fetchMachineDetailsWithMaintenance,
  fetchMaintenanceHistory,
} from "../../redux/slices/machinesSlice";
import useToast from "../../hooks/useToast";
import Toast from "../../components/Toast/Toast";
import "./MachineProfile.css"; // Import the CSS file
import Loading from "../../components/Loading/Loading";

const MachineProfile = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const { toast, showToast, hideToast } = useToast();
  const [selectedMaintenance, setSelectedMaintenance] = React.useState(null);
  const [openPopup, setOpenPopup] = React.useState(false);

  // Correctly access maintenanceHistory from Redux state
  const { machineDetails, maintenanceHistory, status, error } = useSelector(
    (state) => ({
      machineDetails: state.machines.machineDetailsWithMaintenance,
      maintenanceHistory: state.machines.maintenanceHistory,
      status: state.machines.status,
      error: state.machines.error,
    })
  );

  const { machine, stats } = machineDetails || {};

  useEffect(() => {
    const loadData = async () => {
      try {
        // Dispatch both actions separately
        await dispatch(fetchMachineDetailsWithMaintenance(id)).unwrap();
        await dispatch(fetchMaintenanceHistory(id)).unwrap();
      } catch (err) {
        showToast({
          message: err.message || "Failed to load data",
          type: "error",
        });
      }
    };
    loadData();
  }, [id, dispatch, showToast]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const maintenanceColumns = [
    { key: "requestID", label: "Request ID" },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "breakDownCauses",
      label: "Break Down Causes",
      render: (row) => row.breakDownCauses || "No description",
    },
    {
      key: "requestStatus",
      label: "Status",
      render: (row) => (
        <span
          style={{
            color: row.requestStatus === "Closed" ? "#4CAF50" : "#f44336",
            fontWeight: 500,
          }}
        >
          {row.requestStatus}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Box
          variant="contained"
          className="view-details-button"
          size="small"
          onClick={() => {
            setSelectedMaintenance(row);
            setOpenPopup(true);
          }}
        >
          View Details
        </Box>
      ),
    },
  ];

  if (status === "loading") return <Loading />;

  return (
    <Box className="machine-profile-page">
      <Top title="Machine Profile" />

      {/* Machine Details Section */}
      <Box className="details-container">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1">
              <strong>Production Line:</strong>{" "}
              {machine?.productionLine?.name || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1">
              <strong>Machine Name:</strong> {machine?.name || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1">
              <strong>Machine ID:</strong> {machine?.machineId || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body1">
              <strong>Total Maintenance Cost:</strong>{" "}
              {machine?.maintenanceCost || "N/A"}$
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Maintenance History Table */}
      <Box className="maintenance-history-container">
        <Typography variant="h6" className="maintenance-history-title">
          Maintenance History
        </Typography>
      </Box>
      {console.log({ selectedMaintenance })}
      <PMTable
        data={maintenanceHistory || []}
        columns={maintenanceColumns}
        dataKey="_id"
        pagination
        itemsPerPage={5}
        tableName="Maintenance Records"
        filterFunction={(row, filter) => {
          // Customize this filter function as needed
          return (
            row.breakDownCauses?.toLowerCase().includes(filter.toLowerCase()) ||
            row.requestID.toLowerCase().includes(filter.toLowerCase())
          );
        }}
      />

      {/* Maintenance Summary Popup */}
      {selectedMaintenance && (
        <MaintenanceSummaryPopup
          open={openPopup}
          onClose={() => setOpenPopup(false)}
          maintenanceData={selectedMaintenance}
          machineDetails={{
            name: machine?.name,
            machineId: machine?.machineId,
            productionLine: machine?.productionLine?.name,
          }}
        />
      )}

      <Toast
        open={toast.open}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />
    </Box>
  );
};

export default MachineProfile;
