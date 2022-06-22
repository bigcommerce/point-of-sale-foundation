import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TabNavItem from "./TabNavItem";
import TabContent from "./TabContent";
import CartList from "@/frontend/components/modules/Cart/CartList";
import Totals from "@/frontend/components/modules/Register/Totals";
import { DocumentTextIcon, PencilIcon, UserIcon } from "@heroicons/react/outline";
import CustomerSection from "@/frontend/components/modules/Customer/CustomerSection";
import { CustomerForm } from "@/frontend/components/modules/Customer/CustomerForm";
import OrderNotesSection from "@/frontend/components/modules/Orders/OrderNotesSection";
import { OrderNotesForm } from "@/frontend/components/modules/Orders/OrderNotesForm";
import { useCartContext } from "@/frontend/providers/CartProvider";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";

export const Tabs = ({ setTenderDialog }): JSX.Element => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(null);

  const cartContext = useCartContext();
  let cart_line_items =
    typeof cartContext.state.cart?.line_items !== "undefined"
      ? cartContext.state.cart.line_items
      : null;

  const pos_cart =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("pos_cart")) : null;

  if (isNullOrUndefined(cart_line_items) && !isNullOrUndefined(pos_cart)) {
    cart_line_items = pos_cart.line_items;
  }

  useEffect(() => {
    if (typeof router.query.tab === "string") {
      setActiveTab(router.query.tab);
    } else {
      setActiveTab("order");
    }
  }, [router.query.tab]);

  return (
    <div className="Tabs">
      {/* Tab navigation */}
      <ul className="nav flex flex-row justify-between w-full border-b border-slate-200">
        <TabNavItem id="order" activeTab={activeTab} setActiveTab={setActiveTab}>
          <DocumentTextIcon className="inline-block w-6 h-6" />
        </TabNavItem>
        <TabNavItem id="order-notes" activeTab={activeTab} setActiveTab={setActiveTab}>
          <PencilIcon className="inline-block w-6 h-6" />
        </TabNavItem>
        <TabNavItem id="add-customer" activeTab={activeTab} setActiveTab={setActiveTab}>
          <UserIcon className="inline-block w-6 h-6" />
        </TabNavItem>
      </ul>
      <div className="outlet">
        {/* Tab content */}
        <TabContent id="order" activeTab={activeTab}>
          <CartList lineItems={cart_line_items} />
          <Totals setTenderDialog={setTenderDialog} />
        </TabContent>
        <TabContent id="order-notes" activeTab={activeTab}>
          <OrderNotesSection>
            <OrderNotesForm />
          </OrderNotesSection>
        </TabContent>
        <TabContent id="add-customer" activeTab={activeTab}>
          <CustomerSection>
            <CustomerForm />
          </CustomerSection>
        </TabContent>
      </div>
    </div>
  );
};
