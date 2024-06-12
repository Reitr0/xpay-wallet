import React, {useEffect} from 'react';
import {
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import Icon, {Icons} from '@components/icons/Icons';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {applicationProperties} from '@src/application.properties';

export default function SettingScreen({navigation}) {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {activeWallet} = useSelector(state => state.WalletReducer);

    useEffect(() => {
        (async () => {})();
    }, []);

    return (
        <View style={[styles.container, {backgroundColor: theme.background4}]}>
            <SafeAreaView style={[styles.container]}>
                <View
                    style={[
                        styles.header,
                        {backgroundColor: theme.background4},
                    ]}>
                    <View style={styles.contentHeader}>
                        <CommonText style={styles.headerTitle}>
                            {t('setting.setting')}
                        </CommonText>
                    </View>
                </View>
                <ScrollView
                    style={[
                        styles.content,
                        {backgroundColor: theme.background},
                    ]}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.item}>
                        <CommonTouchableOpacity
                            onPress={() => {
                                navigation.navigate('AccountScreen');
                            }}
                            style={[
                                styles.row,
                                {backgroundColor: theme.background},
                            ]}>
                            <View style={styles.leftItemContainer}>
                                <View
                                    style={[
                                        styles.iconContainer,
                                        {backgroundColor: '#4f77fb'},
                                    ]}>
                                    <Icon
                                        type={Icons.Ionicons}
                                        size={18}
                                        name={'md-wallet-outline'}
                                        color={'white'}
                                    />
                                </View>
                                <CommonText style={{color: theme.text2}}>
                                    {t('settings.wallets')}
                                </CommonText>
                            </View>
                            <View style={styles.leftItemContainer}>
                                <CommonText style={{color: theme.subText}}>
                                    {activeWallet.name}
                                </CommonText>
                            </View>
                        </CommonTouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        <CommonTouchableOpacity
                            onPress={() => {
                                navigation.navigate('SecurityScreen');
                            }}
                            style={[
                                styles.row,
                                {
                                    backgroundColor: theme.background,
                                    borderBottomColor: theme.border,
                                    borderBottomWidth: 0.3,
                                },
                            ]}>
                            <View style={styles.leftItemContainer}>
                                <View
                                    style={[
                                        styles.iconContainer,
                                        {backgroundColor: '#565656'},
                                    ]}>
                                    <Icon
                                        type={Icons.MaterialCommunityIcons}
                                        size={18}
                                        name={'security'}
                                        color={'white'}
                                    />
                                </View>
                                <CommonText style={{color: theme.text2}}>
                                    {t('settings.security')}
                                </CommonText>
                            </View>
                        </CommonTouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        <CommonTouchableOpacity
                            onPress={() => {
                                navigation.navigate('PreferencesScreen');
                            }}
                            style={[
                                styles.row,
                                {backgroundColor: theme.background},
                            ]}>
                            <View style={styles.leftItemContainer}>
                                <View
                                    style={[
                                        styles.iconContainer,
                                        {backgroundColor: '#33b9a2'},
                                    ]}>
                                    <Icon
                                        type={Icons.Ionicons}
                                        size={18}
                                        name={'settings-outline'}
                                        color={'white'}
                                    />
                                </View>
                                <CommonText style={{color: theme.text2}}>
                                    {t('settings.preferences')}
                                </CommonText>
                            </View>
                        </CommonTouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        <CommonTouchableOpacity
                            onPress={async () => {
                                await Linking.openURL(
                                    applicationProperties.endpoints.helpCenter,
                                );
                            }}
                            style={[
                                styles.row,
                                {backgroundColor: theme.background},
                            ]}>
                            <View style={styles.leftItemContainer}>
                                <View
                                    style={[
                                        styles.iconContainer,
                                        {backgroundColor: '#e04479'},
                                    ]}>
                                    <Icon
                                        type={Icons.AntDesign}
                                        size={18}
                                        name={'QuestionOutlined'}
                                        color={'white'}
                                    />
                                </View>
                                <CommonText style={{color: theme.text2}}>
                                    {t('settings.about')}
                                </CommonText>
                            </View>
                        </CommonTouchableOpacity>
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
    content: {},
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
    item: {
        width: '100%',
    },
    row: {
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    leftItemContainer: {
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 42,
        height: 42,
        backgroundColor: '#27aa7b',
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
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
});
