import React, { useState } from "react";
import { FaUserCircle, FaCaretDown } from "react-icons/fa"; // Example icons
import { useNavigate } from "react-router-dom"; // For navigation
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";
import "./Header.css";
import { rootRoute } from "../../../Root.route";

const Header = () => {
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Assuming user info is stored in Redux

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="header">
      {/* Search Box (commented out) */}
      {/* <div className="search-box">
        <FaSearch className="search-icon" />
        <Input
          variant="outlined"
          type="text"
          placeholder="Search..."
          className="search-input"
          disableUnderline // Remove the underline from MUI Input
        />
      </div> */}
      <div></div>

      {/* Notification Icons and User Info */}
      <div className="notification-icons">
        <div className="user-info">
          {/* <img src={makreSup} className="notification-icon" />
          <img src={billMart} className="notification-icon" /> */}
        </div>
        {/* User Avatar and Dropdown */}
        <div className="user-dropdown" onClick={toggleDropdown}>
          {user?.photo ? (
            <img
              src={`${rootRoute}/uploads/${user.photo}`}
              className="avatar-icon"
              alt="User Avatar"
            />
          ) : (
            <FaUserCircle className="avatar-icon" />
          )}
          <div className="user-details">
            <span className="user-name">{user?.name || "John Doe"}</span>
            <span className="user-department">
              {user?.department?.name || "Dummy Department"}
            </span>
          </div>
          <FaCaretDown className="dropdown-arrow" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
