import { LocalStorageTypes } from "../../ts/globalTs";

export const getLocalStorageItem = (key: LocalStorageTypes) => {
  let item: any = localStorage.getItem(key);
  if (!item) {
    item = {};
  } else {
    item = JSON.parse(item);
  }

  return item;
};
export const setLocalStorageItem = (key: LocalStorageTypes, item: any) => {
  localStorage.setItem(key, JSON.stringify(item));
};
