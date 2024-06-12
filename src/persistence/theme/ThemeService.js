import React from "react";
import { applicationProperties } from "@src/application.properties";
import { StorageService } from "@modules/core/storage/StorageService";

export const ThemeService = {
  set,
  get,
  list,
  setDefault,
  getDefault,
};

async function get() {
  return applicationProperties.defaultTheme.code;
}

async function set(t) {
  return await StorageService.setItem("theme", t);
}

async function list() {
  return applicationProperties.themes;
}

async function setDefault(t) {
  await StorageService.setItem("defaultTheme", t);
}

async function getDefault() {
  return (
    (await StorageService.getItem("defaultTheme")) ||
    applicationProperties.defaultTheme
  );
}
