import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import {useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonButton from '@components/commons/CommonButton';
import {useTranslation} from 'react-i18next';

export default function AddAccountStep2Screen({navigation, route}) {
    const {t} = useTranslation();
    const {account} = route.params;
    const {theme} = useSelector(state => state.ThemeReducer);
    const [walletName, setWalletName] = useState('');
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
                            {t('setting.information')}
                        </CommonText>
                    </View>
                </View>
                <View
                    style={[
                        styles.content,
                        {backgroundColor: theme.background},
                    ]}>
                    <View style={styles.section}>
                        <View style={styles.inputTitle}>
                            <CommonText style={{color: theme.text2}}>
                                {t('setting.wallet_name')}
                            </CommonText>
                        </View>
                        <View
                            style={[
                                styles.inputView,
                                {backgroundColor: theme.inputBackground},
                            ]}>
                            <TextInput
                                style={[styles.input, {color: theme.inputText}]}
                                onChangeText={text => setWalletName(text)}
                                value={walletName}
                                placeholder={t('setting.enter_wallet_name')}
                                numberOfLines={1}
                                returnKeyType="done"
                                placeholderTextColor="gray"
                                autoCompleteType={'off'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                            />
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <CommonButton
                            text={t('setting.create_a_new_wallet')}
                            onPress={async () => {
                                if (walletName.trim() === '') {
                                    return;
                                }
                                navigation.navigate('AddAccountStep3Screen', {
                                    account: {
                                        ...account,
                                        name: walletName,
                                    },
                                });
                            }}
                        />
                        <CommonButton
                            style={{
                                marginTop: 20,
                                backgroundColor: theme.backgroundColor,
                            }}
                            textStyle={{color: theme.text2}}
                            text={t('setting.import_using_seed_phrase')}
                            onPress={async () => {
                                if (walletName.trim() === '') {
                                    return;
                                }
                                navigation.navigate('AddAccountStep5Screen', {
                                    account: {
                                        ...account,
                                        name: walletName,
                                    },
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
    section: {
        width: '100%',
        flex: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    item: {
        height: 70,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    leftItemContainer: {
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightItemContainer: {
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputView: {
        height: 60,
        paddingHorizontal: 10,
        fontSize: 14,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    input: {flex: 1},
    inputTitle: {
        height: 30,
        width: '100%',
        justifyContent: 'center',
        marginVertical: 10,
    },
    buttonContainer: {
        padding: 10,
    },
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
    content: {
        flex: 1,
    },
});
