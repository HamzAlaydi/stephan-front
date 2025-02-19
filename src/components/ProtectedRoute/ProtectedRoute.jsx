import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { validateToken } from "../../utils/validateToken";
import { logout } from "../../redux/slices/authSlice";
import { accessConfig } from "../../utils/accessConfig"; // Import the access configuration
import Loading from "../Loading/Loading";

const ProtectedRoute = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [isValid, setIsValid] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const userDepartment = user?.department?.name.toLowerCase();

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (token) {
        const isValidToken = await validateToken(token);
        setIsValid(isValidToken);

        if (!isValidToken) {
          dispatch(logout());
        }
      } else {
        setIsValid(false);
      }
    };
    checkTokenValidity();
  }, [token, dispatch]);

  if (isValid === null) {
    return <Loading />;
  }

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  // Check if the user's department has access to the current route
  const allowedRoutes = accessConfig[user?.department?.name] || [];
  const isRouteAllowed = allowedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  if (!isRouteAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
