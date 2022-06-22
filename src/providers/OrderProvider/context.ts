import { createContext, useContext } from "react";

import { OrderResponse } from "@/types/big-commerce/orders";
import { UserError } from "@/shared/methods/bigcommerce";

export type OrderLoadingStates = {
  getOrders: boolean;
  updateOrder: boolean;
};

export type OrderErrorStates = {
  order: UserError | Error | null;
  getOrders: UserError | Error | null;
  updateOrder: UserError | Error | null;
};

export interface OrderState {
  loaders: OrderLoadingStates;
  errors: OrderErrorStates;
  orders: OrderResponse[];
}

export type GetOrdersAction = () => Promise<OrderResponse[]>;
export type UpdateOrderAction = (
  orderId: number,
  orderUpdatePayload: any
) => Promise<OrderResponse | null>;

export interface OrderActions {
  getOrders: GetOrdersAction;
  updateOrder: UpdateOrderAction;
}

export interface OrderContextProps {
  state: OrderState;
  actions: OrderActions;
}

export const OrderContext = createContext<OrderContextProps>({
  state: {
    loaders: {
      getOrders: false,
      updateOrder: false
    },
    errors: {
      order: null,
      getOrders: null,
      updateOrder: null
    },
    orders: []
  },
  actions: {
    getOrders: () => Promise.resolve([]),
    updateOrder: () => Promise.resolve(null)
  }
});

OrderContext.displayName = "OrderContext";

export function useOrderContext() {
  const context = useContext(OrderContext);
  return context;
}
