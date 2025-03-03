import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  createEmployee,
  resetCreateStatus,
} from "../../redux/slices/employeesSlice";
import { DialogHeader } from "../custom/Dialog/DialogHeader/DialogHeader";
import ActionButtons from "../custom/ActionButtons/ActionButtons";
import "./EmployeeDialog.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments } from "../../redux/slices/departmentsSlice";

const AddEmployeePopup = ({
  open,
  onClose,
  onEmployeeAdded,
  onError,
  addIcon = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { createStatus, error } = useSelector((state) => state.employees);
  const [serverError, setServerError] = useState(null);
  const {
    departments,
    status: deptStatus,
    error: deptError,
  } = useSelector((state) => state.departments);

  // Employee form state
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    overtimeHoursPrice: "",
    isAdmin: false,
    photo: null, // For file upload
  });

  const [errors, setErrors] = useState({});

  // Reset form and close dialog
  const handleClose = () => {
    resetForm();
    onClose();
    dispatch(resetCreateStatus());
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployeeData((prev) => ({ ...prev, photo: file }));
    }
  };
  // Reset form to initial state
  const resetForm = () => {
    setEmployeeData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      overtimeHoursPrice: "",
      isAdmin: false,
    });
    setErrors({});
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!employeeData.name.trim()) newErrors.name = "Name is required";
    if (!employeeData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(employeeData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!employeeData.password) {
      newErrors.password = "Password is required";
    } else if (employeeData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (employeeData.password !== employeeData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!employeeData.department)
      newErrors.department = "Department is required";
    if (
      employeeData.overtimeHoursPrice &&
      isNaN(employeeData.overtimeHoursPrice)
    ) {
      newErrors.overtimeHoursPrice = "Must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Append all fields including the photo
      formData.append("photo", employeeData.photo); // Must be first
      Object.keys(employeeData).forEach((key) => {
        if (key !== "photo") {
          formData.append(key, employeeData[key]);
        }
      });

      await dispatch(createEmployee(formData));

      window.location.reload(); // Reload the page after successful submission
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  useEffect(() => {
    if (open) {
      dispatch(fetchDepartments());
    }
  }, [open, dispatch]);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogHeader
        onClose={onClose}
        title="Add New Employee"
        addIcon={addIcon}
      />

      <DialogContent className="dialogContent">
        <form>
          <Grid container spacing={isMobile ? 2 : 3}>
            {/* Server Error */}
            {serverError && (
              <Grid item xs={12}>
                <Typography color="error">{serverError}</Typography>
              </Grid>
            )}

            {/* Name Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={employeeData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                value={employeeData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>

            {/* Password Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                value={employeeData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
              />
            </Grid>

            {/* Confirm Password Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                fullWidth
                value={employeeData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
              />
            </Grid>

            {/* Department Field */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.department} required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={employeeData.department}
                  onChange={handleChange}
                  label="Department"
                  disabled={deptStatus === "loading"}
                >
                  {deptStatus === "loading" ? (
                    <MenuItem disabled>Loading departments...</MenuItem>
                  ) : deptError ? (
                    <MenuItem disabled>{deptError}</MenuItem>
                  ) : (
                    departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.department && (
                  <FormHelperText>{errors.department}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Overtime Rate Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Overtime Rate"
                name="overtimeHoursPrice"
                type="number"
                fullWidth
                value={employeeData.overtimeHoursPrice}
                onChange={handleChange}
                error={!!errors.overtimeHoursPrice}
                helperText={errors.overtimeHoursPrice}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Admin Privileges Switch */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={employeeData.isAdmin}
                    onChange={handleChange}
                    name="isAdmin"
                    color="primary"
                  />
                }
                label="Admin Privileges"
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="employee-photo-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="employee-photo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AttachFileIcon />}
                >
                  Upload Profile Photo
                </Button>
              </label>
              {employeeData.photo && (
                <Typography variant="caption">
                  {employeeData.photo.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <ActionButtons
          cancelText="Cancel"
          confirmText="Add Employee"
          onCancel={handleClose}
          onConfirm={handleSubmit}
          loading={createStatus === "loading"}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeePopup;
