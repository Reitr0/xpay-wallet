import {ThemeService} from './ThemeService';
import {changeDefaultSuccess, changeSuccess, listSuccess} from './ThemeReducer';

export const ThemeAction = {set, list, setDefault, getDefault};

function set(t) {
  return async dispatch => {
    const theme = t || (await ThemeService.get());
    await ThemeService.set(theme);
    dispatch(changeSuccess(theme));
  };
}

function list() {
  return async dispatch => {
    dispatch(listSuccess(await ThemeService.list()));
  };
}

function setDefault(t) {
  return async dispatch => {
    await ThemeService.setDefault(t);
    dispatch(changeDefaultSuccess(t));
  };
}

function getDefault() {
  return async dispatch => {
    dispatch(changeDefaultSuccess(await ThemeService.getDefault()));
  };
}
