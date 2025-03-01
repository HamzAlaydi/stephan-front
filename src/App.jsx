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

  return <div className="App">By the name of Allah</div>;
}

export default App;
