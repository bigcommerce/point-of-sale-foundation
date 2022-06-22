import { StoreAddressForm } from "@/frontend/components/modules/Settings/StoreAddressForm";
import { useSettingsContext } from "@/frontend/providers/SettingsProvider";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";
import { useEffect } from "react";

export default function SettingsView() {
  const { state, actions } = useSettingsContext();

  useEffect(() => {
    (async () => {
      await actions.getStoreAddress();
    })();
  }, []);

  return (
    <>
      <div className="flex justify-between w-full bg-gray-50 shadow px-5 py-4">
        <h2 className="text-xl">Settings</h2>
      </div>
      <div className="bg-white w-full mt-1">
        <div className="flex flex-row">
          <div className="flex flex-col w-3/4 px-10 py-7 bg-white">
            <div className="w-3/4">
              <h3 className="block mb-4">Store Address</h3>
              <StoreAddressForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
