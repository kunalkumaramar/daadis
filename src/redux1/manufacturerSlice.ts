import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API base URL - adjust according to your environment
const API_BASE_URL = 'https://api.daadis.in';

// Async thunk for fetching manufacturer by code
export const getManufacturerByCode = createAsyncThunk(
  'manufacturer/getByCode',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/manufacturer/find/${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch manufacturer',
      });
    }
  }
);

// Define types - ADD EXPORT HERE
export interface ManufacturerResponse {
  address: string;
}

export interface ManufacturerState {  // ADD EXPORT HERE
  manufacturer: ManufacturerResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ManufacturerState = {
  manufacturer: null,
  loading: false,
  error: null,
};

// Create slice
const manufacturerSlice = createSlice({
  name: 'manufacturer',
  initialState,
  reducers: {
    clearManufacturer: (state) => {
      state.manufacturer = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get manufacturer by code
      .addCase(getManufacturerByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getManufacturerByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.manufacturer = action.payload.data.response;
      })
      .addCase(getManufacturerByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || 'An error occurred';
      });
  },
});

export const { clearManufacturer } = manufacturerSlice.actions;
export default manufacturerSlice.reducer;
