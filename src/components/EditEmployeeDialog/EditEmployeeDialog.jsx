import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
  Avatar,
  Button,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateEmployee, resetUpdateStatus } from "../../redux/slices/employeesSlice";
import { DialogHeader } from "../custom/Dialog/DialogHeader/DialogHeader";
import ActionButtons from "../custom/ActionButtons/ActionButtons";
import "./EmployeeDialog.css";
import { S3 } from "../../Root.route";

const staticDepartments = [
  { _id: "67b5a85c1a5627f2148dbeef", name: "Maintenance Supervisor" },
  { _id: "67b5a907070d7b7bb50f202d", name: "Maintenance Technical" },
  { _id: "67b5a958070d7b7bb50f202f", name: "Production Line Supervisor" },
];

const EditEmployeeDialog = ({ open, onClose, employee, onEmployeeUpdated }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { updateStatus, error } = useSelector((state) => state.employees);

  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    overtimeHoursPrice: "",
    isAdmin: false,
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [changePassword, setChangePassword] = useState(false);

  // Initialize form data when employee prop changes
  useEffect(() => {
    if (employee) {
      setEmployeeData({
        name: employee.name || "",
        email: employee.email || "",
        password: "",
        confirmPassword: "",
        department: employee.department?._id || "",
        overtimeHoursPrice: employee.overtimeHoursPrice || "",
        isAdmin: employee.isAdmin || false,
        photo: null,
      });

      if (employee.photo) {
        setPhotoPreview(`${S3}/${employee.photo}`);
      } else {
        setPhotoPreview(null);
      }
    }
  }, [employee]);

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

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployeeData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!employeeData.name.trim()) newErrors.name = "Name is required";
    if (!employeeData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(employeeData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!employeeData.department) newErrors.department = "Department is required";
    if (changePassword) {
      if (!employeeData.password) {
        newErrors.password = "Password is required";
      } else if (employeeData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (employeeData.password !== employeeData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    if (employeeData.overtimeHoursPrice && isNaN(employeeData.overtimeHoursPrice)) {
      newErrors.overtimeHoursPrice = "Must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const formData = new FormData();
  
    // Append changed fields
    if (employeeData.name !== employee.name) formData.append("name", employeeData.name);
    if (employeeData.email !== employee.email) formData.append("email", employeeData.email);
    if (employeeData.department !== employee.department._id) formData.append("department", employeeData.department);
    if (employeeData.overtimeHoursPrice.toString() !== employee.overtimeHoursPrice.toString()) {
      formData.append("overtimeHoursPrice", employeeData.overtimeHoursPrice);
    }
    if (employeeData.isAdmin !== employee.isAdmin) formData.append("isAdmin", employeeData.isAdmin);
    if (changePassword && employeeData.password) formData.append("password", employeeData.password);
  
    // Append the file from the file input
    if (employeeData.photo instanceof File) {
      formData.append("photo", employeeData.photo); // Key must match multer's field name
    }
  
    try {
      await dispatch(updateEmployee({ id: employee._id, employeeData: formData })).unwrap();
      onEmployeeUpdated();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      showToast({ message: "Failed to update employee", type: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogHeader onClose={onClose} title="Edit Employee" />

      <DialogContent className="dialogContent">
        <form>
          <Grid container spacing={isMobile ? 2 : 3}>
            {errors.submit && (
              <Grid item xs={12}>
                <Typography color="error">{errors.submit}</Typography>
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

            {/* Change Password Toggle */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                    color="primary"
                  />
                }
                label="Change Password"
              />
            </Grid>

            {/* Password Fields (Conditional) */}
            {changePassword && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="New Password"
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
              </>
            )}

            {/* Department Field */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.department} required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={employeeData.department}
                  onChange={handleChange}
                  label="Department"
                >
                  {staticDepartments.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
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

            {/* Admin Privileges Toggle */}
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

            {/* Photo Upload */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                {photoPreview && (
                  <Avatar src={photoPreview} sx={{ width: 56, height: 56 }} />
                )}
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                >
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <ActionButtons
          cancelText="Cancel"
          confirmText="Save Changes"
          onCancel={onClose}
          onConfirm={handleSubmit}
          loading={updateStatus === "loading"}
        />
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployeeDialog;