import {getPricesSuccess} from '@persistence/price/PriceReducer';
import {WalletService} from '@persistence/wallet/WalletService';

export const PriceAction = {
    getPrices,
};

function getPrices(data) {
    return async dispatch => {
        const {success, data: walletData} =
            await WalletService.getActiveWallet();
        const coinPrice = {};
        if (success === true) {
            const {activeWallet} = walletData;
            const ids = [...activeWallet.coins, ...activeWallet.tokens];
            ids.forEach(({id}) => {
                coinPrice[id] = data[id] || [0, 0, 0, 0];
            });
        }
        // After logging coinPrice, check for the 'rank' property and add it if necessary
        Object.keys(data).forEach(key => {
            if (data[key] && data[key].rank !== 99999) {
                coinPrice[key] = data[key];
            }
        });
        dispatch(getPricesSuccess(coinPrice));
        return {success: true, data: coinPrice};
    };
}
