import React, { useEffect } from "react";
import { useCartContext } from "@/frontend/providers/CartProvider";

const PaymentLoader = (): JSX.Element => {
  return (
    <svg
      className="animate-spin h-12 w-12 text-slate-600 inline"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-40"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

const PaymentDialogWrapper = ({ children }) => {
  return (
    <div className="fixed z-50 z-30 top-0 left-0 w-screen h-screen bg-opaque-400">
      <div className="absolute z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-gray-100 shadow rounded p-8 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

const PaymentDialog = () => {
  const { state, actions } = useCartContext();

  if (
    !state.loaders.collectTerminalPayment &&
    !state.loaders.processTerminalPayment &&
    !state.loaders.captureTerminalPayment
  ) {
    return <></>;
  }

  return (
    <PaymentDialogWrapper>
      {state.loaders.collectTerminalPayment && (
        <>
          <h3 className="text-2xl mb-4 text-center">Collecting Payment</h3>
          <h4 className="text-lg text-center">
            Insert, tap, or swipe card using the Stripe Terminal

            <button
              className="w-full px-6 py-4 mt-6 text-black border border-gray-500 font-medium text-xs leading-tight uppercase rounded hover:bg-gray-100 focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              onClick={() => actions.stopCollectingTerminalPayment()}
            >
              Cancel
            </button>
          </h4>
        </>
      )}
      {state.loaders.processTerminalPayment && (
        <>
          <h3 className="text-2xl mb-4 text-center">Processing Payment</h3>
          <h4 className="text-lg text-center">
            <PaymentLoader />
          </h4>
        </>
      )}
      {state.loaders.captureTerminalPayment && (
        <>
          <h3 className="text-2xl mb-4 text-center">Capturing Payment</h3>
          <h4 className="text-lg text-center">
            <PaymentLoader />
          </h4>
        </>
      )}
    </PaymentDialogWrapper>
  );
};

export default PaymentDialog;
