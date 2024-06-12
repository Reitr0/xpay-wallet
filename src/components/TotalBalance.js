import * as React from 'react';
import {usePriceDetailHook} from '@persistence/price/PriceHook';
import Price from '@components/Price';
import {useSelector} from 'react-redux';
import Balance from '@components/Balance';
import {useEffect, useState} from 'react';
import CommonText from '@components/commons/CommonText';
import {StyleSheet, View} from 'react-native';
import Icon, {Icons} from '@components/icons/Icons';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';

function TotalBalance({style, id, decimals = 5, ...rest}) {
    const {activeWallet} = useSelector(state => state.WalletReducer);
    const [hide, setHide] = useState(true);
    useEffect(() => {}, []);
    return (
        <Price style={style} decimals={decimals} {...rest}>
            {activeWallet.totalBalance}
        </Price>
    );
}
export default TotalBalance;
