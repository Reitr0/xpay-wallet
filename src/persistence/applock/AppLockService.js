import {StorageService} from '@modules/core/storage/StorageService';

async function getAppLock() {
    const appLock = await StorageService.getItem('AppLock');
    return (
        appLock || {
            appLock: true,
            autoLock: 0,
            biometryLock: false,
            appLockText: 'app_lock.immediate',
        }
    );
}

async function setAppLock(appLock) {
    await StorageService.setItem('AppLock', appLock);
    return appLock;
}

export const AppLockService = {
    setAppLock,
    getAppLock,
};
