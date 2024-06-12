import { createSlice } from "@reduxjs/toolkit";

const StakingReducer = createSlice({
    name: 'staking',
    initialState: {
        totalStakedBalance: 0,
        stakedBalance : 0,
        stakedHistory : [],

    },
    reducers: {
        getTotalStakedBalanceSuccess(state, {payload}) {
            state.totalStakedBalance = payload;
        },
        getStakedBalanceSuccess(state, {payload}) {
            state.stakedBalance = payload;
        },
        getStakedHistorySuccess(state, {payload}) {
            state.stakedHistory = payload;
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = StakingReducer;
// Extract and export each action creator by name
export const {getTotalStakedBalanceSuccess, getStakedBalanceSuccess,getStakedHistorySuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
