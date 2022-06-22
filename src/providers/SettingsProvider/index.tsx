import React, { useState } from "react";
import { UserError, SessionExpiredError, ForbiddenError } from "@/shared/methods/bigcommerce";
import {
  GetSettingsFunction,
  GetStoreAddressFunction,
  SaveStoreAddressFunction,
  SettingsContext,
  StoreAddress
} from "./context";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";
export * from "./context";

const SettingsProvider = (props: { access_token: string; children: React.ReactElement | any }) => {
  const { access_token, children } = props;
  const [storeEmail, setStoreEmail] = useState(null);
  const [storeAddress, setStoreAddress] = useState(null);
  const [settings, setSettings] = useState(null);
  const apiUri = "/api/settings";

  const handleResponse = response => {
    if (!response.ok) {
      if (response.status === 400) {
        return response.json().then(data => {
          throw new UserError(response.statusText, data);
        });
      } else if (response.status === 401) {
        throw new SessionExpiredError("JWT expired");
      } else if (response.status === 403) {
        throw new ForbiddenError("Forbidden");
      }
    }
    return response.json();
  };

  /**
   * Get store settings
   * @returns StoreSettings
   */
  const getSettings: GetSettingsFunction = async () => {
    const response = await fetch(apiUri, {
      headers: {
        method: "GET",
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      }
    });
    const data = await handleResponse(response);
    return data;
  };

  /**
   * Get store address
   * @returns StoreAddress  The store address
   */
  const getStoreAddress: GetStoreAddressFunction = async () => {
    // Get setting from database
    const storeSettings = await getSettings();

    if (Array.isArray(storeSettings)) {
      const storeAddressSetting = storeSettings.find(setting => {
        if (setting.name === "store_address") {
          return setting;
        }
      });

      if (!isNullOrUndefined(storeAddressSetting)) {
        const storeAddress: StoreAddress = JSON.parse(storeAddressSetting.value);
        setStoreAddress(storeAddress);
        return storeAddress;
      }

      return null;
    }
  };

  /**
   * Save store address
   * @param store_address StoreAddress  Required. The store address
   * @returns StoreAddress  The store address
   */
  const saveStoreAddress: SaveStoreAddressFunction = async storeAddress => {
    setStoreAddress(storeAddress);

    return fetch(apiUri, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(storeAddress)
    }).then(async response => {
      const res = await handleResponse(response);
      return res as Promise<StoreAddress>;
    });
  };

  const value = {
    state: {
      storeEmail,
      storeAddress,
      settings
    },
    actions: {
      getSettings,
      getStoreAddress,
      saveStoreAddress
    }
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
export default SettingsProvider;
