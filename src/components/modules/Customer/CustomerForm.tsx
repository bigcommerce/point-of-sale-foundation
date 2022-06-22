import React from "react";
import { useRouter } from "next/router";
import { Formiz, useForm } from "@formiz/core";
import { isEmail, isNumber } from "@formiz/validations";
import { FormizInputText } from "@/frontend/components/base/Formiz/FormizInputText";
import { FormizInputPhone } from "@/frontend/components/base/Formiz/FormizInputPhone";
import { FormizButton } from "@/frontend/components/base/Formiz/FormizButton";
// These are left in along with commented out customer billing / shipping address code for future reference
// import { FormizCountrySelect } from "@/frontend/components/base/Formiz/FormizCountrySelect";
// import { FormizInputCheckbox } from "@/frontend/components/base/Formiz/FormizInputCheckbox";
// import { FormizSelect } from "@/frontend/components/base/Formiz/FormizSelect";
// ^ ------
import BaseLoader from "@/frontend/components/base/Loader";
import { isStringNullOrEmpty } from "@/shared/utils/isNullOrUndefined";
import { useCartContext } from "@/frontend/providers/CartProvider";
import { CustomerRequest, Customer } from "@/frontend/providers/CartProvider/context";

export const CustomerForm = (): JSX.Element => {
  const router = useRouter();
  const customerForm = useForm();
  const customerLookupForm = useForm();
  const { state, actions } = useCartContext();
  const queryParams = new URLSearchParams(window.location.search);
  const formAction = queryParams.get("action");
  const customerFormActionLabel = "update" == formAction ? "Update Customer" : "Add Customer";

  const handleSubmit = async customerForm => {
    const customerRequest: CustomerRequest = {
      first_name: customerForm.first_name,
      last_name: customerForm.last_name,
      email: customerForm.email,
      phone: customerForm.phone,
      form_fields: [{ name: "test", value: "test" }]
    };

    if ("update" == formAction && state.customer?.id) {
      delete customerRequest["form_fields"];
      customerRequest["id"] = state.customer.id;
      await actions.updateCustomer(customerRequest);
    } else {
      const customers = await actions.createCustomer(customerRequest);
      if (Array.isArray(customers) && !isStringNullOrEmpty(state.cart?.id)) {
        if ("id" in customers[0]) {
          const customer: Customer = customers[0];
          await actions.updateCartCustomerId(state.cart.id, customer.id);
        }
      }
    }

    router.push("/register?tab=order");
  };

  const handleLookup = async customerLookupForm => {
    actions.getCustomers(customerLookupForm.customer_name_search_value)
  };

  return (
    <>
      {formAction !== "update" &&
        <>
          <h2 className="text-lg text-center font-bold mb-6">Customer Lookup</h2>
          {!state.loaders.getCustomers && !state.customersLookupResult &&
            <Formiz
              connect={customerLookupForm}
              onValidSubmit={handleLookup}
              >
                <form
                  noValidate
                  onSubmit={customerLookupForm.submit}
                >
                  <div className="mb-4">
                    <FormizInputText name="customer_name_search_value" label="Customer Name" />
                  </div>
                  <FormizButton disabled={state.loaders.getCustomers} name="customer_search_btn" label="Lookup" type="submit" />
              </form>
            </Formiz>
          }
          {!state.loaders.getCustomers && state.customersLookupResult && 
            <>
              <button
                className="w-full px-6 py-4 mb-4 text-black border border-gray font-medium text-xs leading-tight uppercase rounded hover:bg-gray-100 focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                onClick={() => actions.clearCustomersLookupResult()}>Clear Results
              </button>

              {!state.customersLookupResult?.data?.length && 
                <div className="w-full px-6 py-4 mb-4 text-black font-medium text-xs leading-tight uppercase text-center">
                  No Customers Found
                </div>
              }

              {state.customersLookupResult?.data?.map((customer: Customer, idx: number) => (
                <div
                  key={idx}
                  className="cursor-pointer w-full px-6 py-4 mb-4 bg-white text-black font-medium text-md leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:text-white focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                  onClick={
                    async () => {
                      if (!isStringNullOrEmpty(state.cart?.id)) {
                        await actions.updateCartCustomerId(state.cart.id, customer.id);
                        actions.setActiveCustomer(customer);
                        router.push("/register?tab=order");
                        actions.clearCustomersLookupResult();
                      }
                    }
                  }
                >
                  <div>{customer.first_name} {customer.first_name}</div>
                  <div className="text-xs">{customer.email}</div>
                </div>
              ))}
            </>
          }
          {state.loaders.getCustomers && <BaseLoader message="Searching..."/>}
        </>
      }

      <h2 className="text-lg text-center font-bold mt-6">{customerFormActionLabel}</h2>

      <Formiz
        initialValues={{
          first_name: state.customer?.first_name,
          last_name: state.customer?.last_name,
          email: state.customer?.email,
          phone: state.customer?.phone
          /*
          opt_in_marketing: state.customer?.opt_in_marketing,
          billing_same_shipping: state.customer?.billing_same_shipping,
          billing_company: state.customer?.billing_company,
          billing_address1: state.customer?.billing_address1,
          billing_address2: state.customer?.billing_address2,
          billing_city: state.customer?.billing_city,
          billing_phone: state.customer?.billing_phone,
          billing_state_or_province: state.customer?.billing_state_or_province,
          billing_postal_code: state.customer?.billing_postal_code,
          billing_country_code: state.customer?.billing_country_code,
          billing_address_type: state.customer?.billing_address_type,
          shipping_first_name: state.customer?.shipping_first_name,
          shipping_last_name: state.customer?.shipping_last_name,
          shipping_company: state.customer?.shipping_company,
          shipping_address1: state.customer?.shipping_address1,
          shipping_address2: state.customer?.shipping_address2,
          shipping_city: state.customer?.shipping_city,
          shipping_phone: state.customer?.shipping_phone,
          shipping_state_or_province: state.customer?.shipping_state_or_province,
          shipping_postal_code: state.customer?.shipping_postal_code,
          shipping_country_code: state.customer?.shipping_country_code,
          shipping_address_type: state.customer?.shipping_address_type
          */
        }}
        connect={customerForm}
        onValidSubmit={handleSubmit} // Handle submit only if the form is valid
      >
        <form
          noValidate // Disable native html validation
          onSubmit={customerForm.submit}
        >
          <h3 className="text-left mb-3">Profile</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-6">
              <FormizInputText
                name="first_name"
                label="First Name"
                required="First Name is required"
              />
            </div>
            <div className="form-group mb-6">
              <FormizInputText name="last_name" label="Last Name" required="Last Name is required" />
            </div>
          </div>

          <div className="form-group mb-6">
            <FormizInputText
              name="email"
              label="Email"
              required="Email is required"
              validations={[
                {
                  rule: isEmail(),
                  message: "This is not a valid email"
                }
              ]}
            />
          </div>
          <div className="form-group mb-6">
            <FormizInputPhone
              name="phone"
              label="Phone"
              required="Phone number is required"
              validations={[
                {
                  rule: isNumber(),
                  message: "This is not a valid phone"
                }
              ]}
            />
          </div>
          {/* 
          <div className="form-group text-left mb-6">
            <FormizInputCheckbox
              name="opt_in_marketing"
              label="Opt-in Marketing Deals &amp; Specials"
              defaultChecked={true}
            />
          </div>
  */}
          <div className="form-group mb-6">
            <FormizButton name="add_customer_btn" label={customerFormActionLabel} type="submit" />
          </div>
          {/* 
          <div className="border-b border-slate-200 my-6 mx-12"></div>

          <h3 className="text-left mt-6 mb-4">Billing Address</h3>

          <div className="form-group form-check text-left mb-4">
            <FormizInputCheckbox
              name="billing_same_shipping"
              label="Billing same as shipping?"
              defaultChecked={true}
              onClick={(item, index) => {
                if (item.target.checked) {
                  document.getElementById("shipping_address").classList.add("hidden");
                } else {
                  document.getElementById("shipping_address").classList.remove("hidden");
                }
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-6">
              <FormizInputText name="billing_address1" label="Street Address" />
            </div>
            <div className="form-group mb-6">
              <FormizInputText name="billing_address2" label="Apt, unit, etc" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-6">
              <FormizInputText name="billing_city" label="City" />
            </div>
            <div className="form-group mb-6">
              <FormizInputText name="billing_state_or_province" label="State/Province/Region" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-6">
              <FormizInputText name="billing_postal_code" label="ZIP/Postal Code" />
            </div>
            <div className="form-group mb-6">
              <FormizCountrySelect
                name="country_code"
                defaultValue={{ value: "US", label: "United States" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-6">
              <FormizInputText name="billing_company" label="Company Name" />
            </div>
            <div className="form-group mb-6">
              <FormizSelect
                name="billing_address_type"
                defaultValue={{ value: "", label: "Select Address Type..." }}
                options={[
                  { value: "residential", label: "Residential" },
                  { value: "commercial", label: "Commercial" }
                ]}
              />
            </div>
          </div>
          {/* 
          <div
            id="shipping_address"
            className={false === state.customer?.billing_same_shipping ? "" : "hidden"}
          >
            <h3 className="text-center mb-3">Shipping Address</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group mb-6">
                <FormizInputText name="shipping_address1" label="Street Address" />
              </div>
              <div className="form-group mb-6">
                <FormizInputText name="shipping_address2" label="Apt, unit, etc" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group mb-6">
                <FormizInputText name="shipping_city" label="City" />
              </div>
              <div className="form-group mb-6">
                <FormizInputText name="shipping_state_or_province" label="State/Province/Region" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group mb-6">
                <FormizInputText name="shipping_postal_code" label="ZIP/Postal Code" />
              </div>
              <div className="form-group mb-6">
                <FormizCountrySelect
                  name="shipping_country_code"
                  defaultValue={{ value: "US", label: "United States" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group mb-6">
                <FormizInputText name="shipping_company" label="Company Name" />
              </div>
              <div className="form-group mb-6">
                <FormizSelect
                  name="shipping_address_type"
                  defaultValue={{ value: "", label: "Select Address Type..." }}
                  options={[
                    { value: "residential", label: "Residential" },
                    { value: "commercial", label: "Commercial" }
                  ]}
                />
              </div>
            </div>

            <div className="form-group form-check mb-6">
              <FormizInputPhone
                name="shipping_phone"
                label="Phone"
                validations={[
                  {
                    rule: isNumber(),
                    message: "This is not a valid phone"
                  }
                ]}
              />
            </div>
          </div>

          <div className="form-group form-check mb-6">
            <FormizButton name="add_customer_btn" label="Add Customer" type="submit" />
          </div>
          */}
        </form>
      </Formiz>
    </>
  );
};
