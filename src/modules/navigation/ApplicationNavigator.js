import * as React from 'react';
import {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthenticationStackNavigator from '@modules/navigation/AuthenticationStackNavigator';
import {withTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import MainStackNavigator from '@modules/navigation/MainStackNavigator';
import {StatusBar, StyleSheet} from 'react-native';
import {ThemeAction} from '@persistence/theme/ThemeAction';
import {CurrencyAction} from '@persistence/currency/CurrencyAction';
import {AppLockAction} from '@persistence/applock/AppLockAction';
import {TokenAction} from '@persistence/token/TokenAction';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {WalletAction} from '@persistence/wallet/WalletAction';
import {DEFAULT_WALLET} from '@persistence/wallet/WalletConstant';
import {UserAction} from '@persistence/user/UserAction';
import CommonLoading from '@components/commons/CommonLoading';
import {FeeAction} from '@persistence/fee/FeeAction';

const Drawer = createDrawerNavigator();

function ApplicationNavigator() {
    const {theme, defaultTheme} = useSelector(state => state.ThemeReducer);
    const {loggedIn} = useSelector(state => state.UserReducer);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(ThemeAction.getDefault());
        dispatch(CurrencyAction.getCurrency());
        dispatch(AppLockAction.getAppLock());
        dispatch(TokenAction.getAllTokens());
    }, []);
    return (
        <NavigationContainer
            theme={{
                colors: {
                    background: theme.background,
                },
            }}>
            <StatusBar
                hidden={false}
                backgroundColor={theme.button}
                barStyle={
                    defaultTheme.code === 'light'
                        ? 'dark-content'
                        : 'light-content'
                }
            />

            {loggedIn ? (
                <MainStackNavigator />
            ) : (
                <AuthenticationStackNavigator />
            )}
        </NavigationContainer>
    );
}
export default withTranslation()(ApplicationNavigator);
