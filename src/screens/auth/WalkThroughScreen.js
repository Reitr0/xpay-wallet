import React, {useEffect, useRef, useState} from 'react';
import {
    ImageBackground,
    Linking,
    SafeAreaView,
    StyleSheet,
    View,
    FlatList,
    Modal,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import CommonImage from '@components/commons/CommonImage';
import {useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import {useNavigation} from '@react-navigation/native';
import CommonButton from '@components/commons/CommonButton';
import ActionSheet from 'react-native-actions-sheet';
import {useTranslation} from 'react-i18next';
import Icon, {Icons} from '@components/icons/Icons';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import {applicationProperties} from '@src/application.properties';
import LinearGradient from 'react-native-linear-gradient';
import {StorageService} from '@modules/core/storage/StorageService';

export default function WalkThroughScreen() {
    const actionSheetRef = useRef(null);
    const navigation = useNavigation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {t} = useTranslation();
    const [language, setLanguage] = useState('');
    const [checked, setChecked] = useState(false);
    const [create, setCreate] = useState(true);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        (async () => {
            await getLanguage();
        })();
    }, [getLanguage]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getLanguage = async () => {
        const lang = (await StorageService.getItem('@lng')) || 'en';
        switch (lang) {
            case 'en':
                setLanguage(t('language.english'));
                break;
            case 'fr':
                setLanguage(t('language.french'));
                break;
        }
    };
    return (
        <ImageBackground
            style={styles.container}
            source={require('@assets/images/bg.jpeg')}>
            <SafeAreaView style={[styles.container]}>
                <View style={styles.imageContainer}>
                    <CommonImage
                        source={require('@assets/images/walkthrough/logo.png')}
                        style={styles.logo}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <CommonButton
                        text={t('change.language')}
                        style={[styles.button]}
                        textStyle={{color: theme.text}}
                        onPress={() => {
                            navigation.navigate('LanguageScreen', {
                                onCallBack: getLanguage,
                            });
                        }}
                    />
                    <CommonButton
                        text={t('import_wallet')}
                        style={[styles.button]}
                        textStyle={{color: theme.text}}
                        onPress={() => {
                            setCreate(false);
                            actionSheetRef.current?.show();
                        }}
                    />
                    <CommonButton
                        text={t('create_wallet')}
                        style={[styles.button, {backgroundColor: '#12519b'}]}
                        textStyle={{color: theme.text}}
                        onPress={() => {
                            setCreate(true);
                            actionSheetRef.current?.show();
                        }}
                    />
                </View>
                <ActionSheet
                    ref={actionSheetRef}
                    gestureEnabled={true}
                    onOpen={() => {
                        setChecked(false);
                    }}
                    headerAlwaysVisible
                    containerStyle={[
                        styles.agreementContainer,
                        {backgroundColor: theme.button},
                    ]}>
                    <View
                        style={[
                            styles.agreementContent,
                            {backgroundColor: theme.background},
                        ]}>
                        <View
                            style={[
                                styles.agreementHeader,
                                {backgroundColor: theme.button},
                            ]}>
                            <CommonText style={styles.agreementHeaderText}>
                                {t('legal')}
                            </CommonText>
                        </View>
                        <View style={styles.privacyAndTermsContainer}>
                            <CommonText
                                style={{
                                    color: theme.subText,
                                    textAlign: 'justify',
                                    marginVertical: 10,
                                }}>
                                {t('please_review_the_terms_of_service')}
                            </CommonText>
                            <View
                                style={[
                                    styles.privacyAndTerms,
                                    {backgroundColor: theme.background},
                                ]}>
                                <CommonTouchableOpacity
                                    style={[
                                        styles.privacyPolicy,
                                        {borderBottomColor: theme.border},
                                    ]}
                                    onPress={async () => {
                                        await Linking.openURL(
                                            applicationProperties.endpoints
                                                .privacyPolicy,
                                        );
                                    }}>
                                    <CommonText
                                        style={{
                                            color: theme.subText,
                                            fontSize: 16,
                                        }}>
                                        {t('privacy_policy')}
                                    </CommonText>
                                    <Icon
                                        type={Icons.Feather}
                                        size={18}
                                        name={'chevron-right'}
                                        color={theme.subText}
                                    />
                                </CommonTouchableOpacity>
                                <CommonTouchableOpacity
                                    style={styles.termsOfService}
                                    onPress={async () => {
                                        await Linking.openURL(
                                            applicationProperties.endpoints
                                                .termsOfService,
                                        );
                                    }}>
                                    <CommonText
                                        style={{
                                            color: theme.subText,
                                            fontSize: 16,
                                        }}>
                                        {t('terms_of_service')}
                                    </CommonText>
                                    <Icon
                                        type={Icons.Feather}
                                        size={18}
                                        name={'chevron-right'}
                                        color={theme.subText}
                                    />
                                </CommonTouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.agreementButtonContainer}>
                            <View style={styles.agreementCheckboxContainer}>
                                <CommonTouchableOpacity
                                    onPress={() => {
                                        setChecked(!checked);
                                    }}>
                                    <CommonImage
                                        style={styles.check}
                                        source={
                                            checked
                                                ? require('@assets/images/checkbox/checked.png')
                                                : require('@assets/images/checkbox/unchecked.png')
                                        }
                                    />
                                </CommonTouchableOpacity>
                                <CommonText
                                    style={{
                                        color: theme.button,
                                        marginLeft: 5,
                                    }}>
                                    {t('i_have_read_and_accept')}
                                </CommonText>
                            </View>
                            <CommonButton
                                text={t('continue')}
                                style={{
                                    marginTop: 15,
                                    backgroundColor: checked
                                        ? theme.button
                                        : theme.subButton,
                                }}
                                textStyle={{color: theme.text}}
                                onPress={() => {
                                    if (checked) {
                                        actionSheetRef.current?.hide();
                                        navigation.navigate(
                                            'SetPinCodeScreen',
                                            {
                                                new: create,
                                            },
                                        );
                                    }
                                }}
                            />
                        </View>
                    </View>
                </ActionSheet>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 360,
        width: 360,
    },
    bottomContainer: {
        height: 310,
        width: '100%',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    titleContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '400',
        textAlign: 'center',
    },
    descContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        paddingHorizontal: 20,
    },
    desc: {
        fontSize: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        height: 200,
        width: '100%',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    agreementContainer: {
        height: '95%',
        width: '100%',
    },
    agreementHeader: {
        height: 42,
        width: '100%',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    agreementContent: {
        flex: 1,
        paddingBottom: 10,
    },
    agreementHeaderText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    privacyAndTermsContainer: {
        flex: 1,
        padding: 20,
    },
    privacyAndTerms: {
        width: '100%',
        height: 100,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        padding: 10,
    },
    privacyPolicy: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        borderBottomWidth: 0.2,
    },
    termsOfService: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    agreementButtonContainer: {
        width: '100%',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    agreementCheckboxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    check: {
        width: 32,
        height: 32,
    },
    logo: {
        width: 256,
        height: 256,
        borderRadius: 300,
        backgroundColor: 'transparent',
    },
    button: {
        marginBottom: 10,
        backgroundColor: '#3370cc',
        width: '70%',
        borderRadius: 30,
    },
});
