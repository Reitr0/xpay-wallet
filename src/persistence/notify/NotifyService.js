import React from "react";
import _ from "lodash";
import CommonAPI from "@modules/api/CommonAPI";
import OneSignal from "react-native-onesignal";
import { StorageService } from "@modules/core/storage/StorageService";

export const NotifyService = {
  addDevice,
  addNotify,
  getNotifies,
  updateNotify,
  toggleNotifyStatus,
  getNotifyStatus,
  removeNotify,
};

async function addDevice(walletAddress) {
  const params = {
    walletAddress: walletAddress.toLowerCase(),
    deviceId: (await OneSignal.getDeviceState()).userId,
  };
  const { data } = CommonAPI.post("private/notify/device/add", params);
}

async function getNotifyStatus() {
  return await StorageService.getItem("NotifyStatus") || true;
}

async function addNotify(params) {
  let notifies = (await StorageService.getItem("notifies")) || [];
  let index = _.findIndex(notifies, { hash: params.hash });
  if (index === -1) {
    notifies.push({ ...params, unread: true });
  }
  const unread = _.reduce(
    notifies,
    function(sum, item) {
      return sum + (item.unread ? 1 : 0);
    },
    0,
  );
  await StorageService.setItem("notifies", notifies);
  return {
    success: true,
    data: {
      unread: unread,
      notifies: notifies,
    },
  };
}

async function getNotifies() {
  let notifies = (await StorageService.getItem("notifies")) || [];
  const unread = _.reduce(
    notifies,
    function(sum, item) {
      return sum + (item.unread ? 1 : 0);
    },
    0,
  );
  return {
    success: true,
    data: {
      unread: unread,
      notifies: notifies,
    },
  };
}

async function updateNotify(params) {
  let notifies = (await StorageService.getItem("notifies")) || [];
  let index = _.findIndex(notifies, { hash: params.hash });
  notifies.splice(index, 1, { ...params, unread: false });
  const unread = _.reduce(
    notifies,
    function(sum, item) {
      return sum + (item.unread ? 1 : 0);
    },
    0,
  );
  await StorageService.setItem("notifies", notifies);
  return {
    success: true,
    data: {
      unread: unread,
      notifies: notifies,
    },
  };
}

async function removeNotify(params) {
  let notifies = (await StorageService.getItem("notifies")) || [];
  _.remove(notifies, { hash: params.hash });
  const unread = _.reduce(
    notifies,
    function(sum, item) {
      return sum + (item.unread ? 1 : 0);
    },
    0,
  );
  await StorageService.setItem("notifies", notifies);
  return {
    success: true,
    data: {
      unread: unread,
      notifies: notifies,
    },
  };
}

async function toggleNotifyStatus(enabled) {
  const { data } = await CommonAPI.post("/notify/device/enable", {
    notifyDevice: {
      deviceId: (await OneSignal.getDeviceState()).userId,
      enabled: enabled,
    },
  });
  if (data.success) {
    await StorageService.setItem(
      "NotifyStatus",
      enabled,
    );
  }
  return enabled;
}
