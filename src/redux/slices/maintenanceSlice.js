import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { rootRoute } from "../../Root.route";

// Fetch maintenance history for a machine
export const fetchMaintenanceHistory = createAsyncThunk(
  "maintenance/fetchHistory",
  async (machineId, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get(
      `${rootRoute}/maintenance?machine=${machineId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }
);

// Fetch maintenance details by ID
export const fetchMaintenanceDetails = createAsyncThunk(
  "maintenance/fetchDetails",
  async (maintenanceId, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get(
      `${rootRoute}/maintenance/${maintenanceId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

export const fetchMaintenanceSummary = createAsyncThunk(
  "maintenance/fetchSummary",
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get(`${rootRoute}/maintenance/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);
// Add spare parts and close a maintenance request
export const closeMaintenanceRequest = createAsyncThunk(
  "maintenance/closeRequest",
  async (
    { requestId, spareParts, solution, recommendations },
    { getState }
  ) => {
    const token = getState().auth.token;
    const response = await axios.patch(
      `${rootRoute}/maintenance/${requestId}/close`,
      { spareParts, solution, recommendations },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState: {
    history: [],
    details: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Maintenance History
      .addCase(fetchMaintenanceHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMaintenanceHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.history = action.payload;
      })
      .addCase(fetchMaintenanceHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Fetch Maintenance Details
      .addCase(fetchMaintenanceDetails.pending, (state) => {
        state.details = null;
      })
      .addCase(fetchMaintenanceDetails.fulfilled, (state, action) => {
        state.details = action.payload;
      })

      // Close Maintenance Request
      .addCase(closeMaintenanceRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(closeMaintenanceRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.history = state.history.map((request) =>
          request._id === action.payload._id ? action.payload : request
        );
      })
      .addCase(closeMaintenanceRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default maintenanceSlice.reducer;
