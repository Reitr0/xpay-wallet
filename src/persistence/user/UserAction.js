import {
    getUserSuccess,
    signInSuccess,
    signOutSuccess,
} from '@persistence/user/UserReducer';
import {StorageService} from '@modules/core/storage/StorageService';
import {UserService} from '@persistence/user/UserService';

export const UserAction = {
    get,
    signIn,
    signOut,
};
function get() {
    return async dispatch => {
        const user = await UserService.get();
        dispatch(getUserSuccess(user));
        return user;
    };
}
function signIn(params) {
    return async dispatch => {
        const {success, data} = await UserService.signIn(params);
        if (success === true) {
            dispatch(signInSuccess(data));
        }
        return {success, data};
    };
}
function signOut() {
    return async dispatch => {
        await StorageService.clear();
        const {success, data} = await UserService.signOut();
        dispatch(signOutSuccess());
    };
}
