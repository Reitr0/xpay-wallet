import {createSlice} from '@reduxjs/toolkit';

const TokenReducer = createSlice({
    name: 'token',
    initialState: {
        ALL: [],
        ETH: [],
        BSC: [],
        POLYGON: [],
    },
    reducers: {
        getAllTokensSuccess(state, {payload}) {
            const {ALL, ETH, BSC, POLYGON} = payload;
            state.ALL = ALL;
            state.ETH = ETH;
            state.BSC = BSC;
            state.POLYGON = POLYGON;
        },
        addTokenSuccess(state, {payload}) {
            const {ALL, ETH, BSC, POLYGON} = payload;
            state.ALL = [...state.ALL, ...ALL];
            state.ETH = [...state.ETH, ...ETH];
            state.BSC = [...state.BSC, ...BSC];
            state.POLYGON = [...state.POLYGON, ...POLYGON];
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = TokenReducer;
// Extract and export each action creator by name
export const {getAllTokensSuccess, addTokenSuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
