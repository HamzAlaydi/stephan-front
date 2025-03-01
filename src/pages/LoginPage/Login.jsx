import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextField, Checkbox, FormControlLabel } from "@mui/material";
import { login } from "../../redux/slices/authSlice";
import SuccessPopup from "../../components/SuccessPopup/SuccessPopup";
import "./LoginPage.css";
import logo from "../../assets/images/stephanLogo.png";
import gearIcon from "../../assets/images/gear.png";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [successOpen, setSuccessOpen] = useState(false);
  const [serverError, setServerError] = useState(""); // State to handle login errors

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/maintenance-request");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const response = await dispatch(login(data)).unwrap();

      if (response.token && response._id) {
        localStorage.setItem("token", response.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: response._id,
            name: response.name,
            email: response.email,
            overtimeHoursPrice: response.overtimeHoursPrice,
            isAdmin: response.isAdmin,
            department: response.department,
            photo: response.photo,
          })
        );

        setSuccessOpen(true);

        navigate("/maintenance-request");
      } else {
        throw new Error("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setServerError(error.message || "Invalid email or password.");
    }
  };

  return <div className="login-page">بسم الله الرحمن الرحيم</div>;
};

export default Login;
