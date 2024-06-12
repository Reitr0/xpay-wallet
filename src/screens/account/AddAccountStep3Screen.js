import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, ToastAndroid, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonButton from '@components/commons/CommonButton';
import {WalletFactory} from '@modules/core/factory/WalletFactory';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {useTranslation} from 'react-i18next';
import Clipboard from '@react-native-clipboard/clipboard';

export default function AddAccountStep3Screen({navigation, route}) {
    const {t} = useTranslation();
    const {account} = route.params;
    const [mnemonics] = useState(WalletFactory.generateMnemonics());
    const {theme} = useSelector(state => state.ThemeReducer);
    const dispatch = useDispatch();
    useEffect(() => {}, []);
    const renderMnemonic = (mnemonic, index) => (
        <View
            style={[styles.mnemonic, {backgroundColor: theme.backgroundColor}]}
            key={index}>
            <CommonText
                style={{
                    textAlign: 'left',
                    fontWeight: 'bold',
                    color: theme.text2,
                }}>
                {index + 1}. {mnemonic}
            </CommonText>
        </View>
    );

    const copyToClipboard = () => {
        ToastAndroid.showWithGravity(
            'Copied to clipboard',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
        );
        const joinedMnemonics = mnemonics.join(' ');
        Clipboard.setString(joinedMnemonics);
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
                </View>
                <View
                    style={[
                        styles.content,
                        {backgroundColor: theme.background},
                    ]}>
                    <View style={styles.titleContainer}>
                        <CommonText
                            style={[styles.titleText, {color: theme.text2}]}>
                            {t('backup.yourRecoveryPhrase')}
                        </CommonText>
                        <CommonText
                            style={[styles.descText, {color: theme.subText}]}>
                            {t('backup.writeDown')}
                        </CommonText>
                    </View>
                    <View style={styles.mnemonicContainer}>
                        {mnemonics && mnemonics.map(renderMnemonic)}
                    </View>
                    <View style={styles.copyContainer}>
                        <CommonTouchableOpacity
                            onPress={() => copyToClipboard()}>
                            <CommonText
                                style={[styles.copy, {color: theme.button}]}>
                                {t('setting.copy')}
                            </CommonText>
                        </CommonTouchableOpacity>
                    </View>
                    <View style={styles.bottomContainer}>
                        <View style={styles.warningContainer}>
                            <CommonText
                                style={[
                                    styles.warningText,
                                    {color: theme.text3},
                                ]}>
                                {t('mnemonic.do_not')}
                            </CommonText>
                            <CommonText
                                style={[
                                    styles.warningText,
                                    {
                                        color: theme.text3,
                                        fontWeight: 'normal',
                                        marginTop: 10,
                                    },
                                ]}>
                                {t('backup.never_ask')}
                            </CommonText>
                        </View>
                        <CommonButton
                            text={t('continue')}
                            style={{
                                marginVertical: 10,
                            }}
                            textStyle={{color: theme.text}}
                            onPress={() => {
                                const data = mnemonics.map((item, index) => {
                                    return {
                                        id: index + 1,
                                        word: item,
                                    };
                                });
                                navigation.navigate('AddAccountStep4Screen', {
                                    mnemonics: data,
                                    account,
                                });
                            }}
                        />
                    </View>
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
    content: {
        flex: 1,
        width: '100%',
        paddingTop: 10,
    },
    titleContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    descText: {
        marginVertical: 10,
        textAlign: 'center',
    },
    mnemonicContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    agreementContainer: {
        width: '100%',
        paddingHorizontal: 10,
    },
    agreementItem: {
        width: '100%',
        height: 70,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    agreementText: {
        fontSize: 15,
    },
    check: {
        width: 32,
        height: 32,
    },
    mnemonic: {
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        marginVertical: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    copy: {
        fontSize: 15,
    },
    copyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    bottomContainer: {
        flex: 1,
        padding: 10,
        justifyContent: 'flex-end',
    },
    warningContainer: {
        width: '100%',
        height: 120,
        backgroundColor: '#e7d5d6',
        padding: 10,
        justifyContent: 'center',
    },
    warningText: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
});
