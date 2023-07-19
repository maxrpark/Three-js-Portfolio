import { LocalStorageTypes } from "../../ts/globalTs";

export const getLocalStorageItem = (key: LocalStorageTypes) => {
  let item: any = localStorage.getItem(key);
  if (!item) {
    item = {};
  } else {
    item = JSON.parse(item as string);
  }

  return item;
};
export const setLocalStorageItem = (key: LocalStorageTypes, item: string) => {
  localStorage.setItem(key, JSON.stringify(item));
};
