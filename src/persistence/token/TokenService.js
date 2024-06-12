import CommonAPI from '@modules/api/CommonAPI';
import {StorageService} from '@modules/core/storage/StorageService';
const CUSTOM_TOKEN_LIST = '@CUSTOM_TOKEN_LIST';
export const TokenService = {
    getAllTokens,
    addToken,
    getTokenId,
};

async function getAllTokens() {
    const {success, data} = await CommonAPI.get('/content/tokens.json');
    if (success === true) {
        const customTokenList = (await StorageService.getItem(
            CUSTOM_TOKEN_LIST,
        )) || {
            ALL: [],
            BSC: [],
            ETH: [],
            POLYGON: [],
        };
        const {ALL, ETH, BSC, POLYGON} = customTokenList;
        return {
            success,
            data: {
                ALL: [...data.ALL, ...ALL],
                ETH: [...data.ETH, ...ETH],
                BSC: [...data.BSC, ...BSC],
                POLYGON: [...data.POLYGON, ...POLYGON],
            },
        };
    }
    return {success, data};
}
async function addToken(token) {
    const customTokenList = (await StorageService.getItem(
        CUSTOM_TOKEN_LIST,
    )) || {
        ALL: [],
        BSC: [],
        ETH: [],
        POLYGON: [],
    };
    let all = customTokenList.ALL;
    all.push(token);
    let eth = customTokenList.ETH;
    let bsc = customTokenList.BSC;
    let polygon = customTokenList.POLYGON;
    switch (token.chainId) {
        case 1:
            eth.push(token);
            break;
        case 56:
            bsc.push(token);
            break;
        case 137:
            polygon.push(token);
            break;
    }
    const res = {
        ALL: all,
        ETH: eth,
        BSC: bsc,
        POLYGON: polygon,
    };
    await StorageService.setItem(CUSTOM_TOKEN_LIST, res);
    return {
        success: true,
        data: res,
    };
}
async function getTokenId(token) {
    const {success, data} = await CommonAPI.get(
        '/api/v1/public/coin-gecko?id=' +
            token.address +
            '&symbol=' +
            token.symbol +
            '&chainId=' +
            token.chainId +
            '&name=' +
            token.name,
        {},
    );
    return {success, data};
}
