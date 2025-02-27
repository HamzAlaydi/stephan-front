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

  return (
    <div className="login-page">
      <div className="left-section">
        <img src={logo} alt="Stephano Group Logo" className="logo" />
      </div>

      <div className="middle-gear">
        <div className="gear-circle">
          <img src={gearIcon} alt="Gear Icon" className="gear-icon" />
        </div>
      </div>

      <div className="right-section">
        <h2 className="welcome-text">Welcome ...</h2>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            type="email"
            variant="outlined"
            placeholder="Enter Email"
            fullWidth
            className="input-field"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            type="password"
            variant="outlined"
            fullWidth
            placeholder="Enter Password"
            className="input-field"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {serverError && <p className="server-error">{serverError}</p>}

          <button type="submit" className="login-button">
            LOG IN
          </button>
        </form>
      </div>

      <SuccessPopup
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        message="Login Successful!"
      />
    </div>
  );
};

export default Login;
