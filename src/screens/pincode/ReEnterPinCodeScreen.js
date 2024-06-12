import React, { useEffect } from "react";
import { PinCode } from "@components/PinCode";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CommonBackButton from "@components/commons/CommonBackButton";

const ReEnterPinCodeScreen = ({ route }) => {
  const params = route.params;
  const navigation = useNavigation();
  useEffect(() => {
  }, []);

  const success = async () => {
    navigation.goBack();
    if (params) {
      params.onCallBack();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        {params && (
          <CommonBackButton
            onPress={async () => {
              navigation.goBack();
            }}
          />
        )}
      </View>
      <PinCode onSuccess={() => success()} status={"enter"} />
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
});
export default ReEnterPinCodeScreen;
