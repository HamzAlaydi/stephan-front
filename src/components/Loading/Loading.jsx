import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import "./Loading.css";

const Loading = ({ message = "Loading..." }) => {
  return (
    <Box className="loading-container">
      <Box className="loading-content">
        <CircularProgress className="loading-spinner" size={60} thickness={4} />
        <Typography variant="h6" className="loading-text">
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default Loading;
