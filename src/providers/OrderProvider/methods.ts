import type { OrderResponse } from "@/types/big-commerce/orders";

import {
  MethodOptions,
  ForbiddenError,
  SessionExpiredError,
  UserError
} from "@/shared/methods/bigcommerce";

export type GetOrdersFunction = (options: MethodOptions) => Promise<OrderResponse[]>;
export type UpdateOrderFunction = (
  orderId: number,
  orderUpdatePayload: any,
  options: MethodOptions
) => Promise<OrderResponse[]>;

const apiUri = "/api/orders";

export const getOrdersMethod: GetOrdersFunction = ({ access_token }) => {
  return fetch(`${apiUri}`, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }).then(response => {
    if (!response.ok) {
      if (response.status === 400) {
        return response.json().then(data => {
          throw new UserError(response.statusText, data);
        });
      } else if (response.status === 401) {
        throw new SessionExpiredError("JWT expired");
      } else if (response.status === 403) {
        throw new ForbiddenError("Forbidden");
      }
    }
    return response.json() as Promise<OrderResponse[] | null>;
  });
};

export const updateOrderMethod: UpdateOrderFunction = (
  orderId,
  orderUpdatePayload,
  { access_token }
) => {
  return fetch(`${apiUri}/${orderId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access_token}`
    },
    body: JSON.stringify(orderUpdatePayload)
  }).then(response => {
    if (!response.ok) {
      if (response.status === 400) {
        return response.json().then(data => {
          throw new UserError(response.statusText, data);
        });
      } else if (response.status === 401) {
        throw new SessionExpiredError("JWT expired");
      } else if (response.status === 403) {
        throw new ForbiddenError("Forbidden");
      }
    }
    return response.json() as Promise<OrderResponse[] | null>;
  });
};
