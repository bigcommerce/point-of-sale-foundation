import React, { useEffect } from "react";
import { useSettingsContext } from "@/frontend/providers/SettingsProvider";
import { Formiz, useForm } from "@formiz/core";
import { FormizInputText } from "@/frontend/components/base/Formiz/FormizInputText";
import { FormizButton } from "@/frontend/components/base/Formiz/FormizButton";
import { FormizCountrySelect } from "@/frontend/components/base/Formiz/FormizCountrySelect";

export const StoreAddressForm = (): JSX.Element => {
  const storeAddressForm = useForm();
  const { state, actions } = useSettingsContext();

  useEffect(() => {
    storeAddressForm.setFieldsValues(state.storeAddress);
  }, [state.storeAddress]);

  const handleSubmit = async storeAddress => {
    delete storeAddress["save_settings_btn"];
    storeAddress.country_code = storeAddress.country.value;
    await actions.saveStoreAddress(storeAddress);
  };

  return (
    <Formiz
      connect={storeAddressForm}
      onValidSubmit={handleSubmit} // Handle submit only if the form is valid
    >
      <form // create an html form
        noValidate // Disable native html validation
        onSubmit={storeAddressForm.submit} // Pass the Formiz submit to the onSubmit
      >
        <div className="form-group mb-6">
          <FormizInputText name="first_name" label="First Name" />
        </div>

        <div className="form-group mb-6">
          <FormizInputText name="last_name" label="Last Name" />
        </div>

        <div className="form-group mb-6">
          <FormizInputText name="email" label="Email" />
        </div>

        <div className="form-group mb-6">
          <FormizInputText name="company" label="Company Name" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group mb-6">
            <FormizInputText name="address1" label="Street Address" />
          </div>
          <div className="form-group mb-6">
            <FormizInputText name="address2" label="Apt, unit, etc" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group mb-6">
            <FormizInputText name="city" label="City" />
          </div>
          <div className="form-group mb-6">
            <FormizInputText name="state_or_province" label="State/Province/Region" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group mb-6">
            <FormizInputText name="postal_code" label="ZIP/Postal Code" />
          </div>
          <div className="form-group mb-6">
            <FormizCountrySelect
              name="country"
              defaultValue={{ value: "US", label: "United States" }}
            />
          </div>
        </div>

        <div className="form-group form-check mb-6">
          <FormizButton name="save_settings_btn" label="Save Store Address" type="submit" />
        </div>
      </form>
    </Formiz>
  );
};
