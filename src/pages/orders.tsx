import React from "react";
import { GetServerSideProps } from "next";
import GlobalProvider from "../providers/GlobalProvider";
import withAuth, { withAuthServerSideProps } from "@/frontend/hocs/withAuth";
import OrderProvider from "@/frontend/providers/OrderProvider";
import OrderView from "@/frontend/components/modules/Orders/OrderView";

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(async context => {
  return {
    props: {}
  };
});

const OrdersPage = (props): JSX.Element => {
  return (
    <GlobalProvider>
      <OrderProvider access_token={props.access_token}>
        <div className="flex fixed z-10 justify-between h-14 w-screen mb-0.5 bg-gray-50 shadow">
          <div className="font-bold py-4 px-5">
            <div className="flex text-gray-700 py-4 px-2"></div>
          </div>
        </div>
        <OrderView />
      </OrderProvider>
    </GlobalProvider>
  );
};

export default withAuth(OrdersPage);
