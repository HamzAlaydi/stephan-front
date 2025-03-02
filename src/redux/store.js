import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // Import your slices here
import requestReducer from "./slices/requestSlice"; // Import the request slice
import getRequestReducer from "./slices/getRequestSlice"; // Import the request slice
import maintenanceRequestsReducer from "./slices/maintenanceRequestsSlice";
import productionLinesReducer from "./slices/productionLinesSlice";
import machinesReducer from "./slices/machinesSlice";
import employeeReducer from "./slices/employeesSlice";
const store = configureStore({
  reducer: {
    auth: authReducer, // Add your reducers here
    request: requestReducer,
    productionLines: productionLinesReducer,
    machines: machinesReducer,
    getRequest: getRequestReducer, // New slice
    maintenanceRequests: maintenanceRequestsReducer,
    employees: employeeReducer,
  },
});

export default store;
