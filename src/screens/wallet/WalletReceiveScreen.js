import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import Icon, {Icons} from '@components/icons/Icons';
import {useTranslation} from 'react-i18next';
import QRCode from 'react-native-qrcode-svg';
import Tooltip from 'react-native-walkthrough-tooltip';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';

export default function WalletReceiveScreen({navigation, route}) {
    const {coin} = route.params;
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const dispatch = useDispatch();
    const [tooltipVisible, setTooltipVisible] = React.useState(false);
    const copyToClipboard = async data => {
        await Clipboard.setString(data);
    };
    const shareAddress = async () => {
        await Share.open({
            title: '',
            message: coin.walletAddress,
        });
    };
    useEffect(() => {
        (async () => {})();
    }, []);
    return (
        <SafeAreaView
            style={[styles.container, {backgroundColor: theme.background4}]}>
            <View   style={[styles.container, {backgroundColor: theme.background}]}>
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
                            {t('receive.receive')}
                        </CommonText>
                    </View>
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        <View style={[styles.qrCode]}>
                            <QRCode
                                value={coin.walletAddress}
                                size={240}
                                backgroundColor={'white'}
                                logo={{uri: coin.logoURI}}
                                logoBackgroundColor={'black'}
                            />
                            <CommonText
                                style={{
                                    color: theme.text2,
                                    paddingHorizontal: 36,
                                }}
                                ellipsizeMode="middle"
                                numberOfLines={1}>
                                {coin.walletAddress}
                            </CommonText>
                        </View>
                        <View style={styles.description}>
                            <CommonText
                                style={[styles.text, {color: theme.text2}]}>
                                {t('wallet.receive.sendOnly')} {coin.symbol}{' '}
                                {t('wallet.receive.toThisAddress')}
                            </CommonText>
                            <CommonText
                                style={[styles.text, {color: theme.text2}]}>
                                {t('wallet.receive.sendingAnyOtherCoins')}
                            </CommonText>
                        </View>
                        <View style={styles.controls}>
                            <CommonTouchableOpacity
                                style={styles.element}
                                onPress={async () => {
                                    await copyToClipboard(coin.walletAddress);
                                    setTooltipVisible(true);
                                    setTimeout(() => {
                                        setTooltipVisible(false);
                                    }, 1000);
                                }}>
                                <View
                                    style={[
                                        styles.elementIcon,
                                        {
                                            backgroundColor:
                                                'rgba(152,173,196,0.1)',
                                        },
                                    ]}>
                                    <Tooltip
                                        isVisible={tooltipVisible}
                                        content={
                                            <CommonText
                                                style={{color: 'black'}}>
                                                {t(
                                                    'wallet.receive.addressCopied',
                                                )}
                                            </CommonText>
                                        }
                                        placement="top"
                                        onClose={() => {}}>
                                        <Icon
                                            type={Icons.Ionicons}
                                            name={'copy'}
                                            size={19}
                                        />
                                    </Tooltip>
                                </View>
                                <CommonText style={{color: theme.text2}}>
                                    {t('wallet.receive.copy')}
                                </CommonText>
                            </CommonTouchableOpacity>
                            <CommonTouchableOpacity
                                style={styles.element}
                                onPress={async () => {
                                    await shareAddress();
                                }}>
                                <View
                                    style={[
                                        styles.elementIcon,
                                        {
                                            backgroundColor:
                                                'rgba(152,173,196,0.1)',
                                        },
                                    ]}>
                                    <Icon
                                        type={Icons.FontAwesome}
                                        name={'share'}
                                        size={19}
                                    />
                                </View>
                                <CommonText style={{color: theme.text2}}>
                                    {t('wallet.receive.share')}
                                </CommonText>
                            </CommonTouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
    content: {
        flex: 1,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    logoContainer: {
        height: 100,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#efefef',
    },
    logo: {
        height: 100,
        width: 80,
    },
    qrCode: {
        flex: 1,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#efefef',
        marginTop: 20,
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
        marginTop: 10,
    },
    controls: {
        width: '40%',
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
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
        marginBottom: 5,
        borderRadius: 100,
    },
});
