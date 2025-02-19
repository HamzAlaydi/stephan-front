import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // Import Outlet to render child routes
import "./MainLayout.css";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { Drawer, useMediaQuery, useTheme } from "@mui/material";
import FloatingNavbar from "../FloatingNavbar/FloatingNavbar";

const MainLayout = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // Detect small screens
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // For mobile drawer

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen); // Toggle mobile drawer
  };

  return (
    <div className="main-layout">
      {/* Floating Navbar for Small Screens */}
      {isSmallScreen && (
        <FloatingNavbar
          toggleDrawer={toggleDrawer}
          isSmallScreen={isSmallScreen}
        />
      )}

      {/* Sidebar for Larger Screens */}
      {!isSmallScreen && (
        <div className="sidebar">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`main-content ${
          isSmallScreen ? "without-sidebar" : "with-sidebar"
        }`}
      >
        {/* Render the child routes */}
        <div className="page-content">
          {/* Header */}
          {!isSmallScreen && <Header />}

          <Outlet />
        </div>
      </div>

      {/* Mobile Drawer for Navigation */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <div style={{ width: 250 }}>
          <Sidebar />
        </div>
      </Drawer>
    </div>
  );
};

export default MainLayout;
