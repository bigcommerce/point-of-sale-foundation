import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import GlobalProvider from "../providers/GlobalProvider";
import withAuth, { withAuthServerSideProps } from "@/frontend/hocs/withAuth";
import { Tabs } from "@/frontend/components/base/Tabs";
import { DotIcon } from "@/frontend/components/icons";

import ProductTile from "@/frontend/components/modules/Register/ProductTile";
import Breadcrumbs from "@/frontend/components/modules/Register/Breadcrumbs";

import ProductDetails from "@/frontend/components/modules/Register/ProductDetails";
import { useProductContext } from "@/frontend/providers/ProductProvider";
import { useCartContext } from "@/frontend/providers/CartProvider";
import CartProvider from "@/frontend/providers/CartProvider";
import ConnectDialog from "@/frontend/components/modules/Stripe/ConnectDialog";

import PaymentDialog from "@/frontend/components/modules/Orders/PaymentDialog";
import { WifiIcon } from "@heroicons/react/outline";
import TenderDialog from "../components/modules/Orders/TenderDialog";
import SettingsProvider from "../providers/SettingsProvider";

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(async context => {
  return {
    props: {}
  };
});

const RegisterPage = (props): JSX.Element => {
  const router = useRouter();
  const productContext = useProductContext();
  const cartContext = useCartContext();

  const [stripeDialog, setStripeDialog] = useState(false);
  const [tenderDialog, setTenderDialog] = useState(false);

  useEffect(() => {
    productContext.actions.getProducts({
      pageSize: 20,
      categoryId: router.query.categoryId
    });

    productContext.actions.getCategories().then(data => {
      if (!Array.isArray(router.query.categoryId)) {
        productContext.actions.updateBreadcrumbs(parseInt(router.query.categoryId));
      }
    });
  }, [router.query.categoryId]);

  useEffect(() => {
    if (router.query.productId) {
      if (typeof router.query.productId === "string") {
        productContext.actions.getProductDetails(router.query.productId);
      }
    } else {
      productContext.actions.clearProductDetails();
    }
  }, [router.query.productId]);

  return (
    <GlobalProvider>
      <SettingsProvider access_token={props.access_token}>
        <CartProvider access_token={props.access_token}>
          {productContext.state.productDetails !== null && (
            <ProductDetails product={productContext.state.productDetails} />
          )}
          {stripeDialog && (
            <ConnectDialog
              onConnect={() => setStripeDialog(false)}
              onDisconnect={() => setStripeDialog(false)}
              onClose={() => setStripeDialog(false)}
            />
          )}
          <PaymentDialog />

          {tenderDialog && <TenderDialog onClose={() => setTenderDialog(false)} />}

          <div className="w-full h-screen">
            <div className="flex justify-between h-14 w-full bg-gray-50 shadow">
              <div className="font-bold py-4 px-5 pl-10">
                <div className="flex text-gray-700 px-4"></div>
              </div>

              <div className="flex justify-between w-112 py-4 px-2">
                <button onClick={() => setStripeDialog(true)}>
                  <WifiIcon className="w-6 h-6" />
                </button>
                <h3 className="font-bold">Order</h3>
                <DotIcon />
              </div>
            </div>

            <div className="flex justify-between items-stretch w-full screen-container">
              <div className="w-full flex flex-wrap content-start overflow-y-scroll">
                <Breadcrumbs
                  categories={productContext.state.categories}
                  breadcrumbs={productContext.state.breadcrumbs}
                />

                {productContext.state.products.map((product, index) => (
                  <ProductTile
                    key={product.entityId}
                    product={product}
                    index={`product-${index}`}
                  />
                ))}
              </div>

              <div className="flex flex-col justify-start h-screen--navbar w-112 shrink-0 bg-white border-t border-slate-200">
                <Tabs setTenderDialog={() => setTenderDialog(true)} />
              </div>
            </div>
          </div>
        </CartProvider>
      </SettingsProvider>
    </GlobalProvider>
  );
};

export default withAuth(RegisterPage);
