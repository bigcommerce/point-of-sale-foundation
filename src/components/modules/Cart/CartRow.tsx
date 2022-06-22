import React, { useState } from "react";
import { PencilIcon, TrashIcon, ChevronLeftIcon } from "@heroicons/react/outline";
import { useCartContext } from "@/frontend/providers/CartProvider";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";

const CartRow = (cart_item) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { state, actions } = useCartContext();
  const menuClassName = `absolute transition-all top-px bottom-px left-full ${
    toggleMenu ? "-ml-48" : " -ml-8"
  } flex justify-between items-center bg-gray-50 px-0 z-10`;
  const default_image = cart_item.image_url;
  const default_image_alt = "";
  let cart_item_selected_options = "";

  if (!isNullOrUndefined(cart_item.options)) {
    cart_item_selected_options = cart_item.options.map(function (option) {
      return (
        <div key={`cart-item-option-${option.name}-${option.value}`} className="text-gray-600">
          {option.name}: {option.value}
        </div>
      );
    });
  }

  return (
    <div
      className="relative w-full flex pl-4 pr-10 py-3 decorator-separator"
      onClick={() => setToggleMenu(!toggleMenu)}
    >
      <div className="shadow bg-gray-100 w-32 h-21">
        <img src={default_image} alt={default_image_alt} className="h-full mx-auto" />
      </div>
      <div className="w-20 text-center align-middle pt-3">
        <span className="inline">{cart_item.quantity}</span>{" "}
        <span className="inline-block ml-2">x</span>
      </div>
      <div className="flex flex-col justify-start w-auto">
        <div className="flex flex-row grow">
          <span className="font-bold">{cart_item.name}</span>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col basis-3/4">{cart_item_selected_options}</div>
          <div className="basis-1/2 text-right text-2xl">${cart_item.sale_price.toFixed(2)}</div>
        </div>
      </div>

      <div className={menuClassName}>
        <div className="flex justify-center items-center w-8 h-full shadow">
          <ChevronLeftIcon
            className={`transition-all ${toggleMenu ? "rotate-180" : "rotate-0"} w-6 h-6`}
          />
        </div>
        <div className="flex justify-center items-center w-20 h-full shadow">
          <PencilIcon className="w-6 h-6" />
        </div>
        <div
          onClick={() => {
            if (state.cart.line_items.physical_items.length == 1) {
              actions.deleteCart(state.cart.id);
              actions.clearCartCheckout();
            } else {
              actions.deleteCartLineItem(state.cart.id, cart_item.id);
            }
          }}
          className="flex justify-center items-center w-20 h-full shadow bg-red-500 text-gray-50"
        >
          <TrashIcon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default CartRow;
