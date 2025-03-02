import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  Button,
  Avatar,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import Top from "../../components/layout/Top/Top";
import PMTable from "../../components/PMTable/PMTable";
import Loading from "../../components/Loading/Loading";
import Toast from "../../components/Toast/Toast";
import useToast from "../../hooks/useToast";
import DeleteConfirmDialog from "../../components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import {
  fetchEmployees,
  deleteEmployee,
  resetStatus,
} from "../../redux/slices/employeesSlice";
import EditEmployeeDialog from "../../components/EditEmployeeDialog/EditEmployeeDialog";
import AddEmployeePopup from "../../components/AddEmployeePopup/AddEmployeePopup";
import { S3 } from "../../Root.route";

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings = () => {
  const dispatch = useDispatch();
  const { showToast, toast, hideToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [openAddEmployeePopup, setOpenAddEmployeePopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const { employees, status, error, deleteStatus } = useSelector(
    (state) => state.employees
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEmployees());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "failed") {
      showToast({
        message: error || "Failed to load employees",
        type: "error",
      });
    }
  }, [status, error, showToast]);

  useEffect(() => {
    if (deleteStatus === "succeeded") {
      showToast({
        message: "Employee deleted successfully",
        type: "success",
      });
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
      dispatch(resetStatus());
      dispatch(fetchEmployees()); // Refresh the data
    } else if (deleteStatus === "failed") {
      showToast({
        message: error || "Failed to delete employee",
        type: "error",
      });
    }
  }, [deleteStatus, error, showToast, dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddEmployee = () => {
    setOpenAddEmployeePopup(true);
  };

  const handleEmployeeAdded = () => {
    dispatch(fetchEmployees());
    showToast({
      message: "Employee added successfully!",
      type: "success",
    });
  };

  const handleEmployeeUpdated = () => {
    dispatch(fetchEmployees());
    showToast({
      message: "Employee updated successfully!",
      type: "success",
    });
  };

  const confirmDelete = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;
    dispatch(deleteEmployee(employeeToDelete));
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setOpenEditDialog(true);
  };

  const employeeColumns = [
    {
      key: "photo",
      label: "",
      render: (row) => (
        <Avatar
          src={`${S3}/${row.photo}` || "/placeholder-user.png"}
          alt={row.name}
          sx={{ width: 40, height: 40 }}
        />
      ),
    },
    { key: "name", label: "Name", render: (row) => row.name || "N/A" },
    { key: "email", label: "Email", render: (row) => row.email || "N/A" },
    {
      key: "department",
      label: "Department",
      render: (row) => row.department?.name || "N/A",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <IconButton
            onClick={() => handleEditEmployee(row)}
            color="primary"
            size="small"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => confirmDelete(row._id)}
            color="error"
            size="small"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const filterFunction = (row, filter) => {
    const searchText = filter.toLowerCase();
    return (
      (row.name && row.name.toLowerCase().includes(searchText)) ||
      (row.email && row.email.toLowerCase().includes(searchText)) ||
      (row.department?.name &&
        row.department.name.toLowerCase().includes(searchText))
    );
  };

  return (
    <Box
      sx={{ flexGrow: 1, overflowX: "hidden" }}
      className="normal-page-style"
    >
      <Top
        title="Settings"
        btnName="Add Employee"
        onButtonClick={handleAddEmployee}
      />

      <Paper sx={{ p: 2, mt: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="settings-tabs"
        >
          <Tab label="Employees" />
          <Tab label="Other Settings" />
        </Tabs>
        <Divider sx={{ my: 2 }} />

        <TabPanel value={tabValue} index={0}>
          {status === "loading" ? (
            <Loading />
          ) : (
            <PMTable
              columns={employeeColumns}
              data={employees}
              dataKey="id"
              rowKey={(row) => row.id}
              pagination
              itemsPerPage={5}
              tableName="Employees List"
              showFilter
              filterFunction={filterFunction}
              filterPlaceholder="Search employees..."
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6">Other Settings Coming Soon...</Typography>
        </TabPanel>
      </Paper>

      <AddEmployeePopup
        open={openAddEmployeePopup}
        onClose={() => setOpenAddEmployeePopup(false)}
        onEmployeeAdded={handleEmployeeAdded}
        onError={(error) => {
          showToast({
            message: error,
            type: "error",
          });
        }}
      />

      <EditEmployeeDialog
        open={openEditDialog}
        employee={selectedEmployee}
        onClose={() => setOpenEditDialog(false)}
        onEmployeeUpdated={handleEmployeeUpdated}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onDelete={handleDelete}
        title="Delete Employee"
        description="Are you sure you want to delete this employee?"
        isDeleting={deleteStatus === "loading"}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </Box>
  );
};

export default Settings;