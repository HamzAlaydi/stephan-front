import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box className="not-found-container">
      <Box className="not-found-content">
        <ErrorOutlineIcon className="error-icon" />
        <Typography variant="h1" className="error-code">
          404
        </Typography>
        <Typography variant="h4" className="not-found-title">
          Page Not Found
        </Typography>
        <Typography variant="body1" className="not-found-message">
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          onClick={handleGoHome}
          className="home-button"
        >
          Go to Homepage
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
