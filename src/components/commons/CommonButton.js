import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import CommonText from "@components/commons/CommonText";
import { useSelector } from "react-redux";

export default function CommonButton(props) {
  const { theme } = useSelector(state => state.ThemeReducer);
  return (
    <TouchableOpacity
      {...props}
      onPress={() => (props.onPress ? props.onPress() : null)}
      style={[
        styles.buttonContainer,
        { backgroundColor: theme.button },
        props.style,
      ]}>
      <CommonText
        style={[
          styles.text,
          { color: props.disabled ? "gray" : theme.text },
          props.textStyle,
        ]}>
        {props.text}
      </CommonText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});
