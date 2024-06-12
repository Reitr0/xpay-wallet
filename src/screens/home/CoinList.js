import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import usePriceHook from '@persistence/price/PriceHook';
import Price from '@components/Price';
import {Dimensions, StyleSheet, View} from 'react-native';
import CommonButton from '@components/commons/CommonButton';
import CommonFlatList from '@components/commons/CommonFlatList';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {WalletAction} from '@persistence/wallet/WalletAction';
import CommonImage from '@components/commons/CommonImage';
import CommonText from '@components/commons/CommonText';
import Balance from '@components/Balance';
import NumberFormatted from '@components/NumberFormatted';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import CommonLoading from '@components/commons/CommonLoading';
import {MarketAction} from '@persistence/market/MarketAction';
import {useWalletList} from '@persistence/wallet/WalletHook';
import {applicationProperties} from '@src/application.properties';
import {ASSET_TYPE_COIN} from '@modules/core/constant/constant';
import _ from 'lodash';

function CoinList(props) {
    const {getPriceData} = usePriceHook();
    const {t} = useTranslation();
    const navigation = useNavigation();
    const {wallets} = useWalletList();
    const {theme} = useSelector(state => state.ThemeReducer);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();
    const onRefresh = useCallback(async () => {
        CommonLoading.show();
        dispatch(WalletAction.balance()).then(() => {
            setRefreshing(false);
            dispatch(MarketAction.getMarkets(30, true));
            CommonLoading.hide();
        });
    }, []);
    useEffect(() => {}, []);
    const renderItem = ({item}) => {
        let chainLogo = applicationProperties.logoURI.eth;
        switch (item.chain) {
            case 'ETH':
                chainLogo = applicationProperties.logoURI.eth;
                break;
            case 'BSC':
                chainLogo = applicationProperties.logoURI.bsc;
                break;
            case 'POLYGON':
                chainLogo = applicationProperties.logoURI.polygon;
                break;
            case 'TRON':
                chainLogo = applicationProperties.logoURI.tron;
                break;
        }
        return (
            <CommonTouchableOpacity
                onPress={() => {
                    dispatch(WalletAction.setActiveAsset(item)).then(() => {
                        navigation.navigate('WalletDetailScreen', {
                            coin: {...item, isNative: item.type !== 'coin'},
                        });
                    });
                }}>
                <View style={[styles.item, {borderBottomColor: theme.border}]}>
                    <View style={styles.itemInfo}>
                        <View>
                            <CommonImage
                                source={{uri: item.logoURI}}
                                style={styles.itemImg}
                            />
                            {item.type !== ASSET_TYPE_COIN && (
                                <CommonImage
                                    source={{uri: chainLogo}}
                                    style={styles.itemChainImg}
                                />
                            )}
                        </View>
                        <View style={styles.itemDesc}>
                            <CommonText
                                style={[styles.itemName, {color: theme.text2}]}>
                                {item.symbol}
                            </CommonText>
                            <Price
                                style={[
                                    styles.itemSymbol,
                                    {color: getPriceData(item.id, 4)},
                                ]}>
                                {getPriceData(item.id, 0)}
                            </Price>
                        </View>
                    </View>
                    <View style={styles.itemPrice}>
                        <View
                            style={[styles.itemDesc, {alignItems: 'flex-end'}]}>
                            <Balance
                                style={[
                                    styles.itemName,
                                    {color: getPriceData(item.id, 4)},
                                ]}>
                                {item.balance}
                            </Balance>
                            <Price
                                style={[
                                    styles.itemSymbol,
                                    {color: getPriceData(item.id, 4)},
                                ]}>
                                {item.balance * getPriceData(item.id, 0)}
                            </Price>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.percentContainer,
                            {backgroundColor: getPriceData(item.id, 5)},
                        ]}>
                        <NumberFormatted
                            decimals={2}
                            sign={true}
                            style={{color: theme.text, fontSize: 13}}
                            symbol={'%'}>
                            {getPriceData(item.id, 1)}
                        </NumberFormatted>
                    </View>
                </View>
            </CommonTouchableOpacity>
        );
    };
    return (
        <CommonFlatList
            data={wallets}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={item => `${item.id}${item.chain}${item.contract}`}
            onRefresh={onRefresh}
            refreshing={refreshing}
            ListFooterComponent={() => {
                return (
                    <View style={styles.addTokenButton}>
                        <CommonButton
                            text={t('token.manage')}
                            textStyle={{color: theme.text}}
                            onPress={() => {
                                navigation.navigate('TokenScreen');
                            }}
                        />
                        {/*<CommonButton*/}
                        {/*    style={{*/}
                        {/*        marginTop: 5,*/}
                        {/*        backgroundColor: theme.background,*/}
                        {/*    }}*/}
                        {/*    text={t('token.add_new')}*/}
                        {/*    textStyle={{color: theme.text2}}*/}
                        {/*    onPress={() => {*/}
                        {/*        navigation.navigate('AddTokenScreen');*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </View>
                );
            }}
        />
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
    balanceContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceText: {
        fontSize: 35,
        fontWeight: 'bold',
    },
    walletNameText: {
        fontSize: 10,
    },
    actionContainer: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    actionItem: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
    },
    actionIcon: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabViewContainer: {
        flex: 1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    tabViewHeader: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabViewHeaderItem: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
    },
    tabViewContent: {
        flex: 1,
        paddingHorizontal: 10,
    },
    itemInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemDesc: {
        marginLeft: 10,
    },
    itemName: {
        fontSize: 15,
    },
    itemSymbol: {
        fontSize: 12,
    },
    itemPrice: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
        paddingRight: 10,
    },
    addTokenButton: {
        width: '100%',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        height: 60,
        width: '100%',
        marginBottom: 10,
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemChainImg: {
        width: 16,
        height: 16,
        borderRadius: 10000,
        backgroundColor: 'black',
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'yellow',
        bottom: 0,
        right: 0,
    },
    itemImg: {
        width: 42,
        height: 42,
        borderRadius: 10000,
        backgroundColor: 'black',
    },
    notifyContainer: {
        width: 15,
        height: 15,
        backgroundColor: '#c7122a',
        borderRadius: 30,
        position: 'absolute',
        top: -5,
        left: -5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        fontWeight: 'bold',
        fontSize: 8,
    },
    logo: {
        width: 24,
        height: 24,
        borderRadius: 100,
    },
    nftItem: {
        width: Dimensions.get('screen').width / 2 - 20,
        height: 220,
        marginLeft: 8,
        marginBottom: 15,
        borderRadius: 10,
        justifyContent: 'center',
    },
    itemInfoContainer: {
        width: '100%',
        height: 30,
        position: 'absolute',
        bottom: 10,
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemNameContainer: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: '80%',
        height: 30,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    image: {height: 220, width: '100%', borderRadius: 20},
    percentContainer: {
        width: 60,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default CoinList;
