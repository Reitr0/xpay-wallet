import {WalletService} from '@persistence/wallet/WalletService';
import {
    addAssetSuccess,
    createWalletSuccess,
    getBalanceSuccess,
    getWalletsSuccess,
    removeWalletSuccess,
    setActiveWalletSuccess,
    updateWalletSuccess,
} from '@persistence/wallet/WalletReducer';

export const WalletAction = {
    insert,
    findAll,
    balance,
    addAsset,
    removeAsset,
    setActiveAsset,
    getActiveAsset,
    setActiveWallet,
    update,
    remove,
};

function insert({
    name,
    type,
    defaultChain,
    mnemonic,
    privateKey,
    coins,
    tokens,
    logoURI,
    chain,
}) {
    return async dispatch => {
        const {success, data} = await WalletService.insert({
            name,
            type,
            defaultChain,
            mnemonic,
            privateKey,
            coins,
            tokens,
            logoURI,
            chain,
        });
        if (success) {
            dispatch(createWalletSuccess(data));
        }
        return {success, data};
    };
}

function update(wallet) {
    return async dispatch => {
        const {success, data} = await WalletService.update(wallet);
        if (success) {
            dispatch(updateWalletSuccess(data));
        }
        return {success, data};
    };
}

function remove(wallet) {
    return async dispatch => {
        const {success, data} = await WalletService.remove(wallet);
        if (success) {
            dispatch(removeWalletSuccess(data));
        }
        return {success, data};
    };
}

function setActiveWallet(wallet) {
    return async dispatch => {
        const {success, data} = await WalletService.setActiveWallet(wallet);
        if (success) {
            dispatch(setActiveWalletSuccess(data));
        }
        return {success, data};
    };
}

function findAll() {
    return async dispatch => {
        const {success, data} = await WalletService.findAll();
        if (success) {
            dispatch(getWalletsSuccess(data));
        }
        return {success, data};
    };
}

function balance() {
    return async dispatch => {
        const {success, data} = await WalletService.balance();
        if (success) {
            dispatch(getBalanceSuccess(data));
        }
        return {success, data};
    };
}

function addAsset(asset) {
    return async dispatch => {
        const {success, data} = await WalletService.addAsset(asset);
        if (success) {
            dispatch(addAssetSuccess(data));
        }
        return {success, data};
    };
}

function removeAsset(asset) {
    return async dispatch => {
        const {success, data} = await WalletService.removeAsset(asset);
        if (success) {
            dispatch(addAssetSuccess(data));
        }
        return {success, data};
    };
}

function setActiveAsset(asset) {
    return async dispatch => {
        const {success, data} = await WalletService.setActiveAsset(asset);
        if (success) {
            dispatch(addAssetSuccess(data));
        }
        return {success, data};
    };
}

function getActiveAsset(chain) {
    return async dispatch => {
        const {success, data} = await WalletService.getActiveAsset(chain);
        if (success) {
            dispatch(addAssetSuccess(data));
        }
        return {success, data};
    };
}
