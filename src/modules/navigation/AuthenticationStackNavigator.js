import React, { useEffect } from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "@screens/auth/SplashScreen";
import WalkThroughScreen from "@screens/auth/WalkThroughScreen";
import SetPinCodeScreen from "@screens/pincode/SetPinCodeScreen";
import AgreementScreen from "@screens/auth/AgreementScreen";
import MnemonicScreen from "@screens/auth/MnemonicScreen";
import ConfirmMnemonicScreen from "@screens/auth/ConfirmMnemonicScreen";
import ImportScreen from "@screens/auth/ImportScreen";
import EnterPinCodeScreen from "@screens/pincode/EnterPinCodeScreen";
import LanguageScreen from "@screens/setting/LanguageScreen";

const Stack = createStackNavigator();

function AuthenticationStackNavigator() {
  useEffect(() => {
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="WalkThroughScreen" component={WalkThroughScreen} />
      <Stack.Screen name="SetPinCodeScreen" component={SetPinCodeScreen} />
      <Stack.Screen name="AgreementScreen" component={AgreementScreen} />
      <Stack.Screen name="MnemonicScreen" component={MnemonicScreen} />
      <Stack.Screen name="ConfirmMnemonicScreen" component={ConfirmMnemonicScreen} />
      <Stack.Screen name="ImportScreen" component={ImportScreen} />
      <Stack.Screen name="EnterPinCodeScreen" component={EnterPinCodeScreen} />
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} />

    </Stack.Navigator>
  );
}

export default AuthenticationStackNavigator;
