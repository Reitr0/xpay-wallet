import React, {useEffect, useState} from 'react';
import {
    FlatList,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import FastImage from 'react-native-fast-image';
import CommonImage from '@components/commons/CommonImage';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {sleep} from '@src/utils/ThreadUtil';
import _ from 'lodash';
import TokenSwitcher from '@components/TokenSwitcher';
import CommonBackButton from '@components/commons/CommonBackButton';
import {CHAIN_ID_TYPE_MAP} from '@modules/core/constant/constant';
import CommonLoading from '@components/commons/CommonLoading';
import {WalletAction} from '@persistence/wallet/WalletAction';
import {TokenAction} from '@persistence/token/TokenAction';

export default function TokenScreen({navigation, route}) {
    const [searchText, setSearchText] = useState('');
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {activeWallet} = useSelector(state => state.WalletReducer);
    const {ALL} = useSelector(state => state.TokenReducer);
    const [data, setData] = useState(ALL);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            setData(ALL);
        })();
    }, [ALL, ALL.length]);
    useEffect(() => {
        (async () => {
            dispatch(
                TokenAction.getAllTokens(activeWallet.chain, activeWallet.type),
            );
        })();
    }, [activeWallet.chain, activeWallet.type, dispatch]);

    const addAsset = item => {
        CommonLoading.show();
        dispatch(WalletAction.addAsset(item)).then(() => {
            CommonLoading.hide();
        });
    };
    const removeWallet = item => {
        CommonLoading.show();
        dispatch(WalletAction.removeAsset(item)).then(() => {
            CommonLoading.hide();
        });
    };
    const renderItem = ({item}) => {
        let img = {
            uri: item.logoURI,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
        };
        if (item.thumb === '' || item.thumb === null) {
            img = require('@assets/images/token/no-photo.png');
        }
        const asset = _.find(activeWallet.tokens, function (o) {
            return o.contract === item.address;
        });
        const enable = !_.isNil(asset);
        return (
            <View style={[styles.item]}>
                <CommonImage style={styles.img} source={img} />
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
                            {CHAIN_ID_TYPE_MAP[item.chainId]} Network
                        </CommonText>
                    </View>
                    {!_.includes(
                        ['duku', 'pankuku', 'worlddkuku', 'xusdt'],
                        item.id,
                    ) && (
                        <CommonTouchableOpacity
                            style={styles.switcher}
                            onPress={async () => {
                                Keyboard.dismiss();
                                await sleep(200);
                                if (enable) {
                                    removeWallet(item);
                                } else {
                                    addAsset(item);
                                }
                            }}>
                            <TokenSwitcher enable={enable} />
                            <View
                                style={{
                                    position: 'absolute',
                                    width: 60,
                                    height: 40,
                                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                                }}
                            />
                        </CommonTouchableOpacity>
                    )}
                </View>
            </View>
        );
    };
    const searchCoin = text => {
        let coinsList = data;
        if (text.length === 0) {
            setData(ALL);
            setSearchText(text);
            return;
        }
        if (text.length < searchText.length) {
            coinsList = ALL;
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
            <SafeAreaView style={[styles.container]}>
                <View
                    style={[
                        styles.header,
                        {backgroundColor: theme.background4},
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
                    <View style={styles.rightHeader} />
                </View>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 10,
                        backgroundColor: theme.background,
                    }}>
                    <FlatList
                        data={data}
                        keyExtractor={item => `${item.address}${item.chainId}`}
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
        borderWidth: 0,
    },
    item: {
        height: 70,
        width: '100%',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    img: {
        width: 42,
        height: 42,
        marginRight: 0,
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        borderRadius: 100,
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemName: {
        marginLeft: 10,
        fontSize: 17,
    },
    itemSymbol: {
        flex: 1,
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
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
});
