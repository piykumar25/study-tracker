import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studyLogService } from '../../services/studyLogService' // hypothetical service for API calls
export const fetchStudyLogs = createAsyncThunk(
  'studyLogs/fetchAll',
  async () => {
    const data = await studyLogService.fetchLogs();  // simulate backend fetch
    return data;
  }
);

// Define the initial state for studyLogs slice.
const initialState = {
  logs: [],            // array of study log entries
  status: 'idle',      // status for async operations: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null          // error message for failed async calls (if any)
};

// Create the slice with name, initial state, and reducers.
const studyLogsSlice = createSlice({
  name: 'studyLogs',
  initialState,
  reducers: {
    // Add a new study log entry
    addLog: (state, action) => {
      // Expect action.payload to be an object {id, subject, duration, date, notes}
      state.logs.push(action.payload);
    },
    // Update an existing log entry
    updateLog: (state, action) => {
      // action.payload: {id, updatedFields...}
      const { id, subject, duration, date, notes } = action.payload;
      const existing = state.logs.find(log => log.id === id);
      if (existing) {
        // Update the fields of the found log (using Immer under the hood, so mutation is okay)
        existing.subject = subject;
        existing.duration = duration;
        existing.date = date;
        existing.notes = notes;
      }
    },
    // Delete a log entry by id
    deleteLog: (state, action) => {
      const idToRemove = action.payload;
      state.logs = state.logs.filter(log => log.id !== idToRemove);
    }
  },
  extraReducers: (builder) => {
    // Handle the fetchStudyLogs async thunk actions
    builder
      .addCase(fetchStudyLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudyLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = action.payload;   // load fetched logs into state
      })
      .addCase(fetchStudyLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

// Export actions and reducer for use in components
export const { addLog, updateLog, deleteLog } = studyLogsSlice.actions;
export const studyLogsReducer = studyLogsSlice.reducer;

