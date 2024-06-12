import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {RefreshControl, SafeAreaView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import CommonImage from '@components/commons/CommonImage';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonLoading from '@components/commons/CommonLoading';
import Balance from '@components/Balance';
import {useTranslation} from 'react-i18next';
import {ethers} from 'ethers';
import moment from 'moment-timezone';
import CommonFlatList from '@components/commons/CommonFlatList';
import {StakingAction} from '@persistence/staking/StakingAction';
import CommonAlert from '@components/commons/CommonAlert';
import useWalletHook from '@persistence/wallet/WalletHook';
import _ from 'lodash';

function StakingHistoryScreen({navigation, route}) {
    const {item: stakeItem} = route.params;
    const {theme} = useSelector(state => state.ThemeReducer);
    const [chain, setChain] = useState(stakeItem.chain);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {stakedHistory} = useSelector(state => state.StakingReducer);
    const [refreshing, setRefreshing] = useState(false);
    const {getByKuKuByChain} = useWalletHook();
    const duku = getByKuKuByChain(chain);
    console.log('asdsadsad');
    useEffect(() => {
        (async () => {
            if (!_.isNil(duku?.walletAddress)) {
                dispatch(
                    StakingAction.getStakingHistory(chain, duku?.walletAddress),
                );
            }
        })();
    }, [duku?.walletAddress]);
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        dispatch(
            StakingAction.getStakingHistory(chain, duku?.walletAddress),
        ).then(() => {
            setRefreshing(false);
        });
    }, []);
    const calculateRewards = ({amount, claimedRewards, timestamp, rate}) => {
        const startTimestamp = timestamp;
        const endTimestamp = Math.floor(Date.now() / 1000);
        // Calculate the duration in milliseconds
        const durationInSeconds = endTimestamp - startTimestamp;
        // Convert the duration to seconds
        // Annual rate as a decimal (e.g., 0.05 for 5%)
        // Convert annual rate to rate per second
        const ratePerSecond = rate / (365 * 24 * 60 * 60); // 1 year = 365 days
        const total =
            amount * ratePerSecond * durationInSeconds - claimedRewards;
        // Calculate rewards
        return parseFloat(total).toFixed(10);
    };
    const renderItem = ({item}) => {
        const isStaking = item.status === 0;
        return (
            <View style={[styles.itemContainer]}>
                <View style={styles.imageContainer}>
                    <CommonImage
                        source={require('@assets/images/logo.png')}
                        style={{
                            width: 32,
                            height: 32,
                            backgroundColor: theme.tabBarInactiveTintColor,
                            borderWidth: 2,
                            borderColor: theme.bg0,
                            borderRadius: 100,
                        }}
                    />
                </View>
                <View style={styles.itemInformationContainer}>
                    <View style={{flex: 1}}>
                        <CommonText style={{color: theme.text2}}>
                            Staked:{' '}
                            <Balance style={{color: theme.text2}}>
                                {item.amount}
                            </Balance>
                        </CommonText>
                        <CommonText
                            style={[styles.descText, {color: theme.subText}]}>
                            {moment.unix(item.timestamp).format('lll')} ~{' '}
                            {moment.unix(item.lockTime).format('lll')}
                        </CommonText>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <CommonTouchableOpacity
                            onPress={async () => {
                                dispatch(
                                    StakingAction.claimRewards(
                                        chain,
                                        item.index,
                                    ),
                                );

                                console.log('claimRewards successfully:');
                            }}>
                            <Balance
                                decimals={8}
                                style={{color: theme.longColor}}>
                                {isStaking
                                    ? calculateRewards(item)
                                    : item.claimedRewards}
                            </Balance>
                        </CommonTouchableOpacity>
                        {isStaking && (
                            <CommonTouchableOpacity
                                onPress={async () => {
                                    const gasPrice = ethers.utils.parseUnits(
                                        '8',
                                        'gwei',
                                    );
                                    const gasLimit = 200000; // Adjust this value based on the complexity of the transaction
                                    CommonLoading.show();
                                    try {
                                        dispatch(
                                            StakingAction.unstake({
                                                chain,
                                                index: item.index,
                                                gasPrice,
                                                gasLimit,
                                            }),
                                        ).then(({success, data}) => {
                                            //console.log(data);
                                            CommonLoading.hide();
                                            if (success === false) {
                                                CommonAlert.show({
                                                    title: t('alert.error'),
                                                    message:
                                                        t('staking.lock_still'),
                                                    type: 'error',
                                                });
                                                return;
                                            }
                                            dispatch(
                                                StakingAction.getStakingHistory(
                                                    chain,
                                                    duku?.walletAddress,
                                                ),
                                            );
                                            dispatch(
                                                StakingAction.getStakedBalance(
                                                    chain,
                                                    duku?.walletAddress,
                                                ),
                                            );
                                        });
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }}>
                                <CommonText style={{color: theme.shortColor}}>
                                    Unstake
                                </CommonText>
                            </CommonTouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    };
    return (
        <View style={[styles.container, {backgroundColor: theme.background2}]}>
            <SafeAreaView style={[styles.container]}>
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
                    <View style={styles.rightHeader} />
                </View>
                <View
                    style={[
                        styles.content,
                        {backgroundColor: theme.background},
                    ]}>
                    <View style={styles.titleContainer}>
                        <View style={{flex: 1}}>
                            <CommonText
                                style={[styles.title, {color: theme.text2}]}>
                                Staking History
                            </CommonText>
                            <CommonText
                                style={[styles.subTitle, {color: theme.text7}]}>
                                Invest in Savings: Stake Tokens for Discounted
                                Thrills!
                            </CommonText>
                        </View>
                        <View style={styles.availableBalance}>
                            <CommonText
                                style={[styles.subTitle, {color: theme.text7}]}>
                                Available
                            </CommonText>
                            <Balance
                                style={[styles.balance, {color: theme.text2}]}
                                symbol={duku?.symbol}>
                                {duku?.balance}
                            </Balance>
                        </View>
                    </View>
                    <CommonFlatList
                        renderItem={renderItem}
                        keyExtractor={ite => ite.index}
                        data={stakedHistory}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
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
    titleContainer: {
        width: '100%',
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 12,
    },
    availableBalance: {
        alignItems: 'flex-end',
    },
    balance: {
        fontSize: 16,
    },
    content: {
        flex: 1,
        paddingTop: 10,
    },
    productContainer: {
        width: '100%',
        flex: 1,
    },
    productWrapper: {
        width: '100%',
    },
    sectionContainer: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 10,
    },
    sectionHeader: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    sectionContent: {
        flex: 1,
    },
    productThumbnail: {
        width: '100%',
        height: 238,
        borderRadius: 10,
        marginTop: 5,
    },
    productInformation: {
        flex: 1,
    },
    tabsContainer: {
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
    },
    tabContent: {
        width: '100%',
    },
    bottomContainer: {
        width: '100%',
        paddingHorizontal: 10,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputView: {
        height: 60,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 5,
        borderRadius: 10,
        fontSize: 14,
        marginVertical: 5,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    input: {flex: 1, color: 'black'},
    titleInputContainer: {
        marginTop: 5,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    durationContainer: {
        width: '100%',
        marginVertical: 5,
        paddingHorizontal: 10,
    },
    label: {fontWeight: 'bold'},
    durationList: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    durationItem: {
        width: 70,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreBtn2: {
        justifyContent: 'center',
        marginRight: 10,
    },
    itemContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
        flexDirection: 'row',
        paddingHorizontal: 5,
        height: 64,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemInformationContainer: {
        flex: 1,
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    descText: {
        fontSize: 11,
    },
    apr: {
        width: 50,
    },
});
export default StakingHistoryScreen;
