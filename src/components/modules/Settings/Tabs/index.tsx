import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import TabNavItem from "./TabNavItem";
import TabContent from "./TabContent";
import CartList from "@/frontend/components/modules/Cart/CartList";
import OrderCustomer from "@/frontend/components/modules/Orders/OrderCustomer";
import Totals from "@/frontend/components/modules/Register/Totals";
import { DocumentTextIcon, PencilIcon, UserIcon } from "@heroicons/react/outline";
import CustomerSection from "@/frontend/components/modules/Customer/CustomerSection";
import { CustomerForm } from "@/frontend/components/modules/Customer/CustomerForm";
import OrderNotesSection from "@/frontend/components/modules/Orders/OrderNotesSection";
import { OrderNotesForm } from "@/frontend/components/modules/Orders/OrderNotesForm";
import { useOrderContext } from "@/frontend/providers/OrderProvider/context";
import { useCartContext } from "@/frontend/providers/CartProvider";
import OrderNotes from "@/frontend/components/modules/Orders/OrderNotes";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";

export const Tabs = ({ setTenderDialog }): JSX.Element => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (typeof router.query.tab === "string") {
      setActiveTab(router.query.tab);
    } else {
      setActiveTab("order");
    }
  }, [router.query.tab]);

  return (
    <div className="Tabs">
      {/* tab nav */}
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
        <TabContent id="order" activeTab={activeTab}>
          <p></p>
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
