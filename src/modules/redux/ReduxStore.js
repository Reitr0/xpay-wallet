import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import ThemeReducer from '@persistence/theme/ThemeReducer';
import UserReducer from '@persistence/user/UserReducer';
import CurrencyReducer from '@persistence/currency/CurrencyReducer';
import TokenReducer from '@persistence/token/TokenReducer';
import AppLockReducer from '@persistence/applock/AppLockReducer';
import WalletReducer from '@persistence/wallet/WalletReducer';
import MarketReducer from '@persistence/market/MarketReducer';
import WalletConnectReducer from '@persistence/walletconnect/WalletConnectReducer';
import FeeReducer from '@persistence/fee/FeeReducer';
import NotifyReducer from '@persistence/notify/NotifyReducer';
import PriceAlertReducer from '@persistence/pricealert/PriceAlertReducer';
import PriceReducer from '@persistence/price/PriceReducer';
import StakingReducer from '@persistence/staking/StakingReducer';

const ReduxStore = configureStore({
    reducer: {
        ThemeReducer,
        UserReducer,
        CurrencyReducer,
        TokenReducer,
        AppLockReducer,
        WalletReducer,
        MarketReducer,
        WalletConnectReducer,
        PriceAlertReducer,
        NotifyReducer,
        FeeReducer,
        PriceReducer,
        StakingReducer,
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
});
export default ReduxStore;
