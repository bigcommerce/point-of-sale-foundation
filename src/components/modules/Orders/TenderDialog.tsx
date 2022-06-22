import React, { useState } from "react";
import { CheckCircleIcon, XIcon } from "@heroicons/react/outline";
import TenderSelect from "./TenderSelect";
import TenderCash from "./TenderCash";
import TenderCreditCard from "./TenderCreditCard";
import { useCartContext } from "@/frontend/providers/CartProvider";

const TenderDialogWrapper = ({ children, onClose }) => {
  return (
    <div className="fixed z-20 top-0 left-0 w-screen h-screen bg-opaque-400">
      <div className="absolute top-0 left-0 h-screen bg-gray-100 shadow">
        <a className="absolute top-0 left-0" onClick={() => onClose()}>
          <XIcon className="h-8 w-8 mx-4 my-3 inline-block" />
        </a>
        {children}
      </div>
    </div>
  );
};

const TenderDialog = ({ onClose }) => {
  const cartContext = useCartContext();
  const [tenderSelectPage, setTenderSelectPage] = useState(true);
  const [tenderCashPage, setTenderCashPage] = useState(false);
  const [tenderCreditCardPage, setTenderCreditCardPage] = useState(false);

  if (cartContext.state?.completedPayment) {
    const message =
      cartContext.state.completedPayment.payment_type === "cash"
        ? `$${cartContext.state.completedPayment.change.toFixed(2)} change received`
        : "Order complete!";

    return (
      <div className="fixed w-full h-screen bg-white z-20 pt-20">
        <CheckCircleIcon color="green" className="h-36 w-36 m-auto mt-20" />
        <div className="w-100 text-center mt-10 text-5xl font-thin">{message}</div>
        <div
          className="border p-5 w-1/3 text-4xl m-auto text-center mt-20 cursor-pointer"
          onClick={() => {
            onClose();
            cartContext.actions.clearCartCheckout();
          }}
        >
          Start new transaction
        </div>
      </div>
    );
  }

  let backFunction: () => void, title: string;

  if (tenderSelectPage) {
    title = "Select Payment Method";
  } else if (tenderCreditCardPage) {
    backFunction = () => {
      setTenderCreditCardPage(false);
      setTenderSelectPage(true);
    };
    title = "Manual Credit Card Entry";
  } else if (tenderCashPage) {
    backFunction = () => {
      setTenderCashPage(false);
      setTenderSelectPage(true);
      title = "Enter Cash Amount";
    };
  }

  return (
    <TenderDialogWrapper onClose={onClose}>
      <>
        {!tenderSelectPage && (
          <div
            onClick={() => backFunction()}
            className="absolute top-3 right-5 text-right uppercase rounded-lg text-gray-600 bg-gray-200 px-3 py-2 font-semibold"
          >
            Back
          </div>
        )}
        <div className="mt-12 mr-20 ml-20 right_side truncate h-auto w-auto">
          <h2 className="mt-12 text-xl text-center font-semibold mb-6">{title}</h2>

          {cartContext.state?.errors?.captureTerminalPayment && (
            <div className="my-10 text-center text-md">
              {cartContext.state?.errors?.captureTerminalPayment.message}
            </div>
          )}

          {tenderSelectPage && (
            <TenderSelect
              viewTenderCashPage={() => {
                setTenderSelectPage(false);
                setTenderCashPage(true);
              }}
              viewTenderCreditCardPage={async () => {
                await cartContext.actions.getAcceptedPaymentMethods(
                  cartContext.state?.checkout?.id,
                  cartContext.state?.orderId
                );

                await cartContext.actions.createPaymentAccessToken(
                  cartContext.state.orderId,
                  false
                );

                setTenderSelectPage(false);
                setTenderCreditCardPage(true);
              }}
            />
          )}

          {tenderCreditCardPage && <TenderCreditCard />}

          {tenderCashPage && <TenderCash />}
        </div>
      </>
    </TenderDialogWrapper>
  );
};

export default TenderDialog;
