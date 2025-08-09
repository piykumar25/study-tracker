import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  q: '',
  subject: '',
  from: '',
  to: '',
  minMins: '',
  sort: 'dateDesc',
  page: 1,
  size: 10,
  editingId: null,
};

const studyLogsSlice = createSlice({
  name: 'studyLogs',
  initialState,
  reducers: {
    setFilter(state, { payload }) { Object.assign(state, payload); state.page = 1; },
    setPage(state, { payload }) { state.page = payload; },
    setEditing(state, { payload }) { state.editingId = payload; },
    resetFilters() { return initialState; },
  },
});

export const { setFilter, setPage, setEditing, resetFilters } = studyLogsSlice.actions;
export default studyLogsSlice.reducer;
