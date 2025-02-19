import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import "./Unauthorized.css";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    // Clear authentication data (adjust according to your authentication setup)
    localStorage.removeItem("token"); // Remove token or session data
    localStorage.removeItem("user"); // Remove user data if stored
    sessionStorage.clear(); // Clear session storage if used

    // Redirect to login page
    navigate("/");
  };

  return (
    <Box className="unauthorized-container">
      <Box className="unauthorized-content">
        <LockIcon className="lock-icon" />
        <Typography variant="h4" className="unauthorized-title">
          Access Denied
        </Typography>
        <Typography variant="body1" className="unauthorized-message">
          You don't have permission to access this page. Please contact your
          administrator for assistance.
        </Typography>
        <Box className="button-group">
          <Button
            variant="contained"
            onClick={handleGoBack}
            className="back-button"
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            className="logout-button"
          >
            Log Out
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Unauthorized;
