import { configureStore } from '@reduxjs/toolkit';
import { studyLogsApi } from '../services/studyLogsApi';
import studyLogsReducer from '../features/studyLogs/studyLogsSlice';

export const store = configureStore({
  reducer: {
    [studyLogsApi.reducerPath]: studyLogsApi.reducer,
    studyLogs: studyLogsReducer,
  },
  middleware: (getDefault) => getDefault().concat(studyLogsApi.middleware),
});
