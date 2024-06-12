import {AppLockService} from '@persistence/applock/AppLockService';
import {
    getAppLockSuccess,
    setAppLockSuccess,
} from '@persistence/applock/AppLockReducer';

export const AppLockAction = {
    setAppLock,
    getAppLock,
};

function setAppLock(appLock) {
    return async dispatch => {
        await AppLockService.setAppLock(JSON.stringify(appLock));
        dispatch(setAppLockSuccess(appLock));
        return appLock;
    };
}

function getAppLock() {
    return async dispatch => {
        const appLock = await AppLockService.getAppLock();
        dispatch(getAppLockSuccess(appLock));
        return appLock;
    };
}
