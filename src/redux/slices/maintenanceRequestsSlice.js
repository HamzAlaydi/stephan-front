import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { rootRoute } from "../../Root.route";

// Async thunk to fetch maintenance requests
export const fetchMaintenanceRequests = createAsyncThunk(
  "maintenanceRequests/fetchMaintenanceRequests",
  async ({ page = 1, limit = 10, filters = {}, user }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${rootRoute}/request/`, {
        params: { page, limit, user, ...filters },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch single request
export const fetchSingleRequest = createAsyncThunk(
  "maintenanceRequests/fetchSingleRequest",
  async (requestId) => {
    const response = await axios.get(`${rootRoute}/request/${requestId}`);
    return response.data;
  }
);

// Async thunk to fetch maintenance staff
export const fetchMaintenanceStaff = createAsyncThunk(
  "maintenanceRequests/fetchMaintenanceStaff",
  async () => {
    const response = await axios.get(`${rootRoute}/request/staff`);
    return response.data;
  }
);

// Async thunk to assign request
export const assignRequest = createAsyncThunk(
  "maintenanceRequests/assignRequest",
  async ({ requestId, assignedTo, priority, assignedBy }) => {
    const response = await axios.post(`${rootRoute}/request/assign`, {
      requestId,
      assignedTo,
      priority,
      assignedBy,
    });
    return response.data;
  }
);

export const updateRequestStatus = createAsyncThunk(
  "maintenanceRequests/updateStatus",
  async ({ requestId, status, scheduledDate }) => {
    const response = await axios.post(`${rootRoute}/request/status`, {
      requestId,
      status,
      scheduledDate,
    });
    return response.data;
  }
);

export const addSpareParts = createAsyncThunk(
  "maintenanceRequests/addSpareParts",
  async ({ requestId, spareParts, solution, recommendations }) => {
    const response = await axios.post(`${rootRoute}/request/spare-parts`, {
      requestId,
      spareParts,
      solution,
      recommendations,
    });
    return response.data;
  }
);

const maintenanceRequestsSlice = createSlice({
  name: "maintenanceRequests",
  initialState: {
    requests: [],
    pagination: {
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: 10,
    },
    selectedRequest: null,
    maintenanceStaff: [], // Added for storing maintenance staff
    status: "idle",
    error: null,
    assignmentStatus: "idle", // Added for tracking assignment status
  },
  reducers: {
    // Reset assignment status
    resetAssignmentStatus: (state) => {
      state.assignmentStatus = "idle";
    },
  },
  extraReducers(builder) {
    builder
      // Fetch Maintenance Requests
      .addCase(fetchMaintenanceRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMaintenanceRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requests = action.payload.requests;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMaintenanceRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Fetch Single Request
      .addCase(fetchSingleRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSingleRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedRequest = action.payload;
      })
      .addCase(fetchSingleRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Fetch Maintenance Staff
      .addCase(fetchMaintenanceStaff.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMaintenanceStaff.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maintenanceStaff = action.payload;
      })
      .addCase(fetchMaintenanceStaff.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Assign Request
      .addCase(assignRequest.pending, (state) => {
        state.assignmentStatus = "loading";
      })
      .addCase(assignRequest.fulfilled, (state, action) => {
        state.assignmentStatus = "succeeded";
        // Update the request in the list
        const index = state.requests.findIndex(
          (req) => req._id === action.payload._id
        );
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        // Update selected request if it's the same
        if (state.selectedRequest?._id === action.payload._id) {
          state.selectedRequest = action.payload;
        }
      })
      .addCase(assignRequest.rejected, (state, action) => {
        state.assignmentStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetAssignmentStatus } = maintenanceRequestsSlice.actions;
export default maintenanceRequestsSlice.reducer;
