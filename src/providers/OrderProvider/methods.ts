import type { OrderResponse } from "@/types/big-commerce/orders";

import {
  MethodOptions,
  ForbiddenError,
  SessionExpiredError,
  UserError
} from "@/shared/methods/bigcommerce";
import { ErrorResponse } from "@/types/response";

export type GetOrdersFunction = (
  options: MethodOptions
) => Promise<OrderResponse[] | ErrorResponse>;
export type UpdateOrderFunction = (
  orderId: number,
  orderUpdatePayload: any,
  options: MethodOptions
) => Promise<OrderResponse[] | ErrorResponse>;
export type AddOrderNotesFunction = (
  orderNotes: string,
  options: MethodOptions
) => Promise<OrderResponse | ErrorResponse>;
export type UpdateOrderNotesFunction = (
  orderNotes: string,
  options: MethodOptions
) => Promise<OrderResponse | ErrorResponse>;
export type RemoveOrderNotesFunction = (
  orderNotes: string,
  options: MethodOptions
) => Promise<OrderResponse | ErrorResponse>;

const apiUri = "/api/orders";

const handleResponse = response => {
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

  return response.json();
};

export const getOrdersMethod: GetOrdersFunction = ({ access_token }) => {
  return fetch(`${apiUri}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    }
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<OrderResponse[] | ErrorResponse>;
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
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderUpdatePayload)
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<OrderResponse[] | ErrorResponse>;
  });
};
