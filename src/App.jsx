import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme"; // Centralized theme configuration
import Login from "./pages/LoginPage/Login";
import MainLayout from "./components/layout/MainLayout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import routes from "./routes/routes"; // Routes configuration
import Unauthorized from "./pages/Unauthorized/unauthorized";
import useToast from "./hooks/useToast";
import Toast from "./components/Toast/Toast";
import ScheduleReminder from "./components/ScheduleReminder/ScheduleReminder";

function App() {
  const { toast, hideToast } = useToast();

  return (
    <div className="App">
      <ScheduleReminder />
      <Toast
        open={toast.open}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes */}
            <Route element={<MainLayout />}>
              {routes.map(({ path, component: Component, protected: isProtected, allowedDepartments }) =>
                isProtected ? (
                  <Route
                    key={path}
                    element={<ProtectedRoute allowedDepartments={allowedDepartments} />}
                  >
                    <Route path={path} element={<Component />} /> 
                  </Route>
                ) : (
                  <Route key={path} path={path} element={<Component />} />
                )
                )}
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
