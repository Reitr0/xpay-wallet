import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import CommonText from '@components/commons/CommonText';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import Icon, {Icons} from '@components/icons/Icons';
import Clipboard from '@react-native-clipboard/clipboard';
import CommonButton from '@components/commons/CommonButton';
import {TokenFactory} from '@modules/core/factory/TokenFactory';
import {applicationProperties} from '@src/application.properties';
import CommonLoading from '@components/commons/CommonLoading';
import _ from 'lodash';
import CommonAlert from '@components/commons/CommonAlert';
import {TokenAction} from '@persistence/token/TokenAction';
import {TokenService} from '@persistence/token/TokenService';

export default function AddTokenScreen({navigation, route}) {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const dispatch = useDispatch();
    const {ALL} = useSelector(state => state.TokenReducer);
    const [network, setNetwork] = useState(applicationProperties.networks[0]);
    const [token, setToken] = useState({
        address: '',
        decimals: '',
        name: '',
        symbol: '',
        logo: '',
        verified: false,
    });
    useEffect(() => {
        console.log('net', network.chain);
        (async () => {})();
    }, [network.chain]);
    const fetchTokenMetaData = async () => {
        const existedToken = _.find(ALL, function (item) {
            return item.address.toLowerCase() === token.address.toLowerCase();
        });
        if (!_.isNil(existedToken)) {
            CommonAlert.show({
                title: t('alert.error'),
                message: t('token_found'),
                type: 'error',
            });
            return;
        }
        CommonLoading.show();
        const tokenMetadata = await TokenFactory.getTokenMetadata(
            network.chain,
            token.address,
        );
        if (!_.isNil(tokenMetadata)) {
            setToken(tokenMetadata);
            CommonLoading.hide();
            return;
        }
        CommonAlert.show({
            title: t('alert.error'),
            message: t('token_not_found'),
            type: 'error',
        });
        CommonLoading.hide();
    };
    const fetchCopiedText = async () => {
        const text = await Clipboard.getString();
        setToken({...token, address: text});
    };
    return (
        <SafeAreaView
            style={[styles.container, {backgroundColor: theme.background2}]}>
            <View
                style={[styles.container, {backgroundColor: theme.background}]}>
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
                        <CommonText style={[styles.headerTitle]}>
                            {t('token.add_new_token')}
                        </CommonText>
                    </View>
                    <View style={styles.rightHeader} />
                </View>
                <View style={styles.content}>
                    <View
                        style={[
                            styles.formContainer,
                            {borderColor: theme.border},
                        ]}>
                        <View style={styles.titleContainer}>
                            <CommonText style={{color: theme.text2}}>
                                Network
                            </CommonText>
                        </View>
                        <CommonTouchableOpacity
                            onPress={() => {
                                navigation.navigate('SelectNetworkScreen', {
                                    onCallBack: nw => {
                                        setNetwork(nw);
                                    },
                                });
                            }}
                            style={[
                                styles.inputView,
                                {
                                    borderColor: theme.border,
                                },
                            ]}>
                            <View style={styles.input}>
                                <CommonText style={{color: theme.text2}}>
                                    {network.name}
                                </CommonText>
                            </View>

                            <CommonTouchableOpacity
                                onPress={async () => {
                                    await fetchCopiedText();
                                    if (token.address !== '') {
                                        await fetchTokenMetaData();
                                    }
                                }}
                                style={styles.moreBtn}>
                                <Icon
                                    name="chevron-down"
                                    size={20}
                                    color={theme.text2}
                                    type={Icons.Octicons}
                                />
                            </CommonTouchableOpacity>
                        </CommonTouchableOpacity>
                        <View style={styles.titleContainer}>
                            <CommonText style={{color: theme.text2}}>
                                Contract address
                            </CommonText>
                        </View>
                        <View
                            style={[
                                styles.inputView,
                                {
                                    borderColor: theme.border,
                                },
                            ]}>
                            <TextInput
                                style={styles.input}
                                onChangeText={v => {
                                    setToken({...token, address: v});
                                }}
                                value={token.address}
                                placeholder={t('custom_token.contract_address')}
                                returnKeyType="done"
                                placeholderTextColor="gray"
                                onEndEditing={async () => {
                                    await fetchTokenMetaData();
                                }}
                            />
                            <CommonTouchableOpacity
                                onPress={async () => {
                                    await fetchCopiedText();
                                    if (token.address !== '') {
                                        await fetchTokenMetaData();
                                    }
                                }}
                                style={styles.moreBtn}>
                                <Icon
                                    name="paperclip"
                                    size={20}
                                    color={theme.text2}
                                    type={Icons.Octicons}
                                />
                            </CommonTouchableOpacity>
                        </View>
                        <View style={styles.titleContainer}>
                            <CommonText style={{color: theme.text2}}>
                                Name
                            </CommonText>
                        </View>

                        <View
                            style={[
                                styles.inputView,
                                {
                                    borderColor: theme.border,
                                },
                            ]}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('token_name')}
                                numberOfLines={1}
                                returnKeyType="done"
                                value={token.name}
                                placeholderTextColor="gray"
                                autoCompleteType={'off'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                editable={false}
                            />
                        </View>
                        <View style={styles.titleContainer}>
                            <CommonText style={{color: theme.text2}}>
                                Symbol
                            </CommonText>
                        </View>
                        <View
                            style={[
                                styles.inputView,
                                {
                                    borderColor: theme.border,
                                },
                            ]}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('token_symbol')}
                                numberOfLines={1}
                                value={token.symbol}
                                returnKeyType="done"
                                placeholderTextColor="gray"
                                autoCompleteType={'off'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                editable={false}
                            />
                        </View>
                        <View style={styles.titleContainer}>
                            <CommonText style={{color: theme.text2}}>
                                Decimals
                            </CommonText>
                        </View>
                        <View
                            style={[
                                styles.inputView,
                                {
                                    borderColor: theme.border,
                                },
                            ]}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('token_decimals')}
                                numberOfLines={1}
                                value={token.decimals}
                                returnKeyType="done"
                                placeholderTextColor="gray"
                                autoCompleteType={'off'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                editable={false}
                            />
                        </View>
                        <View style={styles.titleContainer}>
                            <CommonText style={{color: theme.text2}}>
                                Logo
                            </CommonText>
                        </View>
                        <View
                            style={[
                                styles.inputView,
                                {
                                    borderColor: theme.border,
                                },
                            ]}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('token_logo')}
                                numberOfLines={1}
                                value={token.logo}
                                returnKeyType="done"
                                placeholderTextColor="gray"
                                autoCompleteType={'off'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                editable={true}
                                onChangeText={v => {
                                    setToken({...token, logo: v});
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <CommonButton
                            text={t('token_save')}
                            onPress={async () => {
                                if (token.symbol === '') {
                                    return;
                                }
                                let chainId = 1;
                                let logo =
                                    token.logo ||
                                    applicationProperties.logoURI.noImage;
                                if (network.chain === 'BSC') {
                                    chainId = 56;
                                    logo =
                                        token.logo ||
                                        applicationProperties.logoURI.noImage;
                                } else if (network.chain === 'POLYGON') {
                                    chainId = 137;
                                    logo =
                                        token.logo ||
                                        applicationProperties.logoURI.noImage;
                                } else if (network.chain === 'TRON') {
                                    chainId = 1;
                                    logo =
                                        token.logo ||
                                        applicationProperties.logoURI.noImage;
                                }
                                try {
                                    const data = {
                                        ...token,
                                        id: token.address,
                                        logoURI: logo,
                                        chainId: chainId,
                                        verified: false,
                                    };
                                    CommonLoading.show();
                                    //kepentok disini
                                    const {
                                        success: getTokenSuccess,
                                        data: coin,
                                    } = await TokenService.getTokenId(data);
                                    //sampe sini
                                    if (getTokenSuccess === true) {
                                        data.id = coin.id;
                                        dispatch(
                                            TokenAction.addToken(data),
                                        ).then(({success}) => {
                                            CommonLoading.hide();
                                            if (success === true) {
                                                navigation.goBack();
                                            } else {
                                                CommonAlert.show({
                                                    title: t('alert.error'),
                                                    message: 'Error',
                                                    type: 'error',
                                                });
                                            }
                                        });
                                    } else {
                                        CommonLoading.hide();
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                            }}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    header: {
        height: 48,
        paddingHorizontal: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    gradient: {
        width: '100%',
        height: '100%',
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
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    formContainer: {
        width: '100%',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    networkContainer: {
        width: '100%',
        height: 45,
        flexDirection: 'row',
    },
    network: {
        width: 100,
        height: '100%',
        justifyContent: 'center',
    },
    selectedNetwork: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
    },
    networkText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    inputView: {
        height: 45,
        borderWidth: 0.5,
        borderColor: '#c4c4c4',
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 14,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },
    input: {flex: 1, color: 'black', justifyContent: 'center'},
    moreBtn: {
        justifyContent: 'center',
        marginRight: 10,
        paddingLeft: 10,
    },
    buttonContainer: {
        height: 70,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    titleContainer: {
        marginTop: 10,
    },
});
