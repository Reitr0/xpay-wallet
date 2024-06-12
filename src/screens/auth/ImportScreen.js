import React, {useEffect, useRef, useState} from 'react';
import {
    Keyboard,
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import CommonBackButton from '@components/commons/CommonBackButton';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import Icon, {Icons} from '@components/icons/Icons';
import CommonButton from '@components/commons/CommonButton';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {StackActions} from '@react-navigation/native';
import {deleteUserPinCode} from '@haskkor/react-native-pincode';
import * as bip39 from 'bip39';
import ActionSheet from 'react-native-actions-sheet';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import CommonLoading from '@components/commons/CommonLoading';
import {WalletAction} from '@persistence/wallet/WalletAction';
import {applicationProperties} from '@src/application.properties';
import {
    DEFAULT_WALLET,
    WALLET_LIST,
    WALLET_TYPE,
} from '@persistence/wallet/WalletConstant';
import {UserAction} from '@persistence/user/UserAction';
import CommonAlert from '@components/commons/CommonAlert';
import { FeeAction } from "@persistence/fee/FeeAction";

export default function ImportScreen({navigation, route}) {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const [name, setName] = useState('');
    const [mnemonic, setMnemonic] = useState('');
    const actionCamera = useRef(null);
    const dispatch = useDispatch();
    useEffect(() => {}, []);
    const onSuccess = e => {
        setMnemonic(e.data);
        actionCamera.current?.hide();
    };
    return (
        <View style={styles.container}>
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
                                await deleteUserPinCode();
                                navigation.dispatch(StackActions.pop(2));
                            }}
                        />
                    </View>

                    <View style={styles.contentHeader}>
                        <CommonText style={styles.headerTitle}>
                            {t('import_import_wallet')}
                        </CommonText>
                    </View>
                    <View style={styles.rightHeader}>
                        <CommonTouchableOpacity
                            onPress={() => {
                                actionCamera.current?.show();
                            }}>
                            <Icon
                                type={Icons.AntDesign}
                                size={18}
                                name={'scan1'}
                                color={theme.text}
                            />
                        </CommonTouchableOpacity>
                    </View>
                </View>
                <View style={[styles.content]}>
                    <View style={[styles.row, {marginTop: 10}]}>
                        <View
                            style={[
                                styles.inputView,
                                {
                                    borderColor: theme.border,
                                    borderWidth: 1,
                                },
                            ]}>
                            <View
                                style={[
                                    styles.inputLabel,
                                    {backgroundColor: theme.background},
                                ]}>
                                <CommonText
                                    style={{color: theme.text2, fontSize: 12}}>
                                    {t('name')}
                                </CommonText>
                            </View>
                            <TextInput
                                style={[styles.input, {color: theme.text2}]}
                                value={name}
                                onChangeText={value => setName(value)}
                                numberOfLines={1}
                                returnKeyType="done"
                                placeholderTextColor="gray"
                                autoCompleteType={'off'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                            />
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View
                            style={[
                                styles.inputView,
                                {
                                    borderColor: theme.border,
                                    borderWidth: 1,
                                },
                            ]}>
                            <View
                                style={[
                                    styles.inputLabel,
                                    {backgroundColor: theme.background},
                                ]}>
                                <CommonText
                                    style={{color: theme.text2, fontSize: 12}}>
                                    {t('secret_key')}
                                </CommonText>
                            </View>
                            <TextInput
                                style={[
                                    styles.input,
                                    {color: theme.text2, height: 100},
                                ]}
                                returnKeyType="done"
                                value={mnemonic}
                                onChangeText={value => setMnemonic(value)}
                                placeholderTextColor="gray"
                                autoCompleteType={'off'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                multiline={true}
                                numberOfLines={15}
                                keyboardAppearance={'dark'}
                                onSubmitEditing={Keyboard.dismiss}
                            />
                        </View>
                    </View>
                    <View style={styles.warningContainer}>
                        <CommonText style={{color: theme.subText}}>
                            {t('import_typically_12')}
                        </CommonText>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <CommonButton
                        text={t('continue')}
                        style={{
                            marginVertical: 10,
                        }}
                        textStyle={{color: theme.text}}
                        onPress={async () => {
                            const validMnemonic =
                                bip39.validateMnemonic(mnemonic.trim());
                            if (!validMnemonic) {
                                CommonAlert.show({
                                    title: t('alert.error'),
                                    message: t('mnemonic.invalid_order'),
                                    type: 'error',
                                });
                                return;
                            }
                            CommonLoading.show();
                            dispatch(
                                WalletAction.insert({
                                    mnemonic: mnemonic,
                                    ...DEFAULT_WALLET,
                                }),
                            ).then(async ({data}) => {
                                dispatch(UserAction.signIn()).then(() => {
                                    dispatch(
                                      FeeAction.getFee(),
                                    );
                                    CommonLoading.hide();
                                });
                            });
                        }}
                    />
                </View>
                <ActionSheet
                    ref={actionCamera}
                    gestureEnabled={true}
                    headerAlwaysVisible
                    containerStyle={[
                        styles.cameraContainer,
                        {backgroundColor: theme.button},
                    ]}>
                    <QRCodeScanner
                        onRead={onSuccess}
                        flashMode={RNCamera.Constants.FlashMode.auto}
                    />
                </ActionSheet>
            </SafeAreaView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerBg: {
        height: 48,
        backgroundColor: 'red',
        position: 'absolute',
        width: '100%',
        top: 0,
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
        width: 100,
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
        width: '100%',
    },
    row: {
        paddingHorizontal: 10,
        width: '100%',
        paddingVertical: 10,
    },
    inputView: {
        minHeight: 50,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 14,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    input: {flex: 1},
    inputLabel: {
        position: 'absolute',
        top: -10,
        left: 10,
    },
    warningContainer: {
        width: '100%',
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    bottomContainer: {
        width: '100%',
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
    },
    cameraContainer: {
        width: '100%',
        height: '69%',
    },
});
