import {createSlice} from '@reduxjs/toolkit';
import {applicationProperties} from '@src/application.properties';

const CurrencyReducer = createSlice({
    name: 'currency',
    initialState: {
        currency: applicationProperties.defaultCurrency,
    },
    reducers: {
        getCurrencySuccess(state, {payload}) {
            state.currency = payload;
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = CurrencyReducer;
// Extract and export each action creator by name
export const {getCurrencySuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
