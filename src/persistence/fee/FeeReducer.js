import {createSlice} from '@reduxjs/toolkit';

const FeeReducer = createSlice({
    name: 'fee',
    initialState: {
        fee: {},
    },
    reducers: {
        getFeeSuccess(state, {payload}) {
            state.fee = payload;
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = FeeReducer;
// Extract and export each action creator by name
export const {getFeeSuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
