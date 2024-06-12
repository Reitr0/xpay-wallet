import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import CommonText from '@components/commons/CommonText';
import FastImage from 'react-native-fast-image';
import CommonImage from '@components/commons/CommonImage';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import CommonFlatList from '@components/commons/CommonFlatList';
import CommonBackButton from '@components/commons/CommonBackButton';
import _ from 'lodash';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {WalletAction} from '@persistence/wallet/WalletAction';
import Balance from '@components/Balance';
import {useWalletList} from '@persistence/wallet/WalletHook';
import {applicationProperties} from '@src/application.properties';
import {ASSET_TYPE_COIN} from '@modules/core/constant/constant';

export default function SelectWalletScreen({navigation, route}) {
    const {action} = route.params;
    const [searchText, setSearchText] = useState('');
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {wallets} = useWalletList();
    const [data, setData] = useState(wallets);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            if (action === 'SWAP') {
                const newData = [...wallets];
                _.remove(newData, {symbol: 'BTC'});
                _.remove(newData, {symbol: 'TRX'});
                setData(newData);
            } else {
                setData(wallets);
            }
        })();
    }, [wallets]);
    const renderItem = ({item}) => {
        let img = {
            uri: item.logoURI,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
        };
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
                style={[styles.item, {borderBottomColor: theme.border}]}
                onPress={() => {
                    dispatch(WalletAction.setActiveAsset(item)).then(() => {
                        if (action === 'BUY') {
                            navigation.navigate('WalletBuyScreen', {
                                coin: item,
                            });
                            return;
                        }
                        if (action === 'SWAP') {
                            navigation.navigate('SwapScreen', {
                                coin: item,
                            });
                            return;
                        }
                        if (action === 'SEND') {
                            if (item.chain === 'BTC') {
                                navigation.navigate('BtcWalletSendScreen');
                            } else if (item.chain === 'TRON') {
                                navigation.navigate('TronWalletSendScreen');
                            }else if (item.chain === 'SOLANA') {
                                navigation.navigate('SolanaWalletSendScreen');
                            }
                            else {
                                navigation.navigate('WalletSendScreen');
                            }
                            return;
                        }
                        if (action === 'RECEIVE') {
                            navigation.navigate('WalletReceiveScreen', {
                                coin: item,
                            });
                        }
                    });
                }}>
                <View>
                    <CommonImage style={styles.img} source={img} />
                    {item.type !== ASSET_TYPE_COIN && (
                        <CommonImage
                            source={{uri: chainLogo}}
                            style={styles.itemChainImg}
                        />
                    )}
                </View>
                <View style={styles.itemContent}>
                    <View>
                        <CommonText
                            style={[styles.itemName, {color: theme.text2}]}
                            numberOfLines={1}>
                            {item.symbol}
                        </CommonText>
                        <CommonText
                            style={[styles.itemNetwork, {color: theme.subText}]}
                            numberOfLines={1}>
                            {item.chain} Network
                        </CommonText>
                    </View>
                </View>
                <View style={styles.itemPrice}>
                    <View style={[styles.itemDesc, {alignItems: 'flex-end'}]}>
                        <Balance
                            style={[styles.itemName, {color: theme.text2}]}
                            symbol={item.symbol}>
                            {item.balance}
                        </Balance>
                    </View>
                </View>
            </CommonTouchableOpacity>
        );
    };
    const searchCoin = text => {
        let coinsList = data;
        if (text.length === 0) {
            setData(wallets);
            return;
        }
        if (text.length < searchText.length) {
            coinsList = wallets;
        }
        setSearchText(text);
        const newData = coinsList.filter(item => {
            const itemData = `${item.name.toUpperCase()}
      ${item.symbol.toUpperCase()}`;

            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });

        setData(newData);
    };
    return (
        <View style={[styles.container, {backgroundColor: theme.background4}]}>
            <SafeAreaView style={styles.container}>
                <View
                    style={[
                        styles.header,
                        {backgroundColor: theme.background2},
                    ]}>
                    <View style={styles.leftHeader}>
                        <CommonBackButton
                            color={theme.text}
                            onPress={async () => {
                                navigation.goBack();
                            }}
                        />
                    </View>
                    <View style={styles.contentHeader}>
                        <TextInput
                            style={[
                                styles.search,
                                {
                                    color: theme.text,
                                },
                            ]}
                            autoCorrect={false}
                            placeholderTextColor={theme.subText2}
                            onChangeText={text => searchCoin(text)}
                            placeholder={t('search.search_tokens')}
                        />
                    </View>
                </View>
                <View style={{flex: 1, backgroundColor: theme.background}}>
                    <CommonFlatList
                        data={data}
                        renderItem={renderItem}
                        itemHeight={80}
                        keyboardDismissMode="on-drag"
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}
const styles = StyleSheet.create({
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
    },
    customBtn: {
        //backgroundColor: Colors.darker,
        borderWidth: 0,
    },
    item: {
        height: 70,
        width: '100%',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 0.5,
    },
    img: {
        width: 42,
        height: 42,
        marginRight: 0,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 100,
        backgroundColor: 'black'
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemName: {
        //color: Colors.foreground,
        marginLeft: 10,
        fontSize: 17,
    },
    itemSymbol: {
        flex: 1,
        //color: Colors.lighter,
        marginLeft: 10,
        fontSize: 13,
        textAlign: 'right',
    },
    searchContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 15,
    },
    search: {
        fontSize: 16,
        paddingHorizontal: 10,
        height: 45,
        borderRadius: 5,
        width: '100%',
    },
    close: {
        flex: 1.2,
        height: 43,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 1,
        borderTopEndRadius: 5,
        borderBottomEndRadius: 5,
    },
    choose_network: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 25,
    },
    chooseItem: {
        height: 40,
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 5,
        justifyContent: 'center',
        borderBottomWidth: 0.5,
    },
    chooseItemText: {
        fontWeight: 'bold',
    },
    portfolioHeader: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
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
    screenTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    itemNetwork: {
        marginLeft: 10,
        fontSize: 13,
    },
    switcher: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    itemDesc: {
        marginLeft: 10,
    },
    itemPrice: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
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
        right: 0
    },
});
