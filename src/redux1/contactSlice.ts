import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BASE_URL = "https://api.daadis.in";

// Types - FIXED: Added missing closing braces
export interface ContactFormData {
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

export interface ContactState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  errorMessage: string;
}

export interface ApiResponse {
  data: {
    success: boolean;
    message: string;
  };
  statusCode: number;
  success: boolean;
}

// FIXED: Proper async thunk declaration
export const sendInfluencerEmail = createAsyncThunk<
  ApiResponse,
  ContactFormData,
  {
    rejectValue: string;
  }
>(
  'contact/sendInfluencerEmail',
  async (contactData: ContactFormData, { rejectWithValue }) => {
    try {
      //console.log('Making API call to:', `${BASE_URL}/auth/send-influencer-email`);
      
      const response = await fetch(`${BASE_URL}/auth/send-influencer-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //credentials: 'include',
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.data?.message || errorData.message || errorMessage;
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
        }
        throw new Error(errorMessage);
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success || !data.data.success) {
        throw new Error(data.data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return rejectWithValue('Network error: Unable to connect to server. Please check if the server is running and your internet connection.');
      }

      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

// Rest of your slice code remains the same...
const initialState: ContactState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  errorMessage: ''
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetContactState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.errorMessage = '';
    },
    clearMessages: (state) => {
      state.message = '';
      state.errorMessage = '';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendInfluencerEmail.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
        state.errorMessage = '';
      })
      .addCase(sendInfluencerEmail.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload.data.message || 'Email sent successfully!';
        state.errorMessage = '';
      })
      .addCase(sendInfluencerEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = '';
        state.errorMessage = action.payload || 'Failed to send email';
      });
  }
});

export const { resetContactState, clearMessages, setLoading } = contactSlice.actions;
export default contactSlice.reducer;
