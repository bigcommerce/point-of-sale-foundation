import { createContext, useContext } from "react";
import { ErrorResponse } from "@/shared/types/response";

export type StoreAddress = {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state_or_province: string;
  postal_code: string;
  country_code: string;
  country: {
    label: string;
    value: string;
  };
};

export type StoreSettings = {
  id: string;
  name: string;
  value: string;
};

export type GetSettingsFunction = () => Promise<StoreSettings[] | ErrorResponse>;
//export type GetStoreEmailFunction = () => Promise<string | null>;
export type GetStoreAddressFunction = () => Promise<StoreAddress | null>;
export type SaveStoreAddressFunction = (storeAddress: StoreAddress) => Promise<StoreAddress>;
export type SaveStoreEmailFunction = (storeEmail: string) => Promise<string>;

export type SettingsState = {
  storeEmail: string;
  storeAddress: StoreAddress;
};

export type SettingsActions = {
  getSettings: GetSettingsFunction;
  //getStoreEmail: GetStoreEmailFunction;
  getStoreAddress: GetStoreAddressFunction;
  saveStoreAddress: SaveStoreAddressFunction;
};

export type SettingsContextProps = {
  state: SettingsState;
  actions: SettingsActions;
};

export const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

SettingsContext.displayName = "SettingsContext";

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  return context;
}
