import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching request data by ID
export const fetchRequestById = createAsyncThunk(
  "getRequest/fetchRequestById",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/requests/${requestId}`); // Replace with your API endpoint
      return response.data; // Return the fetched request data
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch request"
      );
    }
  }
);

const getRequestSlice = createSlice({
  name: "getRequest",
  initialState: {
    requestData: null, // Holds the fetched request data
    loading: false, // Loading state
    error: null, // Error state
  },
  reducers: {
    // Reset the request data when the popup is closed
    resetRequestData(state) {
      state.requestData = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(fetchRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state
      .addCase(fetchRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.requestData = action.payload; // Store the fetched request data
      })
      // Handle rejected state
      .addCase(fetchRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

export const { resetRequestData } = getRequestSlice.actions;

export default getRequestSlice.reducer;
