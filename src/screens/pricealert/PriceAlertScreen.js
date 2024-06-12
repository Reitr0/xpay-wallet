import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import CommonText from "@components/commons/CommonText";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Icon, { Icons } from "@components/icons/Icons";
import { PriceAlertAction } from "@persistence/pricealert/PriceAlertAction";
import CommonAlert from "@components/commons/CommonAlert";
import CommonBackButton from "@components/commons/CommonBackButton";
import { SwipeListView } from "react-native-swipe-list-view";

export default function PriceAlertScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { priceAlertList } = useSelector(state => state.PriceAlertReducer);
  const { theme } = useSelector(state => state.ThemeReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      dispatch(PriceAlertAction.getPriceAlertList());
    })();
  }, []);
  const renderItem = ({ item }) => {
    return (
      <View style={[
        styles.item,
        { borderBottomColor: theme.border, backgroundColor: theme.background },
      ]}>
        <View style={styles.itemContent}>
          <CommonText style={[styles.itemName, { color: theme.text2 }]} numberOfLines={1}>
            {item.coin.symbol}
          </CommonText>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.gapBackground, { backgroundColor: theme.background4 }]}></View>
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
          <CommonText style={styles.headerTitle}>{t("price_alert")}</CommonText>
        </View>
        <CommonTouchableOpacity
          style={styles.rightHeader}
          onPress={() => {
            navigation.navigate("AddPriceAlertScreen");
          }}>
          <Icon type={Icons.Feather} size={18} name={"plus"} color={theme.text} />
        </CommonTouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <SwipeListView
          onRowOpen={(rowKey, rowMap) => {
            setTimeout(() => {
              rowMap[rowKey].closeRow();
            }, 2000);
          }}
          data={priceAlertList}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          renderHiddenItem={(data, rowMap) => {
            return (
              <View style={styles.deleteItem}>
                <CommonTouchableOpacity style={styles.deleteButton} onPress={() => {
                  dispatch(PriceAlertAction.removePriceAlert(data.item)).then(
                    ({ success }) => {
                      if (!success) {
                        CommonAlert.show({
                          title: t("alert.error"),
                          message: t("price_alert_cannot_delete"),
                          type: "error",
                        });
                        return;
                      }
                      CommonAlert.show({
                        title: t("alert.success"),
                        message: t("price_alert_delete_success"),
                        type: "info",
                      });
                    },
                  );
                }}>
                  <Icon
                    type={Icons.AntDesign}
                    size={18}
                    name={"delete"}
                    color={theme.text2}
                  />
                </CommonTouchableOpacity>
              </View>
            );
          }}
          rightOpenValue={-75}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
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
  gradient: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  customBtn: {
    borderWidth: 0,
  },
  item: {
    height: 70,
    width: "100%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
  },
  deleteItem: {
    height: 70,
    width: "100%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  img: {
    width: 20,
    height: 20,
    marginRight: 0,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    flex: 5,
    marginLeft: 10,
    fontSize: 17,
  },
  itemSymbol: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    textAlign: "right",
  },
  searchContainer: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  search: {
    flex: 4,
    fontSize: 16,
    borderWidth: 1,
    backgroundColor: "red",
    paddingHorizontal: 10,
    height: 45,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  close: {
    flex: 1.2,
    height: 43,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
    borderTopEndRadius: 5,
    borderBottomEndRadius: 5,
  },
  choose_network: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 25,
  },
  chooseItem: {
    height: 40,
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 5,
    justifyContent: "center",
    borderBottomWidth: 0.5,
  },
  chooseItemText: {
    fontWeight: "bold",
  },
  deleteButton: {
    width: 50,
    height: "100%",
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
