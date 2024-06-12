import { createSlice } from "@reduxjs/toolkit";

const MarketReducer = createSlice({
  name: "market",
  initialState: {
    markets: [],
  },
  reducers: {
    getMarketsSuccess(state, { payload }) {
      state.markets = payload;
    },
  },
});
// Extract the action creators object and the reducer
const { actions, reducer } = MarketReducer;
// Extract and export each action creator by name
export const { getMarketsSuccess } = actions;
// Export the reducer, either as a default or named export
export default reducer;
