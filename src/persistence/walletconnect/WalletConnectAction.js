import {
    onAddSuccess,
    onGetSuccess,
    onRemoveSuccess,
} from '@persistence/walletconnect/WalletConnectReducer';
import {WalletConnectService} from '@persistence/walletconnect/WalletConnectService';

export const WalletConnectAction = {
    add,
    get,
    remove,
};

function add(params) {
    return async dispatch => {
        const {success, data} = await WalletConnectService.add(params);
        if (success === true) {
            dispatch(onAddSuccess(data));
        }
        return {success, data};
    };
}
function get() {
    return async dispatch => {
        const {success, data} = await WalletConnectService.get();
        if (success === true) {
            dispatch(onGetSuccess(data));
        }
        return {success, data};
    };
}
function remove(uri) {
    return async dispatch => {
        const {success, data} = await WalletConnectService.remove(uri);
        if (success === true) {
            dispatch(onRemoveSuccess(data));
        }
        return {success, data};
    };
}
