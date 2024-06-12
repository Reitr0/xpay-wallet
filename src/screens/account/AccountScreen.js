import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonFlatList from '@components/commons/CommonFlatList';
import Icon, {Icons} from '@components/icons/Icons';
import CommonImage from '@components/commons/CommonImage';
import {useTranslation} from 'react-i18next';
import {DEFAULT_WALLET, WALLET_TYPE} from '@persistence/wallet/WalletConstant';
import {WalletAction} from '@persistence/wallet/WalletAction';
import CommonLoading from '@components/commons/CommonLoading';

export default function AccountScreen({navigation}) {
    const {t} = useTranslation();
    const {theme, defaultTheme} = useSelector(state => state.ThemeReducer);
    const dispatch = useDispatch();
    const {activeWallet, wallets} = useSelector(state => state.WalletReducer);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        (async () => {})();
    }, []);
    const renderItem = ({item}) => {
        console.log(item);
        return (
            <CommonTouchableOpacity
                style={[
                    styles.item,
                    {borderBottomColor: theme.border, borderBottomWidth: 0.5},
                ]}
                onPress={() => {
                    CommonLoading.show();
                    dispatch(WalletAction.setActiveWallet(item)).then(() => {
                        CommonLoading.hide();
                    });
                }}
                key={item.id.toString()}>
                <View style={styles.leftItemContainer}>
                    <View style={[styles.iconContainer]}>
                        <CommonImage
                            source={{uri: item.logoUri}}
                            style={[
                                styles.icon,
                                activeWallet.id === item.id
                                    ? {borderWidth: 4}
                                    : {},
                            ]}
                        />
                    </View>
                    <View style={{width: 200}}>
                        <CommonText style={{color: theme.text2}}>
                            {item.name}
                        </CommonText>
                        <CommonText
                            numberOfLines={1}
                            ellipsizeMode="middle"
                            style={{color: theme.subText, fontSize: 13}}>
                            {item.type === WALLET_TYPE.MANY
                                ? 'Multi-Coin Wallet'
                                : item.activeAsset?.walletAddress}
                        </CommonText>
                    </View>
                </View>
                <CommonTouchableOpacity
                    style={styles.leftItemContainer}
                    onPress={() => {
                        navigation.navigate('AccountDetailScreen', {
                            account: item,
                        });
                    }}>
                    <Icon
                        type={Icons.Feather}
                        size={22}
                        name={'alert-circle'}
                    />
                </CommonTouchableOpacity>
            </CommonTouchableOpacity>
        );
    };
    return (
        <SafeAreaView
            style={[styles.container, {backgroundColor: theme.background4}]}>
            <View style={[styles.header, {backgroundColor: theme.background2}]}>
                <View style={styles.leftHeader}>
                    <CommonBackButton
                        color={theme.text}
                        onPress={async () => {
                            navigation.goBack();
                        }}
                    />
                </View>
                <View style={styles.contentHeader}>
                    <CommonText style={styles.headerTitle}>
                        {t('setting.wallets')}
                    </CommonText>
                </View>
                <CommonTouchableOpacity
                    style={styles.rightHeader}
                    onPress={() => {
                        navigation.navigate('AddAccountStep2Screen', {
                            account: DEFAULT_WALLET,
                        });
                    }}>
                    <Icon
                        type={Icons.Feather}
                        size={18}
                        name={'plus'}
                        color={theme.text}
                    />
                </CommonTouchableOpacity>
            </View>
            <View style={[styles.section, {backgroundColor: theme.background}]}>
                <CommonFlatList
                    data={wallets}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    onRefresh={() => {}}
                    refreshing={loading}
                />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 48,
        paddingHorizontal: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftHeader: {
        width: 30,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    contentHeader: {
        flex: 1,
        justifyContent: 'center',
        height: '100%',
    },
    rightHeader: {
        width: 30,
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    section: {
        width: '100%',
        flex: 1,
    },
    item: {
        height: 70,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    leftItemContainer: {
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightItemContainer: {
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        marginLeft: 10,
        marginVertical: 5,
    },
    icon: {
        width: 42,
        height: 42,
        borderColor: 'green',
        borderRadius: 50,
    },
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
});
