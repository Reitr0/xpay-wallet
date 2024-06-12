import HomeScreen from '@screens/home/HomeScreen';
import Icon, {Icons} from '@components/icons/Icons';
import {AppState, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import SettingScreen from '@screens/setting/SettingScreen';
import MarketScreen from '@screens/market/MarketScreen';
import DAppsScreen from '@screens/dapps/DAppsScreen';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import SwapScreen from '@screens/swap/SwapScreen';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import StakingScreen from '@screens/staking/StakingScreen';
import NftScreen from '@screens/nft/NftScreen';
import DummySwapScreen from '@screens/swap/DummySwapScreen';
import {useTranslation} from 'react-i18next';

const Tab = createMaterialTopTabNavigator();

function BottomTabBarNavigator() {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {appLock} = useSelector(state => state.AppLockReducer);
    let timeOut = appLock.autoLock;
    let lock = appLock.appLock;
    let inBackground = false;
    let lastDate = Date.now();
    const navigation = useNavigation();
    const lockState = nextAppState => {
        console.log(
            'Next AppState is: ',
            nextAppState + ' inBackground ' + inBackground,
        );

        if (nextAppState === 'active' && inBackground) {
            const timeDiff = Date.now() - lastDate;
            if (timeDiff > timeOut * 1000) {
                if (lock === true) {
                    navigation.navigate('ReEnterPinCodeScreen');
                }
            }
            inBackground = false;
            lastDate = Date.now();
        } else if (nextAppState === 'background') {
            inBackground = true;
            lastDate = Date.now();
        }
    };

    const handleAppStateChange = nextAppState => {
        lockState(nextAppState);
    };
    useEffect(() => {
        const appStateListener = AppState.addEventListener(
            'change',
            handleAppStateChange,
        );
        return () => {
            appStateListener.remove();
        };
    }, [timeOut, lock]);
    return (
        <Tab.Navigator
            tabBarPosition={'bottom'}
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    borderTopWidth: 0,
                    paddingVertical: 0,
                    height: Platform.OS === 'android' ? 60 : 90,
                    backgroundColor: theme.tabBarBackground,
                },
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabelStyle: {fontSize: 8},
                    tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
                    tabBarActiveTintColor: theme.button,
                    tabBarLabel: t('menu_wallet'),
                    tabBarIcon: ({color, size}) => (
                        <Icon
                            name="wallet-outline"
                            size={size}
                            type={Icons.Ionicons}
                            color={color}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="MarketScreen"
                component={MarketScreen}
                options={{
                    tabBarLabelStyle: {fontSize: 8},
                    tabBarLabel: t('menu_market'),
                    tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
                    tabBarActiveTintColor: theme.button,
                    tabBarIcon: ({color, size}) => (
                        <Icon
                            name="bar-chart"
                            size={size}
                            type={Icons.Feather}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="DummySwapScreen"
                component={DummySwapScreen}
                options={{
                    tabBarLabelStyle: {fontSize: 8},
                    tabBarLabel: t('menu_swap'),
                    tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
                    tabBarActiveTintColor: theme.button,
                    tabBarIcon: ({color, size}) => (
                        <Icon
                            name={'swap-horizontal'}
                            size={size}
                            type={Icons.Ionicons}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="DAppsScreen"
                component={DAppsScreen}
                options={{
                    tabBarLabelStyle: {fontSize: 8},
                    tabBarLabel: t('menu_dapps'),
                    tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
                    tabBarActiveTintColor: theme.button,
                    tabBarIcon: ({color, size}) => (
                        <Icon
                            name="navigate-circle"
                            size={size}
                            type={Icons.Ionicons}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="SettingScreen"
                component={SettingScreen}
                options={{
                    tabBarLabelStyle: {fontSize: 9},
                    tabBarLabel: t('menu_setup'),
                    tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
                    tabBarActiveTintColor: theme.button,
                    tabBarIcon: ({color, size}) => (
                        <Icon
                            name="setting"
                            size={size}
                            type={Icons.AntDesign}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default BottomTabBarNavigator;
