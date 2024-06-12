import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { PinCode } from "@components/PinCode";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";

const SetPinCodeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  useEffect(() => {
  }, []);

  const success = async () => {
    const goTo = route.params.new ? "AgreementScreen" : "ImportScreen";
    navigation.navigate(goTo);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <CommonBackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
      <PinCode
        onFail={() => {
          console.log("Fail to auth");
        }}
        onSuccess={() => success()}
        onClickButtonLockedPage={() => console.log("Quit")}
        status={"choose"}
      />
      <View style={styles.securityTextContainer}>
        <CommonText style={[styles.securityText, { color: theme.text2 }]}>{t("pincode.pass_code_will_add")}</CommonText>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    height: 48,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gradient: {
    width: "100%",
    height: "110%",
  },
  securityTextContainer: {
    width: "100%",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  securityText: {
    fontSize: 13,
    textAlign: "center",
  },
});
export default SetPinCodeScreen;
