import {createSlice} from '@reduxjs/toolkit';

const PriceAlertReducer = createSlice({
    name: 'priceAlert',
    initialState: {
        priceAlertList: [],
        enabled: false,
    },
    reducers: {
        getPriceAlertListSuccess(state, {payload}) {
            state.priceAlertList = payload;
        },
        getPriceAlertStatusSuccess(state, {payload}) {
            state.enabled = payload;
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = PriceAlertReducer;
// Extract and export each action creator by name
export const {getPriceAlertListSuccess, getPriceAlertStatusSuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
