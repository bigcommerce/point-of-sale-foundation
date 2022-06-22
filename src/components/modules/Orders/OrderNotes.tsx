import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
//import { useCartContext } from "@/frontend/providers/CartProvider";

const OrderNotes = () => {
  //const { state, actions } = useCartContext();

  return (
    <div className="flex items-center bg-gray-50">
      <div className="flex text-left basis-3/4 h-full p-4 shadow">
        <p>
          <b>Notes</b>:<br />
          {/* {state.orderNotes} */}
        </p>
      </div>
      <div
        onClick={() => {
          /* actions.updateOrderNotes(state.orderNotes)*/
        }}
        className="flex justify-center items-center w-20 h-full p-7 shadow"
      >
        <PencilIcon className="w-6 h-6" />
      </div>
      <div
        onClick={() => {
          /* actions.removeOrderNotes()*/
        }}
        className="flex justify-center items-center w-20 h-full  p-7 shadow bg-red-500 text-gray-50"
      >
        <TrashIcon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default OrderNotes;
