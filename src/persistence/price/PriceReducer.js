import {createSlice} from '@reduxjs/toolkit';

const PriceReducer = createSlice({
    name: 'price',
    initialState: {
        prices: {},
    },
    reducers: {
        getPricesSuccess(state, {payload}) {
            state.prices = payload;
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = PriceReducer;
// Extract and export each action creator by name
export const {getPricesSuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
