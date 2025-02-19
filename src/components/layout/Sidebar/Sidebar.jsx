import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Sidebar.css";
import logo from "../../../assets/images/stephanLogo.png";
import { Divider } from "@mui/material";
import gearIcon from "../../../assets/icons/gearIcon.png";
import arrowsIcon from "../../../assets/icons/arrows.png";
import toolIcon from "../../../assets/icons/tools.png";
import stockIcon from "../../../assets/icons/stockIcon.png";
import summaryIcon from "../../../assets/icons/summaryIcon.png";
import { accessConfig } from "../../../utils/accessConfig"; // Import the access configuration

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("Maintenance Request");
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  // Sync activeTab with the current route
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/maintenance-request")) {
      setActiveTab("Maintenance Request");
      localStorage.setItem("activeTab", "Maintenance Request");
    } else if (
      path.startsWith("/production-lines") ||
      path.startsWith("/production-line-profile") ||
      path.startsWith("/machine-profile")
    ) {
      setActiveTab("production-lines");
      localStorage.setItem("activeTab", "production-lines");
    } else if (path.startsWith("/settings")) {
      setActiveTab("Settings");
      localStorage.setItem("activeTab", "Settings");
    } else if (path.startsWith("/stock")) {
      setActiveTab("Stock");
      localStorage.setItem("activeTab", "Stock");
    } else if (path.startsWith("/summaries")) {
      setActiveTab("Summaries");
      localStorage.setItem("activeTab", "Summaries");
    } else {
      setActiveTab("Maintenance Request");
      localStorage.setItem("activeTab", "Maintenance Request");
    }
  }, [location.pathname]);

  // On component mount, retrieve the active tab from localStorage
  useEffect(() => {
    const savedActiveTab = localStorage.getItem("activeTab");
    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
    }
  }, []);

  // Function to handle tab clicks
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    localStorage.setItem("activeTab", tabName);

    switch (tabName) {
      case "Maintenance Request":
        navigate("/maintenance-request");
        break;
      case "production-lines":
        navigate("/production-lines");
        break;
      case "Summaries":
        navigate("/summaries");
        break;
      case "Settings":
        navigate("/settings");
        break;
      case "Stock":
        navigate("/stock");
        break;
      default:
        break;
    }
  };

  // Get allowed routes for the user's department
  const allowedRoutes = accessConfig[user?.department?.name] || [];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" className="slogo" />
      </div>

      {/* Spacer */}
      <div className="spacer" />

      {/* Tabs for Maintenance Request and Production Lines */}
      <div className="sidebar-tabs">
        {/* Maintenance Request Tab */}
        {allowedRoutes.includes("/maintenance-request") && (
          <div
            className={`tab ${
              activeTab === "Maintenance Request" ? "active" : ""
            }`}
            onClick={() => handleTabClick("Maintenance Request")}
          >
            <img src={gearIcon} alt="Gear Icon" className="tab-icon" />
            <span>Maintenance Request</span>
          </div>
        )}
        {/* Production Lines Tab */}
        {allowedRoutes.includes("/production-lines") && (
          <div
            className={`tab ${
              activeTab === "production-lines" ? "active" : ""
            }`}
            onClick={() => handleTabClick("production-lines")}
          >
            <img src={arrowsIcon} alt="Arrows Icon" className="tab-icon" />
            <span>Production Lines</span>
          </div>
        )}
        {/* Stock Tab */}
        {allowedRoutes.includes("/stock") && (
          <div
            className={`tab ${activeTab === "Stock" ? "active" : ""}`}
            onClick={() => handleTabClick("Stock")}
          >
            <img src={stockIcon} alt="Stock Icon" className="tab-icon" />
            <span>Stock</span>
          </div>
        )}
        {allowedRoutes.includes("/summaries") && (
          <div
            className={`tab ${activeTab === "Summaries" ? "active" : ""}`}
            onClick={() => handleTabClick("Summaries")}
          >
            <img src={summaryIcon} alt="Summary Icon" className="tab-icon" />
            <span>Summaries</span>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="spacer" />

      {/* Divider */}
      <Divider className="short-divider" />

      {/* Spacer */}
      <div className="spacer" />

      {/* Settings Tab */}
      <div className="sidebar-tabs">
        <div
          className={`tab ${activeTab === "Settings" ? "active" : ""}`}
          onClick={() => handleTabClick("Settings")}
        >
          <img src={toolIcon} alt="Tool Icon" className="tab-icon" />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
