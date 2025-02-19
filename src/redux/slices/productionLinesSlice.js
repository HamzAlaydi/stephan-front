import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { rootRoute } from "../../Root.route";

// Fetch production lines
export const fetchProductionLines = createAsyncThunk(
  "productionLines/fetchProductionLines",
  async (_, { getState }) => {
    const state = getState();
    const token = state.auth.token; // Assuming the token is stored in the auth slice

    const response = await axios.get(`${rootRoute}/production-lines`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to the request headers
      },
    });

    return response.data;
  }
);

// Create production line
export const createProductionLine = createAsyncThunk(
  "productionLines/createProductionLine",
  async (productionLineData, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    try {
      const response = await axios.post(
        `${rootRoute}/production-lines`,
        productionLineData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      // Use rejectWithValue to pass the backend error response
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete production line
export const deleteProductionLine = createAsyncThunk(
  "productionLines/deleteProductionLine",
  async (id, { getState }) => {
    const state = getState();
    const token = state.auth.token; // Assuming the token is stored in the auth slice

    await axios.delete(`${rootRoute}/production-lines/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to the request headers
      },
    });

    return id; // Return the id of the deleted production line
  }
);

// Update production line
export const updateProductionLine = createAsyncThunk(
  "productionLines/updateProductionLine",
  async ({ id, productionLineData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token; // Ensure token exists

      if (!id || !productionLineData) {
        return rejectWithValue("Invalid data sent to updateProductionLine");
      }

      const response = await axios.patch(
        `${rootRoute}/production-lines/${id}`,
        productionLineData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

const productionLinesSlice = createSlice({
  name: "productionLines",
  initialState: {
    lines: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProductionLines.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductionLines.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lines = action.payload;
      })
      .addCase(fetchProductionLines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(createProductionLine.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProductionLine.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lines.push(action.payload);
      })
      .addCase(createProductionLine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(deleteProductionLine.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProductionLine.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lines = state.lines.filter((line) => line.id !== action.payload);
      })
      .addCase(deleteProductionLine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(updateProductionLine.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductionLine.fulfilled, (state, action) => {
        const index = state.lines.findIndex(
          (line) => line._id === action.payload._id
        );
        if (index !== -1) {
          state.lines[index] = action.payload;
        }
        state.updateStatus = "succeeded";
      })
      .addCase(updateProductionLine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default productionLinesSlice.reducer;
