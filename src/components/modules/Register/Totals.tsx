import { Checkout, useCartContext } from "@/frontend/providers/CartProvider";
import { useSettingsContext } from "@/frontend/providers/SettingsProvider";
import Button from "@/frontend/components/base/Button";

const Totals = ({ setTenderDialog }): JSX.Element => {
  const cartContext = useCartContext();
  const settingsContext = useSettingsContext();

  let tax_estimate = 0;
  if (cartContext.state.cart?.base_amount && cartContext.state.cart?.cart_amount) {
    tax_estimate = cartContext.state.cart.cart_amount - cartContext.state.cart.base_amount;
  }

  const loaders =
    cartContext.state.loaders.createCart ||
    cartContext.state.loaders.addCartLineItems ||
    cartContext.state.loaders.updateCartCustomerId ||
    cartContext.state.loaders.deleteCartLineItem ||
    cartContext.state.loaders.addConsignment ||
    cartContext.state.loaders.updateConsignment;
  return (
    <div className="w-full px-4 py-2 bg-white">
      <div className="px-2 py-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold">Subtotal</h4>
          <h5>
            $
            {cartContext.state.cart?.base_amount
              ? cartContext.state.cart.base_amount.toFixed(2)
              : 0.0}
          </h5>
        </div>
        <div className="flex justify-between items-center">
          <h4 className="font-bold">Tax</h4>
          <h5>${tax_estimate ? tax_estimate.toFixed(2) : 0.0}</h5>
        </div>
        <div className="flex justify-between items-center">
          <h4 className="font-bold">Total</h4>
          <h5>
            $
            {cartContext.state.cart?.cart_amount
              ? cartContext.state.cart.cart_amount.toFixed(2)
              : 0.0}
          </h5>
        </div>
      </div>

      <Button
        className="w-full disabled:opacity-50"
        theme="success"
        loader={loaders}
        disabled={loaders || !cartContext.state.cart?.id ? true : false}
        onClick={async () => {
          // Get store address from settings for the consignment shipping address
          const storeAddress = await settingsContext.actions.getStoreAddress();
          const orderId = await cartContext.actions.initCheckout(storeAddress, storeAddress.email);
          //Display tender dialog
          setTenderDialog();
        }}
      >
        Pay{" "}
        {cartContext.state.cart?.cart_amount
          ? "$" + cartContext.state.cart?.cart_amount.toFixed(2)
          : ""}
      </Button>
    </div>
  );
};

export default Totals;
