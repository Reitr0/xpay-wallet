import React, {useEffect, useState} from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {useTranslation} from 'react-i18next';
import CommonImage from '@components/commons/CommonImage';
import Icon, {Icons} from '@components/icons/Icons';
import {
    calcFee,
    formatCoins,
    formatNoComma,
    toEth,
    toWei,
} from '@src/utils/CurrencyUtil';
import {Logs} from '@modules/log/logs';
import CommonLoading from '@components/commons/CommonLoading';
import _ from 'lodash';
import {OxService} from '@modules/core/exchange/0x/0xService';
import {ASSET_TYPE_COIN, CHAIN_ID_MAP} from '@modules/core/constant/constant';
import CommonButton from '@components/commons/CommonButton';
import CommonAlert from '@components/commons/CommonAlert';
import {sleep} from '@src/utils/ThreadUtil';
import {ERC20_ABI, ZERO_EX_ADDRESS} from '@modules/core/exchange/0x/0xConstant';
import {WalletFactory} from '@modules/core/factory/WalletFactory';
import BigNumber from 'bignumber.js';
import {WalletAction} from '@persistence/wallet/WalletAction';
import Balance from '@components/Balance';

export default function DummySwapScreen({navigation, route}) {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {fee} = useSelector(state => state.FeeReducer);
    const [fromToken, setFromToken] = useState({});
    const [toToken, setToToken] = useState({});
    const [fromTokenAmount, setFromTokenAmount] = useState('');
    const [toTokenAmount, setToTokenAmount] = useState('');
    const [quote, setQuote] = useState(null);
    const [isEnough, setIsEnough] = useState(false);
    const [slippagePercentage, setSlippagePercentage] = useState(0.01);
    const [slippageText, setSlippageText] = useState('1'); // default 0.5
    const {activeWallet} = useSelector(state => state.WalletReducer);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [platform, setPlatform] = useState(activeWallet.defaultChain);
    useEffect(() => {
        (async () => {
            onChangeActiveAsset(platform);
        })();
    }, [activeWallet.defaultChain]);
    const onChangeActiveAsset = chain => {
        dispatch(WalletAction.getActiveAsset(chain)).then(({success, data}) => {
            if (success === true) {
                const activeAsset = data.activeWallet.activeAsset;
                const defaultToken = {
                    address: activeAsset.contract,
                    chainId: CHAIN_ID_MAP[activeAsset.chain],
                    decimals: activeAsset.decimals,
                    logoURI: 'https://iili.io/JgYFd5G.webp',
                    name: 'MXG',
                    symbol: 'MXG',
                    balance: activeAsset.balance,
                    isNative: activeAsset.type === ASSET_TYPE_COIN,
                };
                setFromToken(defaultToken);
            }
        });
    };
    const onChangePlatform = chain => {
        onChangeActiveAsset(chain);
        reset();
        setToToken({});
    };
    const reset = () => {
        setFromTokenAmount('');
        setQuote(null);
        setToTokenAmount('');
    };
    const swapPosition = () => {
        const tempToken = fromToken;
        if (toTokenAmount > toToken.balance) {
            setFromTokenAmount(formatCoins(toToken.balance).toString());
        } else {
            setFromTokenAmount(toTokenAmount);
        }
        setFromToken(toToken);
        setToToken(tempToken);
        setToTokenAmount('');
        setQuote(null);
    };
    const getQuote = async (show = true, from, to, amount) => {
        const tokenAmount = Number(amount || fromTokenAmount);
        const sellToken = from || fromToken;
        const buyToken = to || toToken;
        if (
            isNaN(tokenAmount) ||
            tokenAmount <= 0 ||
            _.isEmpty(sellToken) ||
            _.isEmpty(buyToken)
        ) {
            if (show) {
                CommonAlert.show({
                    title: t('alert.error'),
                    message: t('swap.input_required'),
                    type: 'error',
                });
            }
            return;
        }
        let sellAmount = toWei(
            formatNoComma(tokenAmount.toString()),
            sellToken?.decimals,
        ).toLocaleString('fullwide', {useGrouping: false});

        const buyAddress = buyToken.isNative
            ? buyToken.symbol
            : buyToken.address;
        const sellAddress = sellToken.isNative
            ? sellToken.symbol
            : sellToken.address;
        await fetchQuote(buyAddress, sellAddress, sellAmount, false, from, to);
    };
    const fetchQuote = async (
        buyAddress,
        sellAddress,
        sellAmount,
        exact = false,
        from,
        to,
    ) => {
        CommonLoading.show();
        setIsEnough(true);
        const sellToken = from || fromToken;
        const buyToken = to || toToken;
        let params: any = {
            buyToken: buyAddress,
            sellToken: sellAddress,
            sellAmount: sellAmount,
            slippagePercentage: slippagePercentage,
        };
        if (fee.enabled === true) {
            params.buyTokenPercentageFee = fee.rate / 100;
            params.feeRecipient = fee.ethAddress;
        }
        if (exact === true) {
            params.takerAddress = activeWallet.activeAsset.walletAddress;
        }
        try {
            const resQuote = await OxService.getQuote(
                activeWallet.activeAsset.chain,
                params,
            );
            if (!resQuote) {
                CommonAlert.show({
                    title: t('alert.error'),
                    message: t('swap.error.swap_not_found'),
                    type: 'error',
                });
                setIsEnough(false);
                CommonLoading.hide();
                return;
            }
            if (resQuote.code === 100) {
                CommonAlert.show({
                    title: t('alert.error'),
                    message: t('swap.insufficient_asset_liquidity'),
                    type: 'error',
                });
                setIsEnough(false);
                CommonLoading.hide();
                return;
            }
            if (resQuote.code === 105) {
                CommonAlert.show({
                    title: t('alert.error'),
                    message: t('swap_transfer_amount_exceeds_allowance'),
                    type: 'error',
                });
                setIsEnough(false);
                CommonLoading.hide();
                return;
            }
            if (resQuote.code === 109) {
                CommonAlert.show({
                    title: t('alert.error'),
                    message: t('swap_transfer_amount_exceeds_allowance'),
                    type: 'error',
                });
                setIsEnough(false);
                CommonLoading.hide();
                return;
            }
            if (
                Number(sellToken?.balance) <
                Number(toEth(resQuote.sellAmount, sellToken?.decimals))
            ) {
                //setIsEnough(false);
                //CommonLoading.hide();
                //return;
            }
            setQuote(resQuote);
            setToTokenAmount(
                toEth(resQuote.buyAmount, buyToken?.decimals).toString(),
            );
            setFromTokenAmount(
                toEth(resQuote.sellAmount, sellToken?.decimals).toString(),
            );
            return resQuote;
        } catch (e) {
            Logs.info(e);
            return null;
        } finally {
            CommonLoading.hide();
        }
    };
    const swap = async () => {
        CommonLoading.show();
        let sellAmount = toWei(
            formatNoComma(fromTokenAmount),
            fromToken?.decimals,
        ).toLocaleString('fullwide', {useGrouping: false});
        const buyAddress = toToken.isNative ? toToken.symbol : toToken.address;
        const sellAddress = fromToken.isNative
            ? fromToken.symbol
            : fromToken.address;
        try {
            const wallet = await WalletFactory.getWallet(
                activeWallet.activeAsset.chain,
            );
            const web3Signer = wallet.web3Signer;
            if (fromToken.isNative === false) {
                const tokenContract = new web3Signer.eth.Contract(
                    ERC20_ABI,
                    fromToken.address,
                );
                const currentAllowance = await tokenContract.methods
                    .allowance(
                        activeWallet.activeAsset.walletAddress,
                        ZERO_EX_ADDRESS,
                    )
                    .call();
                if (
                    new BigNumber(currentAllowance).isLessThan(
                        new BigNumber(quote.sellAmount),
                    )
                ) {
                    const approvalData = await tokenContract.methods.approve(
                        ZERO_EX_ADDRESS,
                        sellAmount,
                    );

                    const gasEstimate = await approvalData.estimateGas();
                    const tx = await approvalData.send({
                        from: activeWallet.activeAsset.walletAddress,
                        gas: gasEstimate,
                        gasPrice: quote.gasPrice,
                    });
                    Logs.info('Approval transaction: ' + JSON.stringify(tx));
                    await sleep(1500);
                }
            }
            const exactQuote = await fetchQuote(
                buyAddress,
                sellAddress,
                sellAmount,
                true,
            );
            console.log(exactQuote);
            if (
                _.isEmpty(exactQuote) ||
                (!_.isNil(exactQuote.code) && exactQuote.code !== 200)
            ) {
                return;
            }
            const transactionConfig = {
                from: exactQuote.from,
                to: exactQuote.to,
                data: exactQuote.data,
                value: exactQuote.value,
                gasPrice: exactQuote.gasPrice,
                gas: exactQuote.gas,
            };
            CommonLoading.show();
            web3Signer.eth
                .sendTransaction(transactionConfig)
                .on('receipt', function (receipt) {
                    CommonAlert.show({
                        title: t('alert.success'),
                        message: t('tx.your_swap_has_been_sent'),
                    });
                    onRefresh();
                    reset();
                    CommonLoading.hide();
                })
                .on('error', e => {
                    console.log(e);
                    reset();
                    CommonLoading.hide();
                });
        } catch (e) {
            Logs.info(e);
            CommonAlert.show({
                title: t('alert.error'),
                message: e.reason,
                type: 'error',
            });
            reset();
            CommonLoading.hide();
        }
    };
    const onRefresh = async () => {
        setRefreshing(true);
        await reloadToken(fromToken, true);
        await reloadToken(toToken, false);
        setRefreshing(false);
    };
    const reloadToken = async (token, isFrom) => {
        const newToken = {...token};
        if (!_.isEmpty(token)) {
            if (token.isNative === true) {
                dispatch(WalletAction.balance()).then(({data}) => {
                    const defaultToken = {
                        address: data.activeWallet.activeAsset.contract,
                        chainId:
                            CHAIN_ID_MAP[data.activeWallet.activeAsset.chain],
                        decimals: data.activeWallet.activeAsset.decimals,
                        logoURI: data.activeWallet.activeAsset.logoURI,
                        name: data.activeWallet.activeAsset.name,
                        symbol: data.activeWallet.activeAsset.symbol,
                        balance: data.activeWallet.activeAsset.balance,
                        isNative:
                            data.activeWallet.activeAsset.type ===
                            ASSET_TYPE_COIN,
                    };
                    if (isFrom) {
                        setFromToken(defaultToken);
                    } else {
                        setToToken(defaultToken);
                    }
                });
            } else {
                const balance = await WalletFactory.getTokenBalance([
                    {
                        walletAddress: activeWallet.activeAsset.walletAddress,
                        chain: activeWallet.activeAsset.chain,
                        contract: token.address,
                        decimals: token.decimals,
                    },
                ]);
                newToken.balance = balance[0].balance;
                newToken.isNative = false;
                if (isFrom === true) {
                    setFromToken(newToken);
                } else {
                    setToToken(newToken);
                }
            }
        }
    };
    const calculateFee = (gas, gasPrice) => {
        const gasFee = calcFee(gas, gasPrice);
        const finalFee = toEth(gasFee, 18);
        return formatCoins(finalFee);
    };
    return (
        <View style={[styles.container, {backgroundColor: theme.background4}]}>
            <SafeAreaView style={styles.container}>
                <View
                    style={[
                        styles.header,
                        {backgroundColor: theme.background2},
                    ]}>
                    <View style={styles.contentHeader}>
                        <CommonText style={styles.headerTitle}>
                            {t('swap.swap')}
                        </CommonText>
                    </View>
                </View>
                <ScrollView
                    contentContainerStyle={{
                        backgroundColor: theme.background,
                        flex: 1,
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                    <View style={[styles.content]}>
                        <View style={styles.segmentContainer}>
                            <CommonTouchableOpacity
                                onPress={() => {
                                    onChangePlatform('TRON');
                                    setPlatform('TRON');
                                }}
                                style={[
                                    styles.segmentItem,
                                    platform === 'TRON'
                                        ? {
                                              backgroundColor: theme.button,
                                              borderRadius: 10,
                                          }
                                        : {},
                                ]}>
                                <CommonText
                                    style={{
                                        color:
                                            platform === 'TRON'
                                                ? theme.text
                                                : theme.subText,
                                    }}>
                                    TRC20
                                </CommonText>
                            </CommonTouchableOpacity>
                            <CommonTouchableOpacity
                                onPress={() => {
                                    onChangePlatform('BSC');
                                    setPlatform('BSC');
                                }}
                                style={[
                                    styles.segmentItem,
                                    platform === 'BSC'
                                        ? {
                                              backgroundColor: theme.button,
                                              borderRadius: 10,
                                          }
                                        : {},
                                ]}>
                                <CommonText
                                    style={{
                                        color:
                                            platform === 'BSC'
                                                ? theme.text
                                                : theme.subText,
                                    }}>
                                    BEP20
                                </CommonText>
                            </CommonTouchableOpacity>
                        </View>
                        <View
                            style={[
                                styles.inputView,
                                {backgroundColor: theme.inputBackground},
                            ]}>
                            <View style={{flex: 1}}>
                                <TextInput
                                    style={[styles.input, {color: theme.text2}]}
                                    onChangeText={v => setFromTokenAmount(v)}
                                    value={fromTokenAmount}
                                    placeholder={t('swap.you_pay')}
                                    numberOfLines={1}
                                    returnKeyType="done"
                                    placeholderTextColor="gray"
                                    autoCompleteType={'off'}
                                    autoCapitalize={'none'}
                                    keyboardType={'numeric'}
                                    autoCorrect={false}
                                    onEndEditing={async () => {
                                        await getQuote(false);
                                    }}
                                />
                            </View>
                            <CommonTouchableOpacity
                                onPress={async () => {
                                    navigation.navigate('SelectTokenScreen', {
                                        platform:
                                            activeWallet.activeAsset.chain,
                                        onSelect: async item => {
                                            await reloadToken(item, true);
                                            await getQuote(false, item);
                                        },
                                        currentToken: toToken.symbol,
                                    });
                                }}
                                style={styles.tokenContainer}>
                                {_.isEmpty(fromToken) && (
                                    <>
                                        <View style={styles.tokenImg}>
                                            <Icon
                                                name="plus"
                                                size={21}
                                                type={Icons.Feather}
                                            />
                                        </View>
                                        <CommonText
                                            style={{color: theme.text2}}>
                                            {t('swap.select')}
                                        </CommonText>
                                    </>
                                )}
                                {!_.isEmpty(fromToken) && (
                                    <>
                                        <CommonImage
                                            source={{uri: fromToken.logoURI}}
                                            style={styles.tokenImg}
                                        />
                                        <Balance style={{color: theme.text2}}>
                                            {fromToken.balance}
                                        </Balance>
                                        <CommonText
                                            style={{
                                                fontSize: 9,
                                                color: theme.text2,
                                            }}>
                                            {fromToken.symbol}
                                        </CommonText>
                                    </>
                                )}
                            </CommonTouchableOpacity>
                        </View>
                        <View
                            style={[
                                styles.inputView,
                                {backgroundColor: theme.inputBackground},
                            ]}>
                            <TextInput
                                style={[styles.input, {color: theme.text2}]}
                                onChangeText={v => setToTokenAmount(v)}
                                value={toTokenAmount}
                                placeholder={t('swap.you_get')}
                                numberOfLines={1}
                                returnKeyType="done"
                                keyboardType={'numeric'}
                                placeholderTextColor="gray"
                                autoCompleteType={'off'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onEndEditing={async () => {
                                    await getQuote(false);
                                }}
                            />
                            <CommonTouchableOpacity
                                onPress={async () => {
                                    navigation.navigate('SelectTokenScreen', {
                                        platform:
                                            activeWallet.activeAsset.chain,
                                        onSelect: async item => {
                                            await reloadToken(item, false);
                                            await getQuote(
                                                false,
                                                undefined,
                                                item,
                                            );
                                        },
                                        currentToken: fromToken.symbol,
                                    });
                                }}
                                style={styles.tokenContainer}>
                                {_.isEmpty(toToken) && (
                                    <>
                                        <View style={styles.tokenImg}>
                                            <Icon
                                                name="plus"
                                                size={21}
                                                type={Icons.Feather}
                                            />
                                        </View>
                                        <CommonText
                                            style={{color: theme.text2}}>
                                            {t('swap.select')}
                                        </CommonText>
                                    </>
                                )}
                                {!_.isEmpty(toToken) && (
                                    <>
                                        <CommonImage
                                            source={{uri: toToken.logoURI}}
                                            style={styles.tokenImg}
                                        />
                                        <Balance style={{color: theme.text2}}>
                                            {toToken.balance}
                                        </Balance>
                                        <CommonText
                                            style={{
                                                fontSize: 9,
                                                color: theme.text2,
                                            }}>
                                            {toToken.symbol}
                                        </CommonText>
                                    </>
                                )}
                            </CommonTouchableOpacity>
                        </View>
                        <CommonTouchableOpacity
                            style={[
                                styles.exchangeContainer,
                                {
                                    backgroundColor: theme.background,
                                    borderColor: theme.border,
                                    borderWidth: 0.5,
                                },
                            ]}
                            onPress={() => {
                                swapPosition();
                            }}>
                            <Icon
                                name="swap-vertical"
                                size={21}
                                type={Icons.MaterialCommunityIcons}
                            />
                        </CommonTouchableOpacity>
                        <View
                            style={[
                                styles.quoteContainer,
                                {borderBottomColor: theme.border},
                            ]}>
                            <CommonText style={{color: theme.text2}}>
                                {t('swap.price')} 1 {fromToken.symbol}
                            </CommonText>
                            {quote && (
                                <Balance
                                    style={{color: theme.text2}}
                                    symbol={toToken.symbol}>
                                    {quote.price}
                                </Balance>
                            )}
                        </View>
                        <CommonTouchableOpacity
                            style={[
                                styles.quoteContainer,
                                {borderBottomColor: theme.border},
                            ]}
                            onPress={() => {}}>
                            <CommonText style={{color: theme.text2}}>
                                {t('swap.slippage')}
                            </CommonText>
                            <CommonText style={{color: theme.text2}}>
                                {slippagePercentage * 100}%
                            </CommonText>
                        </CommonTouchableOpacity>
                        <CommonTouchableOpacity
                            style={[
                                styles.quoteContainer,
                                {borderBottomColor: theme.border},
                            ]}
                            onPress={() => {}}>
                            <CommonText style={{color: theme.text2}}>
                                {t('swap.commission_fee')}
                            </CommonText>
                            <CommonText style={{color: theme.text2}}>
                                0.001
                            </CommonText>
                        </CommonTouchableOpacity>
                        <View
                            style={[
                                styles.quoteContainer,
                                {borderBottomColor: theme.border},
                            ]}>
                            <CommonText style={{color: theme.text2}}>
                                {t('swap.estimated_gas')}
                            </CommonText>
                            <CommonText style={{color: theme.text2}}>
                                {quote != null
                                    ? calculateFee(quote.gas, quote.gasPrice)
                                    : '-'}
                            </CommonText>
                        </View>
                        <View
                            style={[
                                styles.quoteContainer,
                                {borderBottomColor: theme.border},
                            ]}>
                            <CommonText style={{color: theme.text2}}>
                                {t('swap.allowance')}
                            </CommonText>
                            <CommonText style={{color: theme.text2}}>
                                {t('swap.exact_amount')}
                            </CommonText>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <CommonButton
                            text={
                                !quote || !isEnough
                                    ? t('swap.comingsoon')
                                    : t('swap.swap')
                            }
                            // onPress={async () => {
                            //     if (quote && isEnough) {
                            //         await swap();
                            //     } else {
                            //         await getQuote();
                            //     }
                            // }}
                        />
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
    content: {
        paddingHorizontal: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    qrCode: {
        minHeight: 280,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 3,
        borderRadius: 10,
    },
    qrCodeHeader: {
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrCodeFooter: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
    },
    description: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    controls: {
        width: '40%',
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    element: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    elementIcon: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginBottom: 5,
    },
    headerPriceContainer: {
        width: 70,
    },
    inputView: {
        height: 70,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 14,
        marginVertical: 10,
        marginBottom: 0,
        marginHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    input: {flex: 1, color: 'white', paddingLeft: 5},
    tokenContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
    },
    tokenImg: {
        width: 24,
        height: 24,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exchangeContainer: {
        height: 32,
        width: 32,
        borderRadius: 5,
        position: 'absolute',
        top: 115,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    tokenSymbols: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderRadius: 10,
    },
    tokenBalance: {width: '100%', height: 25},
    buttonContainer: {
        paddingHorizontal: 10,
        flex: 1,
    },
    quoteContainer: {
        height: 50,
        width: '100%',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    segmentContainer: {
        paddingHorizontal: 5,
        height: 45,
        flexDirection: 'row',
    },
    segment: {
        height: 55,
        width: '100%',
    },
    segmentItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
