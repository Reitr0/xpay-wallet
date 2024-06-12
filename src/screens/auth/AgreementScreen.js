import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CommonImage from "@components/commons/CommonImage";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonButton from "@components/commons/CommonButton";

export default function AgreementScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const [agreement1, setAgreement1] = useState(false);
  const [agreement2, setAgreement2] = useState(false);
  const [agreement3, setAgreement3] = useState(false);
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <CommonBackButton
              onPress={() => {
                navigation.pop(2);
              }}
            />
          </View>
        </View>
        <View
          style={[
            styles.content,
          ]}>
          <View style={styles.titleContainer}>
            <CommonText style={[styles.titleText, { color: theme.text2 }]}>
              {t("backup.back_up_your_wallet_now")}
            </CommonText>
            <CommonText style={[styles.descText, { color: theme.subText }]}>
              {t("backup.in_the_next_step")}
            </CommonText>
          </View>
          <View style={styles.imageContainer}>
            <CommonImage
              source={require("@assets/images/walkthrough/04.png")}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View style={styles.agreementContainer}>
            <View style={[styles.agreementItem, { borderColor: theme.border }]}>
              <View style={{ flex: 1 }}>
                <CommonText
                  style={[styles.agreementText, { color: theme.subText }]}>{t("backup.if_i_lose")}</CommonText>
              </View>
              <CommonTouchableOpacity
                onPress={() => {
                  setAgreement1(!agreement1);
                }}>
                <CommonImage
                  style={styles.check}
                  source={
                    agreement1
                      ? require("@assets/images/checkbox/checked.png")
                      : require("@assets/images/checkbox/unchecked.png")
                  }
                />
              </CommonTouchableOpacity>
            </View>
            <View style={[styles.agreementItem, { borderColor: theme.border }]}>
              <View style={{ flex: 1 }}>
                <CommonText
                  style={[styles.agreementText, { color: theme.subText }]}>{t("backup.if_i_expose")}</CommonText>
              </View>
              <CommonTouchableOpacity
                onPress={() => {
                  setAgreement2(!agreement2);
                }}>
                <CommonImage
                  style={styles.check}
                  source={
                    agreement2
                      ? require("@assets/images/checkbox/checked.png")
                      : require("@assets/images/checkbox/unchecked.png")
                  }
                />
              </CommonTouchableOpacity>
            </View>
            <View style={[styles.agreementItem, { borderColor: theme.border }]}>
              <View style={{ flex: 1 }}>
                <CommonText
                  style={[styles.agreementText, { color: theme.subText }]}>{t("backup.never_ask")}</CommonText>
              </View>
              <CommonTouchableOpacity
                onPress={() => {
                  setAgreement3(!agreement3);
                }}>
                <CommonImage
                  style={styles.check}
                  source={
                    agreement3
                      ? require("@assets/images/checkbox/checked.png")
                      : require("@assets/images/checkbox/unchecked.png")
                  }
                />
              </CommonTouchableOpacity>
            </View>
            <CommonButton
              text={t("continue")}
              style={{
                marginVertical: 10,
                backgroundColor: agreement1 && agreement2 && agreement3 ? theme.button : theme.subButton,
              }}
              textStyle={{ color: theme.text }}
              onPress={() => {
                if (agreement1 && agreement2 && agreement3) {
                  navigation.navigate("MnemonicScreen");
                }
              }}
            />
          </View>
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
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    width: "100%",
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descText: {
    marginVertical: 10,
    textAlign: "center",
  },
  imageContainer: {
    flex: 1,
  },
  agreementContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  agreementItem: {
    width: "100%",
    height: 70,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  agreementText: {
    fontSize: 15,
  },
  check: {
    width: 32,
    height: 32,
  },
});
