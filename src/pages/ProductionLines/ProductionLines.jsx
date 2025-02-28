import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Top from "../../components/layout/Top/Top";
import PMTable from "../../components/PMTable/PMTable";
import AddProductionLinePopup from "../../components/AddProductionLinePopup/AddProductionLinePopup";
import {
  fetchProductionLines,
  updateProductionLine,
  deleteProductionLine,
} from "../../redux/slices/productionLinesSlice";
import useToast from "../../hooks/useToast";
import Toast from "../../components/Toast/Toast";
import Loading from "../../components/Loading/Loading";
import DeleteConfirmDialog from "../../components/DeleteConfirmationDialog/DeleteConfirmationDialog";

const ProductionLines = () => {
  const { showToast, toast, hideToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openAddProductionLinePopup, setOpenAddProductionLinePopup] =
    useState(false);
  const [editingProductionLineId, setEditingProductionLineId] = useState(null);
  const [editedProductionLineData, setEditedProductionLineData] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productionLineToDelete, setProductionLineToDelete] = useState(null);

  const {
    lines: productionData,
    status,
    error,
    updateStatus,
    deleteStatus,
  } = useSelector((state) => state.productionLines);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProductionLines());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "failed") {
      showToast({
        message: error || "Failed to load production lines",
        type: "error",
      });
      console.log(error);
    }
  }, [status, error, showToast]);

  useEffect(() => {
    if (updateStatus === "succeeded") {
      dispatch(fetchProductionLines()); // Add this line to refresh data
      setEditingProductionLineId(null);
      setEditedProductionLineData({});
      showToast({
        message: "Production line updated successfully!",
        type: "success",
      });
    }
  }, [updateStatus, error, showToast, dispatch]); // Add dispatch to dependencies

  useEffect(() => {
    if (deleteStatus === "succeeded") {
      showToast({
        message: "Production line deleted successfully",
        type: "success",
      });
      setDeleteConfirmOpen(false);
      setProductionLineToDelete(null);
    } else if (deleteStatus === "failed") {
      showToast({
        message: error || "Failed to delete production line",
        type: "error",
      });
    }
  }, [deleteStatus, error, showToast]);

  const columns = [
    { key: "_id", label: "ID", render: (row) => row.productionId },
    {
      key: "name",
      label: "Production Line Name",
      render: (row) =>
        editingProductionLineId === row._id ? (
          <TextField
            variant="standard"
            value={editedProductionLineData.name || ""}
            onChange={(e) =>
              setEditedProductionLineData({
                ...editedProductionLineData,
                name: e.target.value,
              })
            }
            sx={{ width: "100%" }}
            inputProps={{ maxLength: 50 }}
          />
        ) : (
          row.name
        ),
    },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {editingProductionLineId === row._id ? (
            <>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(row);
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
                disabled={!!editingProductionLineId}
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
                disabled={!!editingProductionLineId}
              >
                <Delete fontSize="small" />
              </IconButton>
            </>
          )}
        </div>
      ),
    },
  ];

  const startEdit = (line) => {
    setEditingProductionLineId(line._id);
    setEditedProductionLineData({ name: line.name });
  };

  const cancelEdit = () => {
    setEditingProductionLineId(null);
    setEditedProductionLineData({});
  };

  const handleSave = (row) => {
    const trimmedName = editedProductionLineData.name?.trim();

    if (!trimmedName) {
      showToast({
        message: "Production line name cannot be empty",
        type: "error",
      });
      return;
    }

    if (row.name === trimmedName) {
      cancelEdit();
      return;
    }

    dispatch(
      updateProductionLine({
        id: row._id,
        productionLineData: { name: trimmedName },
      })
    );
  };


  const confirmDelete = (lineId) => {
    setProductionLineToDelete(lineId);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!productionLineToDelete) return;

    try {
      const result = await dispatch(
        deleteProductionLine(productionLineToDelete)
      ).unwrap();

      setDeleteConfirmOpen(false);
      setProductionLineToDelete(null);
      showToast({
        message: result.message || "Production line deleted successfully",
        type: "success",
      });

      window.location.reload();
    } catch (error) {
      showToast({
        message: error.message || "Failed to delete production line",
        type: "error",
      });
    }
  };

  const filterFunction = (row, filter) => {
    const searchText = filter.toLowerCase();
    return (
      row.name.toLowerCase().includes(searchText) ||
      row.status.toLowerCase().includes(searchText)
    );
  };

  return (
    <Box
      sx={{ flexGrow: 1, overflowX: "hidden" }}
      className="normal-page-style"
    >
      <Top
        title="Production Lines"
        btnName="Add Production Line"
        onButtonClick={() => setOpenAddProductionLinePopup(true)}
      />

      {/* Always show content unless loading */}
      {status === "loading" ? (
        <Loading />
      ) : (
        <>
          <PMTable
            data={productionData}
            columns={columns}
            dataKey="_id"
            rowKey={(row) => row._id}
            pagination
            itemsPerPage={5}
            tableName="Production Lines List"
            showFilter
            filterFunction={filterFunction}
            onRowClick={(row) => {
              if (editingProductionLineId !== row._id) {
                navigate(`/production-line-profile/${row._id}`, {
                  state: {
                    productionLineId: row.productionId,
                    productionLineName: row.name,
                    description: row.description,
                    machines: row.machines,
                  },
                });
              }
            }}
          />

          <AddProductionLinePopup
            open={openAddProductionLinePopup}
            onClose={() => setOpenAddProductionLinePopup(false)}
            onProductionLineAdded={() => dispatch(fetchProductionLines())}
            onError={(error) => {
              showToast({
                message: error,
                type: "error",
              });
            }}
          />

          <DeleteConfirmDialog
            open={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
            onDelete={handleDelete}
            isDeleting={deleteStatus === "loading"}
          />

          <Toast
            open={toast.open}
            onClose={hideToast}
            message={toast.message}
            type={toast.type}
          />
        </>
      )}
    </Box>
  );
};

export default ProductionLines;
