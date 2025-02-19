import PreviousRequests from "../pages/PreviousRequests/PreviousRequests";
import ProductionLines from "../pages/ProductionLines/ProductionLines";
import ProductionLineProfile from "../pages/ProductionLineProfile/ProductionLineProfile";
import MachineProfile from "../pages/MachineProfile/MachineProfile";
import TechnicianRequests from "../pages/TechnicianRequests/TechnicianRequests";
import Stock from "../pages/Stock/Stock";
import Summaries from "../pages/Summaries/Summaries";
import { useSelector } from "react-redux";

const MaintenanceRequestWrapper = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.department?.name === "maintenance technical") {
    return <TechnicianRequests />;
  }
  return <PreviousRequests />;
};

const routes = [
  {
    path: "/maintenance-request",
    component: <PreviousRequests />,
    protected: true,
    allowedDepartments: [
      "machine supervisor",
      "maintenance supervisor",
      "director supervisor",
      "maintenance technical",
      "production line supervisor",
    ],
  },
  {
    path: "/summaries",
    component: <Summaries />,
    protected: true,
    allowedDepartments: ["maintenance supervisor"],
  },

  {
    path: "/production-lines",
    component: <ProductionLines />,
    protected: true,
    allowedDepartments: ["maintenance supervisor", "director supervisor"],
  },
  {
    path: "/production-line-profile/:id",
    component: <ProductionLineProfile />,
    protected: true,
    allowedDepartments: ["maintenance supervisor", "director supervisor"],
  },
  {
    path: "/machine-profile/:id",
    component: <MachineProfile />,
    protected: true,
    allowedDepartments: ["maintenance supervisor", "director supervisor"],
  },
  {
    path: "/stock",
    component: <Stock />,
    protected: true,
    allowedDepartments: ["director supervisor"],
  },
  {
    path: "/settings",
    component: <p>Settings Page</p>,
    protected: false,
  },
];

export default routes;
