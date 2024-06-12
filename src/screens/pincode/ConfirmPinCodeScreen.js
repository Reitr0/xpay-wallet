import React from 'react';
import {PinCode} from '@components/PinCode';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet, View} from 'react-native';
import CommonTouchableOpacity from '@components/commons/CommonTouchableOpacity';
import Icon, {Icons} from '@components/icons/Icons';
import {useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import {useTranslation} from 'react-i18next';

const ConfirmPinCodeScreen = ({navigation}) => {
    const {theme} = useSelector(state => state.ThemeReducer);
    const {t} = useTranslation();
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
                    <CommonText>
                        {t('settings.confirm_your_pincode')}
                    </CommonText>
                    <View style={{width: 30}}></View>
                </View>
                <PinCode
                    onSuccess={() => {
                        navigation.navigate('ChangePinCodeScreen');
                    }}
                    status={'enter'}
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
export default ConfirmPinCodeScreen;
