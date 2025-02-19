// features/requestSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { rootRoute } from "../../Root.route";

// Async thunk to submit a new request
export const submitRequest = createAsyncThunk(
  "request/submitRequest",
  async (formData, { rejectWithValue }) => {
    try {
      const formDataToSend = new FormData();

      // Append all fields
      Object.keys(formData).forEach((key) => {
        if (key !== "attachments") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append attachments correctly
      if (formData.attachments) {
        formData.attachments.forEach((file) => {
          formDataToSend.append("attachments", file);
        });
      }

      const response = await axios.post(
        `${rootRoute}/request/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const requestSlice = createSlice({
  name: "request",
  initialState: {
    formData: {
      productionLine: "",
      machineName: "",
      machineId: "",
      productionLineStatus: "",
      machineStatus: "",
      attachments: null,
      failures: "",
      breakDownCauses: "",
    },
    loading: false,
    error: null,
  },
  reducers: {
    // Reducer to update form data
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    // Reducer to reset form data
    resetFormData: (state) => {
      state.formData = {
        productionLine: "",
        machineName: "",
        machineId: "",
        productionLineStatus: "",
        machineStatus: "",
        attachments: null,
        failures: "",
        breakDownCauses: "",
      };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.formData = action.payload; // Update form data with the response
      })
      .addCase(submitRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
  },
});

// Export actions
export const { updateFormData, resetFormData } = requestSlice.actions;

// Export reducer
export default requestSlice.reducer;
