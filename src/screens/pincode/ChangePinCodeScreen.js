import React from 'react';
import {PinCode} from '@components/PinCode';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet, View} from 'react-native';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import Icon, {Icons} from '@components/icons/Icons';
import {useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {useTranslation} from 'react-i18next';
import CommonText from '@components/commons/CommonText';

const ChangePinCodeScreen = ({navigation}) => {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    return (
        <View style={{flex: 1}}>
            <LinearGradient
                colors={[theme.gradientPrimary, theme.gradientSecondary]}
                style={styles.gradient}>
                <View style={styles.header}>
                    <CommonTouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Icon type={Icons.Feather} name={'arrow-left'} />
                    </CommonTouchableOpacity>
                    <CommonText>{t('settings.new_pincode')}</CommonText>
                    <View style={{width: 30}}></View>
                </View>
                <PinCode
                    onSuccess={() => {
                        showMessage({
                            message: t('settings.change_pincode_success'),
                            type: 'success',
                        });
                        navigation.pop(2);
                    }}
                    status={'choose'}
                />
            </LinearGradient>
        </View>
    );
};
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
        height: '110%',
    },
});
export default ChangePinCodeScreen;
