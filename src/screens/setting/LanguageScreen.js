import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonText from '@components/commons/CommonText';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import CommonImage from '@components/commons/CommonImage';
import i18n from 'i18next';
import Icon, {Icons} from '@components/icons/Icons';
import {StorageService} from '@modules/core/storage/StorageService';

export default function LanguageScreen({navigation, route}) {
    const {onCallBack} = route.params;
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const [currentLang, setCurrentLang] = useState('');
    useEffect(() => {
        (async () => {
            const lang = (await StorageService.getItem('@lng')) || 'en';
            setCurrentLang(lang);
        })();
    }, []);
    const setLanguage = async lng => {
        await i18n.changeLanguage(lng);
        await StorageService.setItem('@lng', lng);
        await onCallBack();
        navigation.goBack();
        try {
            await StorageService.setItem('@lng', lng);
            console.log('saved');
        } catch {
            console.log('error in saving data');
        }
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
                    <View style={styles.contentHeader}>
                        <CommonText style={styles.headerTitle}>
                            {t('settings.language')}
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
                        ]}
                        onPress={() => setLanguage('en')}>
                        <CommonImage
                            style={{height: 42, width: 42}}
                            resizeMode="contain"
                            source={require('@assets/images/countries/usa.png')}
                        />
                        <CommonText
                            style={[styles.textItem, {color: theme.text2}]}>
                            {t('language.english')}
                        </CommonText>
                        {currentLang === 'en' && (
                            <Icon
                                name="check"
                                size={20}
                                type={Icons.AntDesign}
                            />
                        )}
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
                        onPress={() => setLanguage('fr')}>
                        <CommonImage
                            style={{height: 42, width: 42}}
                            resizeMode="contain"
                            source={require('@assets/images/countries/france.png')}
                        />
                        <CommonText
                            style={[styles.textItem, {color: theme.text2}]}>
                            {t('language.french')}
                        </CommonText>
                        {currentLang === 'fr' && (
                            <Icon
                                name="check"
                                size={20}
                                type={Icons.AntDesign}
                            />
                        )}
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
                        onPress={() => setLanguage('cn')}>
                        <CommonImage
                            style={{height: 42, width: 42}}
                            resizeMode="contain"
                            source={require('@assets/images/countries/china.png')}
                        />
                        <CommonText
                            style={[styles.textItem, {color: theme.text2}]}>
                            {t('language.chinese')}
                        </CommonText>
                        {currentLang === 'cn' && (
                            <Icon
                                name="check"
                                size={20}
                                type={Icons.AntDesign}
                            />
                        )}
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
                        onPress={() => setLanguage('id')}>
                        <CommonImage
                            style={{height: 42, width: 42}}
                            resizeMode="contain"
                            source={require('@assets/images/countries/indonesia.png')}
                        />
                        <CommonText
                            style={[styles.textItem, {color: theme.text2}]}>
                            {t('language.indonesian')}
                        </CommonText>
                        {currentLang === 'id' && (
                            <Icon
                                name="check"
                                size={20}
                                type={Icons.AntDesign}
                            />
                        )}
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
                        onPress={() => setLanguage('ja')}>
                        <CommonImage
                            style={{height: 42, width: 42}}
                            resizeMode="contain"
                            source={require('@assets/images/countries/japan.png')}
                        />
                        <CommonText
                            style={[styles.textItem, {color: theme.text2}]}>
                            {t('language.japanese')}
                        </CommonText>
                        {currentLang === 'ja' && (
                            <Icon
                                name="check"
                                size={20}
                                type={Icons.AntDesign}
                            />
                        )}
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
                        onPress={() => setLanguage('ko')}>
                        <CommonImage
                            style={{height: 42, width: 42}}
                            resizeMode="contain"
                            source={require('@assets/images/countries/korea.png')}
                        />
                        <CommonText
                            style={[styles.textItem, {color: theme.text2}]}>
                            {t('language.korean')}
                        </CommonText>
                        {currentLang === 'ko' && (
                            <Icon
                                name="check"
                                size={20}
                                type={Icons.AntDesign}
                            />
                        )}
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
                        onPress={() => setLanguage('fi')}>
                        <CommonImage
                            style={{height: 42, width: 42}}
                            resizeMode="contain"
                            source={require('@assets/images/countries/phillipines.png')}
                        />
                        <CommonText
                            style={[styles.textItem, {color: theme.text2}]}>
                            {t('language.filipino')}
                        </CommonText>
                        {currentLang === 'fi' && (
                            <Icon
                                name="check"
                                size={20}
                                type={Icons.AntDesign}
                            />
                        )}
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
                        onPress={() => setLanguage('th')}>
                        <CommonImage
                            style={{height: 42, width: 42}}
                            resizeMode="contain"
                            source={require('@assets/images/countries/thailand.png')}
                        />
                        <CommonText
                            style={[styles.textItem, {color: theme.text2}]}>
                            {t('language.thai')}
                        </CommonText>
                        {currentLang === 'th' && (
                            <Icon
                                name="check"
                                size={20}
                                type={Icons.AntDesign}
                            />
                        )}
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
                        onPress={() => setLanguage('vi')}>
                        <CommonImage
                            style={{height: 42, width: 42}}
                            resizeMode="contain"
                            source={require('@assets/images/countries/vietnam.png')}
                        />
                        <CommonText
                            style={[styles.textItem, {color: theme.text2}]}>
                            {t('language.vietnamese')}
                        </CommonText>
                        {currentLang === 'vi' && (
                            <Icon
                                name="check"
                                size={20}
                                type={Icons.AntDesign}
                            />
                        )}
                    </CommonTouchableOpacity>
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
    item: {
        height: 70,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    textItem: {marginLeft: 10, flex: 3},
    content: {
        flex: 1,
    },
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
});
