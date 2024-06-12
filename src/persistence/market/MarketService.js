import {Logs} from '@modules/log/logs';
import {MarketFactory} from '@modules/core/factory/MarketFactory';

export const MarketService = {
    getMarkets,
    getMarketDetail
};

async function getMarkets(limit, sparkline) {
    try {
        const markets = await MarketFactory.getMarkets(limit, sparkline);
        return {
            success: true,
            data: markets,
        };
    } catch (e) {
        Logs.error('MarketService: getMarkets' + e);
        return {
            success: false,
            data: [],
        };
    }
}
async function getMarketDetail(id) {
    try {
        const market = await MarketFactory.getMarketDetail(id);
        return {
            success: true,
            data: market,
        };
    } catch (e) {
        Logs.error('MarketService: getMarketDetail' + e);
        return {
            success: false,
            data: {},
        };
    }
}
