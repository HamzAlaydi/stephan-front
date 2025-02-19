import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { rootRoute } from "../../Root.route";

export const createMachine = createAsyncThunk(
  "machines/create",
  async (machineData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${rootRoute}/machines`, machineData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMachinesByProductionLine = createAsyncThunk(
  "machines/fetchByProductionLine",
  async (productionLineId, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get(
      `${rootRoute}/machines?productionLine=${productionLineId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }
);

export const fetchMaintenanceHistory = createAsyncThunk(
  "machines/fetchMaintenanceHistory",
  async (machineId, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get(
      `${rootRoute}/machines/${machineId}/maintenance-history`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

export const fetchMachineDetailsWithMaintenance = createAsyncThunk(
  "machines/fetchDetailsWithMaintenance",
  async (machineId, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get(
      `${rootRoute}/machines/${machineId}/details`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

export const updateMachine = createAsyncThunk(
  "machines/updateMachine",
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.patch(
        `${rootRoute}/machines/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update machine"
      );
    }
  }
);

export const deleteMachine = createAsyncThunk(
  "machines/deleteMachine",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${rootRoute}/machines/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete machine"
      );
    }
  }
);

export const fetchMachineDetails = createAsyncThunk(
  "machines/fetchDetails",
  async (machineId, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get(`${rootRoute}/machines/${machineId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

const machinesSlice = createSlice({
  name: "machines",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    updateStatus: "idle",
    deleteStatus: "idle",
    maintenanceHistory: null, // Add this for maintenance history
    machineDetailsWithMaintenance: null, // Add this for machine details with maintenance
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Machines
      .addCase(fetchMachinesByProductionLine.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMachinesByProductionLine.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchMachinesByProductionLine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch Maintenance History
      .addCase(fetchMaintenanceHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMaintenanceHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maintenanceHistory = action.payload; // Store fetched maintenance history
      })
      .addCase(fetchMaintenanceHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch Machine Details With Maintenance
      .addCase(fetchMachineDetailsWithMaintenance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchMachineDetailsWithMaintenance.fulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.machineDetailsWithMaintenance = action.payload; // Store fetched machine details with maintenance
        }
      )
      .addCase(fetchMachineDetailsWithMaintenance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Update Machine
      .addCase(updateMachine.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(updateMachine.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.list = state.list.map((machine) =>
          machine._id === action.payload._id ? action.payload : machine
        );
      })
      .addCase(updateMachine.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload;
      })
      // Delete Machine
      .addCase(deleteMachine.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.list = state.list.filter(
          (machine) => machine._id !== action.payload
        );
      })
      .addCase(deleteMachine.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload;
      })
      .addCase(createMachine.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createMachine.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(createMachine.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default machinesSlice.reducer;
