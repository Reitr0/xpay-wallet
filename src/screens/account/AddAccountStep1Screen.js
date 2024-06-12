import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonBackButton from "@components/commons/CommonBackButton";
import Icon, { Icons } from "@components/icons/Icons";
import CommonFlatList from "@components/commons/CommonFlatList";
import CommonImage from "@components/commons/CommonImage";
import { WALLET_LIST } from "@persistence/wallet/WalletConstant";
import { useTranslation } from "react-i18next";

export default function AddAccountStep1Screen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const renderItem = ({ item }) => {
    return (
      <CommonTouchableOpacity
        onPress={() => {
          navigation.navigate("AddAccountStep2Screen", {
            account: item,
          });
        }}
        style={[
          styles.item,
          { borderBottomColor: theme.border, borderBottomWidth: 0.5 },
        ]}
        key={item.chain}>
        <View style={styles.leftItemContainer}>
          <View style={[styles.iconContainer]}>
            <CommonImage
              source={{ uri: item.image }}
              style={styles.iconContainer}
            />
          </View>
          <CommonText style={{ color: theme.text2 }}>{item.name}</CommonText>
        </View>
        <CommonTouchableOpacity
          style={styles.leftItemContainer}
          onPress={() => {
          }}>
          <Icon
            type={Icons.Feather}
            size={18}
            name={"chevron-right"}
          />
        </CommonTouchableOpacity>
      </CommonTouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { backgroundColor: theme.background2 }]}>
          <View style={styles.leftHeader}>
            <CommonBackButton
              color={theme.text}
              onPress={async () => {
                navigation.goBack();
              }}
            />
          </View>
          <View style={styles.contentHeader}>
            <CommonText style={styles.headerTitle}>{t("setting.select")}</CommonText>
          </View>
        </View>
        <View style={styles.section}>
          <CommonFlatList
            data={WALLET_LIST}
            keyExtractor={item => item.chain}
            renderItem={renderItem}
          />
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
  leftHeader: {
    width: 30,
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  contentHeader: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
  },
  rightHeader: {
    width: 30,
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  section: {
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  item: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  leftItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rightItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
});
