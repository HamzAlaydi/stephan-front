import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaCaretDown, FaSignOutAlt } from "react-icons/fa"; // Added FaSignOutAlt for logout icon
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";
import "./Header.css";
import { rootRoute, S3 } from "../../../Root.route";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    dispatch(logout());
    navigate("/");
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="header">
      <div></div>

      <div className="notification-icons">
        <div className="user-info">
          {/* Notification icons would go here */}
        </div>

        {/* User Avatar and Dropdown */}
        <div ref={dropdownRef} className="user-dropdown">
          <div className="user-dropdown-trigger" onClick={toggleDropdown}>
            {console.log({ user })}

            {user?.photo ? (
              <img
                src={`${S3}/${user.photo}` || ""}
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
            <FaCaretDown
              className={`dropdown-arrow ${isDropdownOpen ? "rotated" : ""}`}
            />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleSignOut}>
                <FaSignOutAlt className="dropdown-item-icon" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
