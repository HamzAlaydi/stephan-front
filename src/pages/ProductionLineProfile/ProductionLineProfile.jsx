import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Edit, Delete, Save, Cancel, Close } from "@mui/icons-material";
import Top from "../../components/layout/Top/Top";
import PMTable from "../../components/PMTable/PMTable";
import AddMachinePopup from "../../components/AddMachinePopup/AddMachinePopup";
import useToast from "../../hooks/useToast";
import Loading from "../../components/Loading/Loading";
import Toast from "../../components/Toast/Toast";
import {
  updateMachine,
  deleteMachine,
  fetchMachinesByProductionLine,
} from "../../redux/slices/machinesSlice";
import DeleteConfirmDialog from "../../components/DeleteConfirmationDialog/DeleteConfirmationDialog";
const ProductionLineProfile = () => {
  const {
    list: machines,
    status,
    error,
  } = useSelector((state) => state.machines);
  const { toast, showToast, hideToast } = useToast();
  const { id } = useParams();

  const navigate = useNavigate();
  const { productionLineId, productionLineName, description } =
    useLocation().state || {};
  const dispatch = useDispatch();

  const [openAddMachinePopup, setOpenAddMachinePopup] = useState(false);
  const [editingMachineId, setEditingMachineId] = useState(null);
  const [editedMachineData, setEditedMachineData] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState(null);

  const { updateStatus, deleteStatus } = useSelector((state) => state.machines);

  // Fetch machines on component mount or when ID changes
  useEffect(() => {
    if (id) {
      dispatch(fetchMachinesByProductionLine(id));
    }
  }, [dispatch, id]);

  // Handle update machine success/error
  useEffect(() => {
    if (updateStatus === "succeeded") {
      setEditingMachineId(null);
      setEditedMachineData({});
      showToast({
        message: "Machine updated successfully!",
        type: "success",
      });
    } else if (updateStatus === "failed") {
      showToast({
        message: error || "Failed to update machine",
        type: "error",
      });
    }
  }, [updateStatus, error, showToast]);

  // Handle delete machine success/error
  useEffect(() => {
    if (deleteStatus === "succeeded") {
      showToast({ message: "Machine deleted successfully", type: "success" });
      setDeleteConfirmOpen(false);
      setMachineToDelete(null);
    } else if (deleteStatus === "failed") {
      showToast({
        message: error || "Failed to delete machine",
        type: "error",
      });
    }
  }, [deleteStatus, error, showToast]);

  // Table columns configuration
  const columns = [
    { key: "machineId", label: "ID" },
    { key: "name", label: "Machine Name" },
    { key: "maintenanceCost", label: "Maintenance Cost" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {editingMachineId === row._id ? (
            <>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                size="small"
                color="primary"
                disabled={updateStatus === "loading"}
              >
                <Save fontSize="small" />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  cancelEdit();
                }}
                size="small"
                color="secondary"
                disabled={updateStatus === "loading"}
              >
                <Cancel fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(row);
                }}
                size="small"
                color="primary"
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(row._id);
                }}
                size="small"
                color="error"
              >
                <Delete fontSize="small" />
              </IconButton>
            </>
          )}
        </div>
      ),
    },
  ].map((column) => {
    if (column.key === "name" || column.key === "maintenanceCost") {
      return {
        ...column,
        render: (row) =>
          editingMachineId === row._id ? (
            <TextField
              variant="standard"
              value={editedMachineData[column.key] || ""}
              onChange={(e) =>
                setEditedMachineData({
                  ...editedMachineData,
                  [column.key]: e.target.value,
                })
              }
              sx={{ width: "100%" }}
              inputProps={{ style: { fontSize: "0.875rem" } }}
            />
          ) : column.key === "maintenanceCost" ? (
            `$${row[column.key] || "0"}`
          ) : (
            row[column.key]
          ),
      };
    }
    return column;
  });

  // Handlers
  const startEdit = (machine) => {
    setEditingMachineId(machine._id);
    setEditedMachineData({
      name: machine.name,
      maintenanceCost: machine.maintenanceCost,
    });
  };

  const cancelEdit = () => {
    setEditingMachineId(null);
    setEditedMachineData({});
  };

  const handleSave = () => {
    dispatch(
      updateMachine({
        id: editingMachineId,
        updatedData: editedMachineData,
      })
    );
  };

  const confirmDelete = (machineId) => {
    setMachineToDelete(machineId);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    dispatch(deleteMachine(machineToDelete));
  };

  return (
    <Box
      sx={{ flexGrow: 1, overflowX: "hidden" }}
      className="normal-page-style"
    >
      <Top
        title="Production Line Profile"
        btnName="Add Machine"
        onButtonClick={() => setOpenAddMachinePopup(true)}
      />

      {/* Production Line Details */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          border: `1px solid ${useTheme().palette.divider}`,
          borderRadius: 2,
          backgroundColor: useTheme().palette.background.paper,
          boxShadow: useTheme().shadows[1],
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">
              <strong>Production Line ID:</strong> {productionLineId}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">
              <strong>Name:</strong> {productionLineName}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">
              <strong>Status:</strong> Active
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Description:</strong> {description}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Machines Table */}
      {status === "loading" && <Loading />}
      {status === "failed" && (
        <Typography color="error" sx={{ p: 2 }}>
          Error loading machines: {error}
        </Typography>
      )}
      {status === "succeeded" && (
        <PMTable
          data={machines}
          columns={columns}
          dataKey="_id"
          pagination
          itemsPerPage={5}
          tableName="Machines List"
          showFilter
          filterFunction={(row, filter) =>
            row.machineId.toLowerCase().includes(filter.toLowerCase()) ||
            row.name.toLowerCase().includes(filter.toLowerCase())
          }
          onRowClick={(row) => {
            if (editingMachineId !== row._id) {
              navigate(`/machine-profile/${row._id}`);
            }
          }}
        />
      )}

      {/* Add Machine Popup */}
      <AddMachinePopup
        open={openAddMachinePopup}
        onClose={() => setOpenAddMachinePopup(false)}
        productionLineId={id}
        onMachineAdded={() => dispatch(fetchMachinesByProductionLine(id))}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onDelete={handleDelete}
        isDeleting={deleteStatus === "loading"}
        title={"Confirm Machine Deletion"}
        description={
          "Are you sure you want to delete this machine? This action cannot be undone."
        }
      />

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />
    </Box>
  );
};

export default ProductionLineProfile;
