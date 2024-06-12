import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import CommonBackButton from '@components/commons/CommonBackButton';
import Price from '@components/Price';
import Balance from '@components/Balance';
import {LineChart, XAxis, YAxis} from 'react-native-svg-charts';
import numeral from 'numeral';
import {usePriceDetailHook} from '@persistence/price/PriceHook';
import NumberFormatted from '@components/NumberFormatted';
import FastImage from 'react-native-fast-image';
import CommonImage from '@components/commons/CommonImage';
import PriceById from '@components/PriceById';

export default function MarketDetailScreen({navigation, route}) {
    const {coin} = route.params;
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {currency} = useSelector(state => state.CurrencyReducer);
    const [sparkline, setSparkline] = useState(coin?.sparkline_in_7d?.price);
    const {getCurrentPriceDetail} = usePriceDetailHook(coin.id);
    const [labels, setLabels] = useState([]);
    useEffect(() => {
        (async () => {
            let labels = [];
            for (let i = 7; i >= 0; i--) {
                labels.push({
                    key: i,
                    value: moment().subtract(i, 'days').format('Do'),
                });
            }
            setLabels(labels);
        })();
    }, []);
    const exchange = (value, decimals = 2) => {
        const format = `0,0.[${'0'.repeat(decimals)}]`;
        return numeral(value * currency.value).format(format);
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
                        <CommonText style={styles.headerTitle}>
                            {coin.name}
                        </CommonText>
                        <CommonImage
                            style={styles.coinInfoImg}
                            source={{
                                uri: coin.image,
                                priority: FastImage.priority.normal,
                                cache: FastImage.cacheControl.immutable,
                            }}
                        />
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        style={[
                            styles.content,
                            {backgroundColor: theme.background},
                        ]}>
                        <View style={styles.coinInfo}>
                            <View style={styles.coinInfoLowerArea}>
                                <PriceById
                                    style={[
                                        styles.coinInfoPrice,
                                        {color: theme.text},
                                    ]}
                                    id={coin.id}
                                />
                                <View style={styles.coinInfoPercentage}>
                                    <View
                                        style={[
                                            styles.coinInfoPercentageBg,

                                        ]}>
                                        <NumberFormatted
                                            decimals={2}
                                            sign={true}
                                            style={{
                                                color: getCurrentPriceDetail(5),
                                            }}
                                            symbol={'%'}>
                                            {getCurrentPriceDetail(1)}
                                        </NumberFormatted>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.coinChart}>
                            <YAxis
                                data={sparkline}
                                svg={{
                                    fill: theme.subText,
                                    fontSize: 10,
                                }}
                                contentInset={{top: 20, bottom: 20}}
                                numberOfTicks={5}
                                formatLabel={value =>
                                    `${exchange(value)}${currency.symbol}`
                                }
                            />
                            <View style={{flex: 1}}>
                                <LineChart
                                    style={{flex: 1}}
                                    data={sparkline}
                                    svg={{stroke: getCurrentPriceDetail(5)}}
                                    contentInset={{
                                        top: 20,
                                        bottom: 20,
                                    }}
                                />
                                <XAxis
                                    data={labels}
                                    formatLabel={(value, index) =>
                                        labels[index].value
                                    }
                                    svg={{
                                        fill: theme.subText,
                                        fontSize: 10,
                                    }}
                                    contentInset={{left: 10, right: 10}}
                                />
                            </View>

                            <CommonText style={styles.last7DaysText}>
                                {t('coindetails.last_7_days')}
                            </CommonText>
                        </View>
                        <View style={styles.coinStatistic}>
                            <View
                                style={[
                                    styles.coinStatisticItem,
                                    {borderBottomColor: theme.border},
                                ]}>
                                <CommonText style={{color: theme.text2}}>
                                    {t('coindetails.rank')}
                                </CommonText>
                                <CommonText style={{color: theme.text2}}>
                                    {coin?.market_cap_rank ?? '-'}
                                </CommonText>
                            </View>
                            <View
                                style={[
                                    styles.coinStatisticItem,
                                    {borderBottomColor: theme.border},
                                ]}>
                                <CommonText style={{color: theme.text2}}>
                                    {t('coindetails.marketcap')}
                                </CommonText>
                                <Price style={{color: theme.text2}}>
                                    {coin?.market_cap ?? '-'}
                                </Price>
                            </View>
                            <View
                                style={[
                                    [
                                        styles.coinStatisticItem,
                                        {borderBottomColor: theme.border},
                                    ],
                                    {borderBottomColor: theme.border},
                                ]}>
                                <CommonText style={{color: theme.text2}}>
                                    {t('coindetails.volume')}
                                </CommonText>
                                <Price style={{color: theme.text2}}>
                                    {coin?.total_volume ?? '-'}
                                </Price>
                            </View>
                            <View
                                style={[
                                    styles.coinStatisticItem,
                                    {borderBottomColor: theme.border},
                                ]}>
                                <CommonText style={{color: theme.text2}}>
                                    {t('coindetails.all_time_high')}
                                </CommonText>
                                <Price style={{color: theme.text2}}>
                                    {coin?.ath ?? '-'}
                                </Price>
                            </View>
                            <View
                                style={[
                                    styles.coinStatisticItem,
                                    {borderBottomColor: theme.border},
                                ]}>
                                <CommonText style={{color: theme.text2}}>
                                    {t('coindetails.high_24')}
                                </CommonText>
                                <Price style={{color: theme.text2}}>
                                    {coin?.high_24h ?? '-'}
                                </Price>
                            </View>
                            <View
                                style={[
                                    styles.coinStatisticItem,
                                    {borderBottomColor: theme.border},
                                ]}>
                                <CommonText style={{color: theme.text2}}>
                                    {t('coindetails.low_24h')}
                                </CommonText>
                                <Price style={{color: theme.text2}}>
                                    {coin?.low_24h ?? '-'}
                                </Price>
                            </View>
                            <View
                                style={[
                                    styles.coinStatisticItem,
                                    {borderBottomColor: theme.border},
                                ]}>
                                <CommonText style={{color: theme.text2}}>
                                    {t('coindetails.circulating_supply')}
                                </CommonText>
                                <Balance style={{color: theme.text2}}>
                                    {coin?.circulating_supply ?? '-'}
                                </Balance>
                            </View>
                            <View
                                style={[
                                    styles.coinStatisticItem,
                                    {borderBottomColor: theme.border},
                                ]}>
                                <CommonText style={{color: theme.text2}}>
                                    {t('coindetails.max_supply')}
                                </CommonText>
                                <Balance style={{color: theme.text2}}>
                                    {coin?.max_supply ?? '-'}
                                </Balance>
                            </View>
                            <View
                                style={[
                                    styles.coinStatisticItem,
                                    {borderBottomColor: theme.border},
                                ]}>
                                <CommonText style={{color: theme.text2}}>
                                    {t('coindetails.total_supply')}
                                </CommonText>
                                <Balance style={{color: theme.text2}}>
                                    {coin?.total_supply ?? '-'}
                                </Balance>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
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
        alignItems: 'center',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    content: {
        flex: 1,
    },
    coinInfo: {
        width: '100%',
        height: 50,
        paddingHorizontal: 10,
    },
    coinInfoUpperArea: {
        height: 42,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    coinInfoImg: {
        height: 24,
        width: 24,
        borderRadius: 100,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    coinInfoSymbol: {
        fontWeight: 'bold',
        marginLeft: 5,
    },
    coinInfoLowerArea: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coinInfoPrice: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    coinInfoPercentage: {
        width: 50,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinInfoPercentageBg: {
        backgroundColor: 'rgba(220,220,220,0.5)',
        borderRadius: 10,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinChart: {
        height: 240,
        width: '100%',
        paddingTop: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    last7DaysText: {
        color: 'gray',
        textAlign: 'center',
        fontSize: 30,
        position: 'absolute',
        fontWeight: 'bold',
        opacity: 0.2,
        width: '100%',
        top: 80,
        left: 30,
    },
    coinStatistic: {
        width: '100%',
        flex: 1,
        padding: 10,
    },
    coinStatisticHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coinStatisticTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    coinStatisticItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 55,
        borderBottomWidth: 0.5,
    },
    coinStatisticSubtitle: {
        fontSize: 10,
    },
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
});
