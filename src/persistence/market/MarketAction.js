import {getMarketsSuccess} from '@persistence/market/MarketReducer';
import {MarketService} from '@persistence/market/MarketService';
import {sleep} from '@src/utils/ThreadUtil';

export const MarketAction = {
    getMarkets,
};

function getMarkets(limit, sparkline) {
    return async dispatch => {
        var result = [];
        const {success, data} = await MarketService.getMarkets(
            limit,
            sparkline,
        );
        if (success === true) {
            result = [...data];
            dispatch(getMarketsSuccess(result));
        }
        return {success, result};
    };
}
