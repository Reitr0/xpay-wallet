import React, { useState } from "react";
import FastImage from "react-native-fast-image";
import { View } from "react-native";
import Lottie from "lottie-react-native";
import { SvgUri } from "react-native-svg";

export default function NftImage({ source, format, ...rest }) {
  const [loading, setLoading] = useState(true);
  if (source && source.includes("ipfs://")) {
    source = source.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  if (format === "SVG") {
    return (
      <SvgUri
        width="100%"
        height="100%"
        uri={source}
      />
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <FastImage
        resizeMode={"contain"}
        source={{
          uri: source,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.web,
        }}
        {...rest}
        onLoadStart={() => {
          setLoading(true);
        }}
        onLoadEnd={() => {
          setLoading(false);
        }}
        onError={({ nativeEvent: { error } }) => {
          console.log(error);
        }}
      />
      {loading === true && (
        <>
          <View
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.8)",
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Lottie
              source={require("@assets/json/img_loading.json")}
              autoPlay
              loop
              style={{ width: 64, height: 64 }}
            />
          </View>
        </>
      )}
    </View>
  );
}
