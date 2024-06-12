import {createSlice} from '@reduxjs/toolkit';

const AppLockReducer = createSlice({
    name: 'appLock',
    initialState: {
        appLock: {},
    },
    reducers: {
        getAppLockSuccess(state, {payload}) {
            state.appLock = payload;
        },
        setAppLockSuccess(state, {payload}) {
            state.appLock = payload;
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = AppLockReducer;
// Extract and export each action creator by name
export const {getAppLockSuccess, setAppLockSuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
