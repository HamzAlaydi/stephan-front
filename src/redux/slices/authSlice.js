import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { rootRoute } from "../../Root.route";

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${rootRoute}/auth/login`, credentials);
      return response.data; // Return the response data (user details and token)
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Server is unreachable. Please try again later.",
        }
      );

    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Retrieve user from localStorage
  token: localStorage.getItem("token") || null, // Retrieve token from localStorage
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          overtimeHoursPrice: action.payload.overtimeHoursPrice,
          isAdmin: action.payload.isAdmin,
          department: action.payload.department,
          photo: action.payload.photo,
        }; // Store user details
        state.token = action.payload.token; // Store the token

        // Save the user and token to localStorage for persistence
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("token", state.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
