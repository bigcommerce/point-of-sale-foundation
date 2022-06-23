import React from "react";
import CartRow from "@/frontend/components/modules/Cart/CartRow";
import { useCartContext } from "@/frontend/providers/CartProvider";
import OrderCustomer from "@/frontend/components/modules/Orders/OrderCustomer";
import OrderNotes from "@/frontend/components/modules/Orders/OrderNotes";

const CartList = ({ lineItems }) => {
  const { state } = useCartContext();

  return (
    <div className="flex flex-col grow justify-start w-full overflow-hidden bg-white">
      {state.customer && <OrderCustomer />}
      {state.orderNotes && <OrderNotes />}
      {lineItems &&
        lineItems.physical_items.map(item => (
          <CartRow key={`cart-item-${item.product_id}-${item.variant_id}`} {...item} />
        ))}
    </div>
  );
};

export default CartList;
