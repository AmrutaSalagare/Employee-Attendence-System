import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Check in
export const checkIn = createAsyncThunk(
  'attendance/checkin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/checkin');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check in failed');
    }
  }
);

// Check out
export const checkOut = createAsyncThunk(
  'attendance/checkout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/checkout');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check out failed');
    }
  }
);

// Get today's attendance
export const getTodayAttendance = createAsyncThunk(
  'attendance/today',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/today');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today attendance');
    }
  }
);

// Get my attendance history
export const getMyHistory = createAsyncThunk(
  'attendance/myHistory',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/my-history', {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
    }
  }
);

// Get my summary
export const getMySummary = createAsyncThunk(
  'attendance/mySummary',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/my-summary', {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch summary');
    }
  }
);

// Manager: Get all attendance
export const getAllAttendance = createAsyncThunk(
  'attendance/all',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/all', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

// Manager: Get employee attendance
export const getEmployeeAttendance = createAsyncThunk(
  'attendance/employee',
  async ({ employeeId, month, year }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/attendance/employee/${employeeId}`, {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee attendance');
    }
  }
);

// Manager: Get team summary
export const getTeamSummary = createAsyncThunk(
  'attendance/teamSummary',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/summary', {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team summary');
    }
  }
);

// Manager: Get today's status
export const getTodayStatus = createAsyncThunk(
  'attendance/todayStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/today-status');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today status');
    }
  }
);

// Manager: Export CSV
export const exportAttendance = createAsyncThunk(
  'attendance/export',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/export', {
        params: filters,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance-report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Export failed');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    todayAttendance: null,
    myHistory: [],
    mySummary: null,
    allAttendance: [],
    employeeAttendance: null,
    teamSummary: null,
    todayStatus: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check in
      .addCase(checkIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.loading = false;
        state.todayAttendance = action.payload.attendance;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check out
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        state.todayAttendance = action.payload.attendance;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get today
      .addCase(getTodayAttendance.fulfilled, (state, action) => {
        state.todayAttendance = action.payload.attendance;
      })
      // Get my history
      .addCase(getMyHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.myHistory = action.payload.attendance;
      })
      .addCase(getMyHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get my summary
      .addCase(getMySummary.fulfilled, (state, action) => {
        state.mySummary = action.payload.summary;
      })
      // Get all attendance
      .addCase(getAllAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.allAttendance = action.payload.attendance;
      })
      // Get employee attendance
      .addCase(getEmployeeAttendance.fulfilled, (state, action) => {
        state.employeeAttendance = action.payload;
      })
      // Get team summary
      .addCase(getTeamSummary.fulfilled, (state, action) => {
        state.teamSummary = action.payload.summary;
      })
      // Get today status
      .addCase(getTodayStatus.fulfilled, (state, action) => {
        state.todayStatus = action.payload;
      })
      // Export
      .addCase(exportAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(exportAttendance.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
