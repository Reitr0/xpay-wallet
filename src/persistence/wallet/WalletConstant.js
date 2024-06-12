import {
    bsc,
    btc,
    eth,
    polygon,
    tron,
    solana,
    xusdts,
    xusdt,
    xusdtp,
    xusdtb,
    mxgs,
    mxg,
    mxgp,
    mxgb,
    usdtb,
    usdts,
} from '@modules/core/constant/constant';
import {applicationProperties} from '@src/application.properties';

export const WALLET_TYPE = {
    MANY: 1,
    ONE: 2,
};
export const WALLET_LIST_KEY = '@WALLET_LIST_KEY';
export const DEFAULT_WALLET = {
    chain: 'ALL',
    name: applicationProperties.defaultWalletName,
    type: WALLET_TYPE.MANY,
    defaultChain: 'ETH',
    logoURI: applicationProperties.logoURI.app,
    coins: [
        btc,
        eth,
        bsc,
        polygon,
        tron,
        solana,
        xusdts,
        mxgs,
        xusdtp,
        xusdtb,
        mxgp,
        mxgb,
        usdtb,
        usdts,
    ],
    tokens: [],
};
export const WALLET_LIST = [DEFAULT_WALLET];
