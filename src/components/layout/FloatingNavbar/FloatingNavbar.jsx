import React from "react";
import { AppBar, Toolbar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Header from "../Header/Header";

const FloatingNavbar = ({ toggleDrawer, isSmallScreen }) => {
  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0 }} color="inherit">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
        {/* Conditionally render Header based on screen size */}
        {isSmallScreen && <Header />}
      </Toolbar>
    </AppBar>
  );
};

export default FloatingNavbar;
