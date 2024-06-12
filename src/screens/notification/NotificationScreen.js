import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import CommonText from "@components/commons/CommonText";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NotifyAction } from "@persistence/notify/NotifyAction";
import CommonBackButton from "@components/commons/CommonBackButton";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon, { Icons } from "@components/icons/Icons";

export default function NotificationScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const { notifies } = useSelector(state => state.NotifyReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
    })();
  }, []);
  const renderItem = ({ item }) => {
    return (
      <CommonTouchableOpacity
        onPress={async () => {
          dispatch(NotifyAction.updateNotify(item));
          if (item.network.includes("MATIC")) {

          } else if (item.network.includes("ETH")) {

          }
        }}
        style={[
          styles.item,
          { borderBottomColor: theme.border, backgroundColor: theme.background },
        ]}>
        <View style={styles.itemContent}>
          <CommonText
            style={[styles.text, { color: theme.text2 }]}
            numberOfLines={1}
            ellipsizeMode="middle">
            From: {item.fromAddress}
          </CommonText>
          <CommonText
            style={[styles.text, { color: theme.text2 }]}
            numberOfLines={1}
            ellipsizeMode="middle">
            To: {item.toAddress}
          </CommonText>
          <CommonText numberOfLines={1} style={[styles.text, { color: theme.text2 }]}>
            Value: {item.value} {item.asset}
          </CommonText>
        </View>
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
            <CommonText style={styles.headerTitle}>{t("notification")}</CommonText>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <SwipeListView
            onRowOpen={(rowKey, rowMap) => {
              setTimeout(() => {
                rowMap[rowKey].closeRow();
              }, 2000);
            }}
            data={notifies}
            renderItem={renderItem}
            renderHiddenItem={(data, rowMap) => {
              return (
                <View style={styles.deleteItem}>
                  <CommonTouchableOpacity style={styles.deleteButton} onPress={() => {
                    dispatch(NotifyAction.removeNotify(data.item));
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
    </View>
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
  container: {
    flex: 1,
  },
  customBtn: {
    borderWidth: 0,
  },
  item: {
    height: 70,
    width: "100%",
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
    justifyContent: "center",
    height: 80,
    borderBottomWidth: 0.5,
  },
  itemName: {
    flex: 5,
    //color: Colors.foreground,
    marginLeft: 10,
    fontSize: 17,
  },
  itemSymbol: {
    flex: 1,
    //color: Colors.lighter,
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
});
