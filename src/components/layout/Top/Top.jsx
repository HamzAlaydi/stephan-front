import React from "react";
import PropTypes from "prop-types";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";
import "./Top.css";

const Top = ({ title, btnName = false, onButtonClick }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // Detect small screens

  return (
    <Box>
      <Grid
        container
        alignItems="center"
        justifyContent={isSmallScreen ? "space-between" : "space-between"}
        spacing={2}
        mb={2}
      >
        <Grid item xs={8} sm={6} md={6}>
          <h3 gutterBottom className="page-title">
            {title}
          </h3>
        </Grid>
        {btnName && (
          <Grid item xs={4} sm={6} md={6} container justifyContent="flex-end">
            <button
              className="big-right-btn"
              onClick={onButtonClick}
              aria-label={btnName}
            >
              {btnName}
            </button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

Top.propTypes = {
  title: PropTypes.string.isRequired,
  btnName: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onButtonClick: PropTypes.func,
};
export default Top;
