import { useState } from "react";
import { Formiz, useForm } from "@formiz/core";
import { FormizInputText } from "@/frontend/components/base/Formiz/FormizInputText";
import { isLength, isNumber, isPattern } from "@formiz/validations";
import { useCartContext } from "@/frontend/providers/CartProvider";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";
import { ProcessPaymentRequest } from "@/types/big-commerce/payment";
import { MANUAL_PAYMENT_METHOD_ID } from "@/constants/common";

const TenderCreditCard = () => {
  const tenderCreditCardForm = useForm();
  const { state, actions } = useCartContext();
  const [noPaymentMethod, setNoPaymentMethod] = useState(false);

  const handleSubmit = async creditCardForm => {
    const selectedMethod = MANUAL_PAYMENT_METHOD_ID;
    const paymentMethod = state.acceptedPaymentMethods.reduce((foundMethod, thisPaymentMethod) => {
      if (thisPaymentMethod.id === selectedMethod) {
        foundMethod = thisPaymentMethod;
      }

      return foundMethod;
    }, null);

    if (isNullOrUndefined(paymentMethod)) {
      setNoPaymentMethod(true);
      return false;
    }

    const payment: ProcessPaymentRequest = {
      instrument: {
        type: paymentMethod.type,
        cardholder_name: creditCardForm.card_name,
        number: creditCardForm.card_num,
        expiry_month: parseInt(creditCardForm.card_exp.split("/")[0]),
        expiry_year: parseInt(creditCardForm.card_exp.split("/")[1]),
        verification_value: creditCardForm.card_cvv
      },
      payment_method_id: paymentMethod.id
    };

    if ("id" in state.paymentAccessToken) {
      actions.processManualPayment(state.orderId, payment, state.paymentAccessToken.id);
    } else {
      console.error("No payment access token found, cannot process payment.");
    }
  };

  if (noPaymentMethod) {
    return (
      <div>
        You need to set up {MANUAL_PAYMENT_METHOD_ID} as an available payment method on your
        BigCommerce store before processing this payment type.
      </div>
    );
  }

  return (
    <>
      <Formiz connect={tenderCreditCardForm} onValidSubmit={handleSubmit}>
        <form noValidate onSubmit={tenderCreditCardForm.submit}>
          <div className="form-group mb-6">
            <FormizInputText name="card_name" label="Name on Card" required="Name is required" />
          </div>
          <div className="form-group mb-6">
            <FormizInputText
              name="card_num"
              label="Card Number"
              required="Card number is required"
              validation={[
                {
                  rule: isNumber(),
                  message: "CVV must be a number"
                }
              ]}
            />
          </div>
          <div className="form-group w-full mb-6">
            <FormizInputText
              name="card_exp"
              label="Expiration"
              required="Card expiration is required"
              placeholder="mm/yyyy"
              validation={[
                {
                  rule: isPattern(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/),
                  message: "Card expiration must be in the format mm/yyyy"
                }
              ]}
            />
          </div>
          <div className="form-group w-full mb-6">
            <FormizInputText
              name="card_cvv"
              label="CVV"
              required="CVV is required"
              validations={[
                {
                  rule: isLength(3),
                  message: "CVV must be a length of 3 digits"
                },
                {
                  rule: isNumber(),
                  message: "CVV must be a number"
                }
              ]}
            />
          </div>
          <div className="mb-6">
            <button
              disabled={state.loaders.processManualPayment}
              type="submit"
              className="mt-4 outline-none rounded-lg text-white h-12 w-full bg-green-500 text-sm cursor-pointer transition-all hover:bg-green-800"
            >
              {!state.loaders.processManualPayment && (
                <>
                  Pay{" "}
                  {state.checkout?.grand_total ? "$" + state.checkout.grand_total.toFixed(2) : ""}
                </>
              )}
              {state.loaders.processManualPayment && <>Processing payment...</>}
            </button>
          </div>
        </form>
      </Formiz>
    </>
  );
};

export default TenderCreditCard;
