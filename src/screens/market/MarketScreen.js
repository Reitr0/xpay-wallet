import React, {useCallback, useEffect, useState} from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import FastImage from 'react-native-fast-image';
import CommonImage from '@components/commons/CommonImage';
import {useDispatch, useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import Price from '@components/Price';
import {useTranslation} from 'react-i18next';
import {MarketAction} from '@persistence/market/MarketAction';
import usePriceHook from '@persistence/price/PriceHook';
import NumberFormatted from '@components/NumberFormatted';

export default function MarketScreen({navigation, route}) {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {markets} = useSelector(state => state.MarketReducer);
    const {getPriceData} = usePriceHook();
    const dispatch = useDispatch();
    const [refreshingMarket, setRefreshingMarket] = useState(false);
    useEffect(() => {
        (async () => {
            loadMarket();
        })();
    }, []);
    const loadMarket = () => {
        setRefreshingMarket(true);
        dispatch(MarketAction.getMarkets(31, true)).then(() => {
            setRefreshingMarket(false);
        });
    };
    const renderItem = ({item}) => {
        return (
            <CommonTouchableOpacity
                onPress={async () => {
                    navigation.navigate('MarketDetailScreen', {coin: item});
                }}
                style={[styles.item, {borderBottomColor: theme.border}]}>
                <CommonImage
                    style={styles.img}
                    source={{
                        uri: item.image,
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable,
                    }}
                />
                <View style={styles.itemContent}>
                    <View style={{width: 100}}>
                        <CommonText
                            style={[styles.itemName, {color: theme.text2}]}
                            numberOfLines={1}>
                            {item.name}
                        </CommonText>
                        <CommonText
                            style={[
                                styles.itemName,
                                {color: theme.subText, fontSize: 12},
                            ]}
                            numberOfLines={1}>
                            {item.symbol.toUpperCase()}
                        </CommonText>
                    </View>
                    <View style={{width: 100, alignItems: 'flex-end'}}>
                        <Price
                            numberOfLines={1}
                            style={{color: getPriceData(item.id, 4)}}>
                            {getPriceData(item.id, 0)}
                        </Price>
                        <NumberFormatted
                            decimals={2}
                            sign={true}
                            style={{color: getPriceData(item.id, 4)}}
                            symbol={'%'}>
                            {getPriceData(item.id, 1)}
                        </NumberFormatted>
                    </View>
                </View>
            </CommonTouchableOpacity>
        );
    };
    return (
        <View style={[styles.container, {backgroundColor: theme.background4}]}>
            <SafeAreaView style={styles.container}>
                <View
                    style={[
                        styles.header,
                        {backgroundColor: theme.background4},
                    ]}>
                    <View style={styles.contentHeader}>
                        <CommonText style={styles.headerTitle}>
                            {t('market.market')}
                        </CommonText>
                    </View>
                </View>
                <View
                    style={[
                        {flex: 1, paddingHorizontal: 10},
                        {backgroundColor: theme.background},
                    ]}>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshingMarket}
                            />
                        }
                        data={markets}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    customBtn: {
        borderWidth: 0,
    },
    item: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        alignItems: 'center',
        height: 75,
    },
    img: {
        width: 42,
        height: 42,
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
        fontSize: 15,
    },
    itemSymbol: {
        fontSize: 13,
        textAlign: 'left',
    },
    searchContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 15,
    },
    search: {
        flex: 4,
        fontSize: 16,
        borderWidth: 1,
        backgroundColor: 'red',
        paddingHorizontal: 10,
        height: 45,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
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
    chart: {
        paddingRight: 0,
        paddingBottom: 10,
        paddingTop: 10,
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
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
});
