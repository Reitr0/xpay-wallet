import _ from "lodash";
import { StorageService } from "@modules/core/storage/StorageService";
import CommonAPI from "@modules/api/CommonAPI";
import OneSignal from "react-native-onesignal";


async function getPriceAlertList() {
  const priceAlertList = await StorageService.getItem(
    "PriceAlert",
  );
  return priceAlertList || [];
}

async function getPriceAlertStatus() {
  return await StorageService.getItem(
    "PriceAlertStatus",
  );
}

async function togglePriceAlertStatus(enabled) {
  const { data } = await CommonAPI.post("/private/device/enabled", {
    device: {
      deviceId: (await OneSignal.getDeviceState()).userId,
      enabled: enabled,
    },
  });
  if (data.success) {
    await StorageService.setItem(
      "PriceAlertStatus",
      enabled,
    );
  }
  return enabled;
}

async function addPriceAlert(params) {
  const priceAlertList =
    (await StorageService.getItem("PriceAlert")) || [];
  const index = _.findIndex(priceAlertList, function(priceAlert) {
    return priceAlert.coin.symbol === params.symbol;
  });

  if (index === -1) {
    const { data } = await CommonAPI.post("/private/device/save", {
      coin: { ...params },
      device: {
        deviceId: (await OneSignal.getDeviceState()).userId,
        symbol: params.symbol,
      },
    });
    if (data.success) {
      priceAlertList.push(data.data);
      await StorageService.setItem(
        "PriceAlert",
        priceAlertList,
      );
    }
    return {
      success: data.success,
      data: priceAlertList,
    };
  }
  return {
    success: false,
    data: priceAlertList,
  };
}

async function removePriceAlert(params) {
  const priceAlertList =
    (await StorageService.getItem("PriceAlert")) || [];
  const { data } = await CommonAPI.post("/private/device/delete", params);
  if (data.success) {
    _.remove(priceAlertList, function(priceAlert) {
      return priceAlert.coin.symbol === params.coin.symbol;
    });
    await StorageService.setItem(
      "PriceAlert",
      priceAlertList,
    );
  }
  return {
    success: data.success,
    data: priceAlertList,
  };
}

export const PriceAlertService = {
  getPriceAlertList,
  addPriceAlert,
  removePriceAlert,
  togglePriceAlertStatus,
  getPriceAlertStatus,
};
