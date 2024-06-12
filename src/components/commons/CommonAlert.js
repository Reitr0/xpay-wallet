import {StyleSheet, View} from 'react-native';
import React from 'react';
import CommonImage from '@components/commons/CommonImage';
import CommonButton from '@components/commons/CommonButton';
import {closeAlert, showAlert} from 'react-native-customisable-alert';
import CommonText from '@components/commons/CommonText';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

function Alert({title, message, icon, confirm, onConfirm}) {
    const {theme} = useSelector(state => state.ThemeReducer);
    const {t} = useTranslation();
    return (
        <View style={[styles.containerAlert]}>
            <View
                style={[
                    styles.contentAlert,
                    {backgroundColor: theme.background},
                ]}>
                <CommonText style={{...styles.title, color: theme.text2}}>
                    {title}
                </CommonText>
                <View style={styles.img_container}>
                    <CommonImage source={icon} style={styles.img} />
                </View>
                <CommonText style={{...styles.text, color: theme.text2}}>
                    {message}
                </CommonText>
                <View style={styles.actions}>
                    {confirm && (
                        <CommonButton
                            style={{backgroundColor: theme.text3}}
                            text={t('alert.cancel')}
                            onPress={() => {
                                closeAlert();
                            }}
                        />
                    )}
                    <CommonButton
                        style={{marginTop: 5}}
                        text={t('alert.ok')}
                        onPress={() => {
                            if (confirm) {
                                onConfirm();
                                closeAlert();
                                return;
                            }
                            closeAlert();
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contentAlert: {
        width: '90%',
        borderRadius: 10,
        padding: 15,
        paddingBottom: 5,
    },
    img_container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: 48,
        height: 48,
    },
    title: {
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 16,
    },
    text: {
        textAlign: 'center',
        marginVertical: 20,
    },
    actions: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap-reverse',
    },
    btn: {
        marginBottom: 10,
        minWidth: 120,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        padding: 10,
        color: 'white',
    },
    containerAlert: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
});

const show = ({title, message, type, confirm, onConfirm}) => {
    let icon = require('@assets/images/alert/check.png');
    switch (type) {
        case 'error':
            icon = require('@assets/images/alert/error.png');
            break;
        case 'warning':
            icon = require('@assets/images/alert/warning.png');
            break;
    }
    showAlert({
        alertType: 'custom',
        customAlert: (
            <Alert
                message={message}
                title={title}
                icon={icon}
                confirm={confirm}
                onConfirm={onConfirm}
            />
        ),
    });
};
const CommonAlert = {
    show,
};
export default CommonAlert;
