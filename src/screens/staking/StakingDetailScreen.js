import * as React from 'react';
import {useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonLoading from '@components/commons/CommonLoading';
import Balance from '@components/Balance';
import {useTranslation} from 'react-i18next';
import _ from 'lodash';
import {ethers} from 'ethers';
import {StakingAction} from '@persistence/staking/StakingAction';
import {StakingFactory} from '@modules/core/factory/StakingFactory';
import useWalletHook from '@persistence/wallet/WalletHook';
import CommonAlert from '@components/commons/CommonAlert';
import CommonButton from '@components/commons/CommonButton';
import CommonGradientButton from '@components/commons/CommonGradientButton';
import {WalletFactory} from '@modules/core/factory/WalletFactory';
import StakingContract from '@contracts/VStaking.json';
function StakingDetailScreen({navigation, route}) {
    const {item} = route.params;
    const {theme} = useSelector(state => state.ThemeReducer);
    const [amount, setAmount] = useState('');
    const {getByKuKuByChain} = useWalletHook();
    const [chain] = useState(item.chain);
    const duku = getByKuKuByChain(chain);
    const {t} = useTranslation();
    const dispatch = useDispatch();

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
                <View style={styles.rightHeader} />
            </View>
            <View style={[styles.content, {backgroundColor: theme.background}]}>
                <View style={styles.titleContainer}>
                    <View style={{flex: 1}}>
                        <CommonText
                            style={[styles.title, {color: theme.text2}]}>
                            Staking {duku?.symbol}
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
                <View style={styles.durationContainer}>
                    <CommonText style={[styles.label, {color: theme.text7}]}>
                        Duration (Days) & APR
                    </CommonText>
                    <View style={styles.durationList}>
                        <View
                            style={[
                                styles.durationItem,
                                {borderWidth: 1, borderColor: theme.bg3},
                            ]}>
                            <CommonText style={{color: theme.text2}}>
                                {item.code}
                            </CommonText>
                        </View>
                    </View>
                    <CommonText style={{color: theme.text7}}>
                        Est. APR{' '}
                        <CommonText
                            style={[styles.label, {color: theme.text2}]}>
                            {item.apr}
                        </CommonText>
                    </CommonText>
                </View>
                <View style={styles.titleInputContainer}>
                    <CommonText style={[styles.label, {color: theme.text2}]}>
                        {t('stake.amount')}
                    </CommonText>
                </View>
                <View
                    style={[
                        styles.inputView,
                        {backgroundColor: theme.inputBackground},
                    ]}>
                    <TextInput
                        style={[styles.input, {color: theme.inputText}]}
                        onChangeText={setAmount}
                        value={amount}
                        placeholder={'0.0'}
                        numberOfLines={1}
                        returnKeyType="done"
                        placeholderTextColor="gray"
                        autoCompleteType={'off'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        onEndEditing={async () => {}}
                    />
                    <CommonTouchableOpacity
                        style={styles.moreBtn2}
                        onPress={async () => {
                            setAmount(duku?.balance);
                        }}>
                        <CommonText style={[styles.max, {color: theme.text2}]}>
                            {t('tx.max')}
                        </CommonText>
                    </CommonTouchableOpacity>
                </View>
                <View style={styles.bottomContainer}>
                    {/*<CommonGradientButton*/}
                    {/*    text={'Set Rate'}*/}
                    {/*    onPress={async () => {*/}
                    {/*        CommonLoading.show();*/}
                    {/*        try {*/}
                    {/*            const wallet = await WalletFactory.getWallet(*/}
                    {/*                'BSC',*/}
                    {/*            );*/}
                    {/*             console.log(wallet);*/}
                    {/*            const stakingContract = new ethers.Contract(*/}
                    {/*                '0x5Ed9b6d87Ea813D11263c466d0f6D548fd2cF97F',*/}
                    {/*                StakingContract.abi,*/}
                    {/*                wallet.signer,*/}
                    {/*            );*/}

                    {/*            const gasPrice = ethers.utils.parseUnits(*/}
                    {/*                '30',*/}
                    {/*                'gwei',*/}
                    {/*            );*/}
                    {/*            console.log(`${item.data.rate / 100}`);*/}
                    {/*            const gasLimit = 50000; // Adjust this value based on the complexity of the transaction*/}
                    {/*            const rateInWei = ethers.utils.parseUnits(*/}
                    {/*                '0.07',*/}
                    {/*                18,*/}
                    {/*            );*/}
                    {/*            const rateTx = await stakingContract.updateRate(*/}
                    {/*                item.data.duration,*/}
                    {/*                rateInWei,*/}
                    {/*                {*/}
                    {/*                    gasPrice: gasPrice,*/}
                    {/*                    gasLimit: gasLimit,*/}
                    {/*                },*/}
                    {/*            );*/}
                    {/*            const stakeReceipt = await rateTx.wait();*/}
                    {/*            console.log('Stake receipt:', stakeReceipt);*/}
                    {/*        } catch (e) {*/}
                    {/*            console.log(e);*/}
                    {/*        } finally {*/}
                    {/*            CommonLoading.hide();*/}
                    {/*        }*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {/*<CommonGradientButton*/}
                    {/*    text={'Get Rate'}*/}
                    {/*    onPress={async () => {*/}
                    {/*        const wallet = await WalletFactory.getWallet('BSC');*/}
                    {/*        const stakingContract = new ethers.Contract(*/}
                    {/*            '0x5Ed9b6d87Ea813D11263c466d0f6D548fd2cF97F',*/}
                    {/*            StakingContract.abi,*/}
                    {/*            wallet.signer,*/}
                    {/*        );*/}
                    {/*        const rateTx = await stakingContract.getRate(5);*/}
                    {/*        console.log(*/}
                    {/*            'Stake receipt:',*/}
                    {/*            ethers.utils.formatUnits(rateTx, 18),*/}
                    {/*        );*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <CommonButton
                        text={'Stake'}
                        onPress={async () => {
                            if (_.isEmpty(amount) || amount <= 0) {
                                return;
                            }
                            const gasPrice = ethers.utils.parseUnits(
                                '3',
                                'gwei',
                            );
                            const gasLimit = 600000; // Adjust this value based on the complexity of the transaction
                            CommonLoading.show();
                            const params = {
                                chain,
                                amount: ethers.utils.parseUnits(amount, 18),
                                duration: item.data.duration,
                                gasPrice,
                                gasLimit,
                            };
                            console.log(params);
                            dispatch(StakingAction.stake(params)).then(
                                ({success, data}) => {
                                    CommonLoading.hide();
                                    if (success === false) {
                                        CommonAlert.show({
                                            title: t('alert.error'),
                                            message: t(
                                                'staking.balance_not_enough',
                                            ),
                                            type: 'error',
                                        });
                                        return;
                                    }
                                    CommonAlert.show({
                                        title: t('alert.success'),
                                        message: t('staking.success'),
                                        type: 'success',
                                    });
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
                                    navigation.goBack();
                                },
                            );
                        }}
                    />
                </View>
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
        marginVertical: 10,
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
});
export default StakingDetailScreen;
