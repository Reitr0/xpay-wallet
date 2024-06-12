import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Switch, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import Icon, {Icons} from '@components/icons/Icons';
import {ThemeAction} from '@persistence/theme/ThemeAction';
import {applicationProperties} from '@src/application.properties';
import {StorageService} from '@modules/core/storage/StorageService';

export default function PreferencesScreen({navigation}) {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {theme, defaultTheme} = useSelector(state => state.ThemeReducer);
    const [language, setLanguage] = useState('');
    const {currency} = useSelector(state => state.CurrencyReducer);
    useEffect(() => {
        (async () => {
            await getLanguage();
        })();
    }, [getLanguage]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getLanguage = useCallback(async () => {
        const lang = (await StorageService.getItem('@lng')) || 'en';
        switch (lang) {
            case 'en':
                setLanguage(t('language.english'));
                break;
            case 'fr':
                setLanguage(t('language.french'));
                break;
            case 'id':
                setLanguage(t('language.indonesian'));
                break;
            case 'ja':
                setLanguage(t('language.japanese'));
                break;
            case 'ko':
                setLanguage(t('language.korean'));
                break;
            case 'cn':
                setLanguage(t('language.chinese'));
                break;
            case 'th':
                setLanguage(t('language.thai'));
                break;
            case 'vi':
                setLanguage(t('language.vietnamese'));
                break;
            case 'fi':
                setLanguage(t('language.filipino'));
                break;
        }
    });

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
                            {t('settings.preferences')}
                        </CommonText>
                    </View>
                </View>
                <View
                    style={[
                        styles.content,
                        {backgroundColor: theme.background},
                    ]}>
                    <CommonTouchableOpacity
                        style={[
                            styles.item,
                            {
                                backgroundColor: theme.background,
                                borderBottomColor: theme.border,
                                borderBottomWidth: 0.3,
                            },
                        ]}>
                        <View style={styles.leftSubItem}>
                            <Icon
                                name="moon"
                                size={20}
                                type={Icons.Feather}
                                color={theme.text2}
                            />
                        </View>
                        <View style={styles.centerSubItem}>
                            <CommonText
                                style={[styles.textItem, {color: theme.text2}]}>
                                {t('settings.theme')}
                            </CommonText>
                        </View>
                        <View>
                            <Switch
                                trackColor={{false: '#767577', true: '#81b0ff'}}
                                thumbColor={
                                    defaultTheme.code === 'light'
                                        ? '#f5dd4b'
                                        : '#f4f3f4'
                                }
                                ios_backgroundColor="#3e3e3e"
                                value={defaultTheme.code === 'light'}
                                disabled={false}
                            />
                            <CommonTouchableOpacity
                                onPress={() => {
                                    if (defaultTheme.code === 'light') {
                                        dispatch(
                                            ThemeAction.setDefault(
                                                applicationProperties.themes[0],
                                            ),
                                        );
                                    } else {
                                        dispatch(
                                            ThemeAction.setDefault(
                                                applicationProperties.themes[1],
                                            ),
                                        );
                                    }
                                }}
                                style={{
                                    height: '100%',
                                    width: 50,
                                    position: 'absolute',
                                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                                }}
                            />
                        </View>
                    </CommonTouchableOpacity>
                    <CommonTouchableOpacity
                        style={[
                            styles.item,
                            {
                                backgroundColor: theme.background,
                                borderBottomColor: theme.border,
                                borderBottomWidth: 0.3,
                            },
                        ]}
                        onPress={() => {
                            navigation.navigate('LanguageScreen', {
                                onCallBack: getLanguage,
                            });
                        }}>
                        <View style={styles.leftSubItem}>
                            <Icon
                                name="language"
                                size={20}
                                type={Icons.Ionicons}
                                color={theme.text2}
                            />
                        </View>
                        <View style={styles.centerSubItem}>
                            <CommonText
                                style={[styles.textItem, {color: theme.text2}]}>
                                {t('settings.language')}
                            </CommonText>
                        </View>
                        <View style={styles.rightSubItem}>
                            <View style={{flexDirection: 'row'}}>
                                <CommonText style={{color: theme.text2}}>
                                    {language}
                                </CommonText>
                            </View>
                        </View>
                    </CommonTouchableOpacity>
                    <CommonTouchableOpacity
                        style={[
                            styles.item,
                            {
                                backgroundColor: theme.background,
                                borderBottomColor: theme.border,
                                borderBottomWidth: 0.3,
                            },
                        ]}
                        onPress={() => {
                            navigation.navigate('CurrencyScreen');
                        }}>
                        <View style={styles.leftSubItem}>
                            <Icon
                                name="currency-usd"
                                size={20}
                                type={Icons.MaterialCommunityIcons}
                                color={theme.text2}
                            />
                        </View>
                        <View style={styles.centerSubItem}>
                            <CommonText
                                style={[styles.textItem, {color: theme.text2}]}>
                                {t('settings.currency')}
                            </CommonText>
                        </View>
                        <View style={styles.rightSubItem}>
                            <View style={{flexDirection: 'row'}}>
                                <CommonText style={{color: theme.text2}}>
                                    {' '}
                                    {currency.code} - {currency.name}
                                </CommonText>
                            </View>
                        </View>
                    </CommonTouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}
const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 10,
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        height: 50,
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
        height: 70,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftSubItem: {width: 20},
    rightSubItem: {},
    centerSubItem: {flex: 1},
    textItem: {marginLeft: 15},
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
});
