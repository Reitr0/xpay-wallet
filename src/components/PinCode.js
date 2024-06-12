import PINCode from '@haskkor/react-native-pincode';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

export function PinCode(props) {
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {appLock} = useSelector(state => state.AppLockReducer);
    return (
        <PINCode
            onFail={props.onFail}
            finishProcess={props.onSuccess}
            status={props.status}
            onClickButtonLockedPage={() => {
                if (props.onClickButtonLockedPage) {
                    props.onClickButtonLockedPage();
                }
            }}
            passwordLength={6} // Set PIN length to 6 digits
            touchIDDisabled={!appLock.biometryLock}
            colorCircleButtons={theme.pinButtonColor}
            colorPassword={theme.button}
            colorPasswordEmpty={theme.subText}
            numbersButtonOverlayColor={theme.numbersButtonOverlayColor}
            stylePinCodeColorSubtitle={theme.subText}
            stylePinCodeColorTitle={theme.text2}
            stylePinCodeDeleteButtonthemeShowUnderlay={theme.subText}
            stylePinCodeDeleteButtonColorHideUnderlay={theme.subText}
            stylePinCodeButtonNumber={theme.text2}
            stylePinCodeTextButtonCircle={styles.text}
            stylePinCodeTextSubtitle={styles.text}
            stylePinCodeTextTitle={styles.text}
            styleLockScreenButton={{transform: [{scale: 0}]}}
            buttonDeleteText={t('pincode.buttonDeleteText')}
            subtitleChoose={t('pincode.subtitleChoose')}
            subtitleError={t('pincode.subtitleError')}
            textButtonLockedPage={t('pincode.textButtonLockedPage')}
            textCancelButtonTouchID={t('pincode.textCancelButtonTouchID')}
            textDescriptionLockedPage={t('pincode.textDescriptionLockedPage')}
            textSubDescriptionLockedPage={t(
                'pincode.textSubDescriptionLockedPage',
            )}
            textTitleLockedPage={t('pincode.textTitleLockedPage')}
            titleAttemptFailed={t('pincode.titleAttemptFailed')}
            titleChoose={t('pincode.titleChoose')}
            titleConfirm={t('pincode.titleConfirm')}
            titleConfirmFailed={t('pincode.titleConfirmFailed')}
            titleEnter={t('pincode.titleEnter')}
            titleValidationFailed={t('pincode.titleValidationFailed')}
            touchIDSentence={t('pincode.touchIDSentence')}
            touchIDTitle={t('pincode.touchIDTitle')}
        />
    );
}

const styles = StyleSheet.create({
    pinCode: {
        fontWeight: '300',
    },
    text: {
        fontWeight: '500',
    },
});
