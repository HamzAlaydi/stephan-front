import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
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
  IconButton,
} from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee } from "../../redux/slices/employeesSlice";

const AddEmployeePopup = ({ open, onClose, onEmployeeAdded, onError }) => {
  const dispatch = useDispatch();
  const { createStatus } = useSelector((state) => state.employees);
  const { departments } = useSelector((state) => state.departments || { departments: [] });
  
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
  
  useEffect(() => {
    if (createStatus === "succeeded") {
      onClose();
      onEmployeeAdded();
      resetForm();
    } else if (createStatus === "failed") {
      const state = store.getState();
      const error = state.employees.error;
      if (error) {
        onError(error);
      }
    }
  }, [createStatus, onClose, onEmployeeAdded, onError]);
  
  const resetForm = () => {
    setEmployeeData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      overtimeHoursPrice: "",
      isAdmin: false,
      photo: null,
    });
    setPhotoPreview(null);
    setErrors({});
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear validation error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployeeData({
        ...employeeData,
        photo: file,
      });
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!employeeData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
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
    
    if (!employeeData.department) {
      newErrors.department = "Department is required";
    }
    
    if (employeeData.overtimeHoursPrice && isNaN(employeeData.overtimeHoursPrice)) {
      newErrors.overtimeHoursPrice = "Must be a number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // Remove confirmPassword as it's not needed in the API
      const { confirmPassword, ...dataToSubmit } = employeeData;
      
      // Convert overtime price to number if it exists
      if (dataToSubmit.overtimeHoursPrice) {
        dataToSubmit.overtimeHoursPrice = Number(dataToSubmit.overtimeHoursPrice);
      }
      
      dispatch(createEmployee(dataToSubmit));
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Add New Employee
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box 
          component="form" 
          sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
          noValidate
        >
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
          
          <FormControl fullWidth error={!!errors.department} required>
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={employeeData.department}
              onChange={handleChange}
              label="Department"
            >
              {departments && departments.map((dept) => (
                <MenuItem key={dept._id} value={dept._id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
            {errors.department && (
              <FormHelperText>{errors.department}</FormHelperText>
            )}
          </FormControl>
          
          <TextField
            label="Overtime Hours Price"
            name="overtimeHoursPrice"
            type="number"
            fullWidth
            value={employeeData.overtimeHoursPrice}
            onChange={handleChange}
            error={!!errors.overtimeHoursPrice}
            helperText={errors.overtimeHoursPrice}
          />
          
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
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Employee Photo (Optional)
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 2 
              }}
            >
              {photoPreview && (
                <Box 
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    borderRadius: '50%', 
                    overflow: 'hidden',
                    border: '1px solid #ccc'
                  }}
                >
                  <img 
                    src={photoPreview} 
                    alt="Employee Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </Box>
              )}
              
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{ mt: 1 }}
              >
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          disabled={createStatus === "loading"}
        >
          {createStatus === "loading" ? (
            <CircularProgress size={24} />
          ) : (
            "Add Employee"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeePopup;