import { NotifyService } from "@persistence/notify/NotifyService";
import {
    addNotifySuccess,
    getNotifiesSuccess,
    getNotifyStatusSuccess,
    removeNotifySuccess,
    updateNotifySuccess,
} from "@persistence/notify/NotifyReducer";

export const NotifyAction = {
  addNotify,
  getNotifies,
  updateNotify,
  toggleNotifyStatus,
  getNotifyStatus,
  removeNotify,
};

function getNotifyStatus() {
  return async dispatch => {
    const enabled = await NotifyService.getNotifyStatus();
    dispatch(getNotifyStatusSuccess(enabled));
  };
}

function addNotify(params) {
  return async dispatch => {
    const { success, data } = await NotifyService.addNotify(params);
    if (success) {
      dispatch(addNotifySuccess(data));
    }
    return { success, data };
  };
}

function getNotifies() {
  return async dispatch => {
    const { success, data } = await NotifyService.getNotifies();
    if (success) {
      dispatch(getNotifiesSuccess(data));
    }
    return { success, data };
  };
}

function updateNotify(params) {
  return async dispatch => {
    const { success, data } = await NotifyService.updateNotify(params);
    if (success) {
      dispatch(updateNotifySuccess(data));
    }
    return { success, data };
  };
}

function removeNotify(params) {
  return async dispatch => {
    const { success, data } = await NotifyService.removeNotify(params);
    if (success) {
      dispatch(removeNotifySuccess(data));
    }
    return { success, data };
  };
}

function toggleNotifyStatus(status) {
  return async dispatch => {
    const enabled = await NotifyService.toggleNotifyStatus(status);
    dispatch(getNotifyStatusSuccess(enabled));
  };
}
