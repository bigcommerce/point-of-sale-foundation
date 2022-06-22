import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { useCartContext } from "@/frontend/providers/CartProvider";

const OrderCustomer = () => {
  const { state, actions } = useCartContext();
  return (
    <div className="flex items-center bg-gray-50">
      <div className="flex text-left basis-3/4 h-full p-4 shadow">
        <p>
          <b>Customer</b>:<br />
          {`${state.customer.first_name} ${state.customer.last_name}`}
        </p>
      </div>
      <div
        onClick={() => {
          actions.openCustomerTab();
        }}
        className="flex justify-center items-center w-20 h-full p-7 shadow"
      >
        <PencilIcon className="w-6 h-6" />
      </div>
      <div
        onClick={() => {
          actions.removeCustomer();
        }}
        className="flex justify-center items-center w-20 h-full  p-7 shadow bg-red-500 text-gray-50"
      >
        <TrashIcon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default OrderCustomer;
