import { createSlice } from "@reduxjs/toolkit";

const NotifyReducer = createSlice({
  name: "Notify",
  initialState: {
    notifies: [],
    unread: 0,
    enabled: true,
  },
  reducers: {
    getNotifiesSuccess(state, { payload }) {
      state.notifies = payload.notifies;
      state.unread = payload.unread;
    },
    addNotifySuccess(state, { payload }) {
      state.notifies = payload.notifies;
      state.unread = payload.unread;
    },
    updateNotifySuccess(state, { payload }) {
      state.notifies = payload.notifies;
      state.unread = payload.unread;
    },
    removeNotifySuccess(state, { payload }) {
      state.notifies = payload.notifies;
      state.unread = payload.unread;
    },
    getNotifyStatusSuccess(state, { payload }) {
      state.enabled = payload;
    },
  },
});
// Extract the action creators object and the reducer
const { actions, reducer } = NotifyReducer;
// Extract and export each action creator by name
export const {
  getNotifiesSuccess,
  addNotifySuccess,
  updateNotifySuccess,
  getNotifyStatusSuccess,
  removeNotifySuccess,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;
