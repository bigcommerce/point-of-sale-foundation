import React, { useState } from "react";
import { useRouter } from "next/router";
import { OrderContext, GetOrdersAction, UpdateOrderAction } from "./context";
import { destroyCookie } from "nookies";
import { getOrdersMethod, updateOrderMethod } from "./methods";
import { SessionExpiredError } from "@/shared/methods/bigcommerce";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";

export * from "./context";

export type ActionBuilder<T> = {
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  setError: React.Dispatch<React.SetStateAction<any>>;
  execMethod: T;
};

const OrderProvider = (props: { access_token: string; children: React.ReactElement | any }) => {
  const { access_token, children } = props;
  const router = useRouter();

  const [orderLoader, setOrderLoader] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [getOrdersLoader, setGetOrdersLoader] = useState(false);
  const [getOrdersError, setGetOrdersError] = useState(null);
  const [updateOrderLoader, setUpdateOrderLoader] = useState(false);
  const [updateOrderError, setUpdateOrderError] = useState(null);

  const actionBuilder = ({ setLoader, setData, setError, execMethod }) =>
    function (...args) {
      args = Array.from(args).concat([{ access_token }]);
      setError(null);
      setLoader(true);
      return execMethod
        .apply(this, args)
        .then(data => {
          if (isNullOrUndefined(data.status)) {
            setData(data);
          } else {
            setError(data);
          }
          setLoader(false);
          return data;
        })
        .catch(e => {
          if (e instanceof SessionExpiredError) {
            destroyCookie(null, "access_token");
            destroyCookie(null, "first_time");
            destroyCookie(null, "employee");
            router.reload();
            return null;
          }
          setError(e);
          setLoader(false);
          throw e;
        });
    };

  const getOrders: GetOrdersAction = actionBuilder({
    setLoader: setGetOrdersLoader,
    setData: setOrders,
    setError: setGetOrdersError,
    execMethod: getOrdersMethod
  });

  const updateOrder: UpdateOrderAction = actionBuilder({
    setLoader: setUpdateOrderLoader,
    setData: setOrders,
    setError: setUpdateOrderError,
    execMethod: updateOrderMethod
  });

  // Keep loaders false on initialization as to not block SSR renders
  const value: any = {
    state: {
      loaders: {
        order: orderLoader,
        getOrders: getOrdersLoader,
        updateOrder: updateOrderLoader
      },
      errors: {
        order: orderError,
        getOrders: getOrdersError,
        updateOrder: updateOrderError
      },
      order,
      orders
    },
    actions: {
      getOrders,
      updateOrder
    }
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
export default OrderProvider;
