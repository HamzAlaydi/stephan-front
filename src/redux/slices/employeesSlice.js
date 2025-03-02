import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { rootRoute } from "../../Root.route";

// Fetch all employees
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      const response = await axios.get(`${rootRoute}/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// In employeesSlice.js - createEmployee thunk
export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      const response = await axios.post(
        `${rootRoute}/auth/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, employeeData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Ensure correct Content-Type
        },
      };

      const response = await axios.patch(
        `${rootRoute}/auth/${id}`,
        employeeData,
        config
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      await axios.delete(`${rootRoute}/auth/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    employees: [],
    status: "idle",
    error: null,
    createStatus: "idle",
    updateStatus: "idle",
    deleteStatus: "idle",
  },
  reducers: {
    resetStatus: (state) => {
      state.createStatus = "idle";
      state.updateStatus = "idle";
      state.deleteStatus = "idle";
      state.error = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = "idle";
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = action.payload;
        state.error = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(createEmployee.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.employees.findIndex(
          (employee) => employee._id === action.payload._id
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.employees = state.employees.filter(
          (employee) => employee._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { resetStatus, resetCreateStatus, resetUpdateStatus } =
  employeesSlice.actions;
export default employeesSlice.reducer;
