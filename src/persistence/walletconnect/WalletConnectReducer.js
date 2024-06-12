import {createSlice} from '@reduxjs/toolkit';

const WalletConnectReducer = createSlice({
    name: 'walletConnect',
    initialState: {
        walletConnectSites: {},
        history: [],
    },
    reducers: {
        onAddSuccess(state, {payload}) {
            state.walletConnectSites = payload.walletConnectSites;
            state.history = payload.history;
        },
        onGetSuccess(state, {payload}) {
            state.walletConnectSites = payload.walletConnectSites;
            state.history = payload.history;
        },
        onRemoveSuccess(state, {payload}) {
            state.walletConnectSites = payload.walletConnectSites;
            state.history = payload.history;
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = WalletConnectReducer;
// Extract and export each action creator by name
export const {onAddSuccess, onGetSuccess, onRemoveSuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
