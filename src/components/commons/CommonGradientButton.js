import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import CommonText from "@components/commons/CommonText";
import { useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";

export default function CommonGradientButton(props) {
    const {theme} = useSelector(state => state.ThemeReducer);
    return (
        <TouchableOpacity
            {...props}
            onPress={() => (props.onPress ? props.onPress() : null)}
            style={[styles.buttonContainer, props.style]}>
            <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={[
                  theme.bg3,
                    theme.bg1,
                    theme.bg2,

                ]}
                style={styles.buttonContainer}>
                <CommonText
                    style={[
                        styles.text,
                        {color: props.disabled ? 'gray' : theme.buttonText1},
                        props.textStyle,
                    ]}>
                    {props.text}
                </CommonText>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },
});
