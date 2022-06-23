import {
  Cart,
  CartLineItem,
  CreateCart,
  Checkout,
  ConsignmentRequest,
  UpdateConsignmentRequest,
  CheckoutBillingAddress,
  ConnectionTokenResponse,
  CreatePaymentIntentResponse,
  CapturePaymentIntentResponse,
  StripeLocation,
  CustomerRequest,
  Customer
} from "./context";
import { Reader } from "@stripe/terminal-js";
import {
  MethodOptions,
  UserError,
  SessionExpiredError,
  ForbiddenError
} from "@/shared/methods/bigcommerce";
import {
  PaymentMethodResponse,
  PaymentAccessTokenResponse,
  ProcessPaymentRequest
} from "@/shared/types/big-commerce/payment";
import { ProcessCashPaymentRequest } from "@/shared/types/requests";
import { ErrorResponse, CompletedPaymentResponse } from "@/shared/types/response";
import type { OrderResponse } from "@/types/big-commerce/orders";

const apiUri = "/api";

export type GetCartFunction = (
  cartId: string,
  options: MethodOptions
) => Promise<Cart | ErrorResponse>;

export type CreateCartFunction = (
  cartToCreate: CreateCart,
  options: MethodOptions
) => Promise<Cart | ErrorResponse | null>;

export type UpdateCartCustomerIdFunction = (
  cartId: string,
  customerId: number,
  options: MethodOptions
) => Promise<Cart | ErrorResponse>;

export type DeleteCartFunction = (
  cartId: string,
  options: MethodOptions
) => Promise<ErrorResponse | void>;

export type AddCartLineItemsFunction = (
  cartId: string,
  cartItems: CartLineItem[],
  options: MethodOptions
) => Promise<Cart | ErrorResponse>;

export type UpdateCartLineItemFunction = (
  cartId: string,
  cartItem: CartLineItem,
  options: MethodOptions
) => Promise<Cart | ErrorResponse>;

export type DeleteCartLineItemFunction = (
  cartId: string,
  cartItem: CartLineItem,
  options: MethodOptions
) => Promise<Cart | ErrorResponse | void>;

export type AddConsignmentFunction = (
  cartId: string,
  consignments: ConsignmentRequest[],
  options: MethodOptions
) => Promise<Checkout | ErrorResponse>;

export type UpdateConsignmentFunction = (
  cartId: string,
  consignmentId: string,
  consignment: UpdateConsignmentRequest,
  options: MethodOptions
) => Promise<Checkout | ErrorResponse>;

export type DeleteConsignmentFunction = (
  cartId: string,
  consignmentId: string,
  options: MethodOptions
) => Promise<Checkout | ErrorResponse>;

export type AddBillingAddressFunction = (
  cartId: string,
  billingAddress: CheckoutBillingAddress,
  options: MethodOptions
) => Promise<Checkout | ErrorResponse>;

export type GetAcceptedPaymentMethodsFunction = (
  checkoutId: string,
  orderId: number,
  options: MethodOptions
) => Promise<PaymentMethodResponse | ErrorResponse>;

export type CreatePaymentAccessTokenFunction = (
  orderId: number,
  isRecurring: boolean,
  options: MethodOptions
) => Promise<PaymentAccessTokenResponse | ErrorResponse>;

export type ProcessManualPaymentFunction = (
  orderId: number,
  payment: ProcessPaymentRequest,
  paymentAccessToken: string,
  options: MethodOptions
) => Promise<CompletedPaymentResponse | ErrorResponse>;

export type ProcessCashPaymentFunction = (
  payment: ProcessCashPaymentRequest,
  options: MethodOptions
) => Promise<CompletedPaymentResponse | ErrorResponse>;

export type CreateOrderFunction = (
  cartId: string,
  options: MethodOptions
) => Promise<number | ErrorResponse>;

export type GetConnectionTokenFunction = (
  options: MethodOptions
) => Promise<ConnectionTokenResponse | null>;
export type GetLocationsFunction = (options: MethodOptions) => Promise<StripeLocation[]>;
export type GetReadersFunction = (locationId: string, options: MethodOptions) => Promise<Reader[]>;

export type CreatePaymentIntentFunction = (
  orderId: number,
  amount: number,
  options: MethodOptions
) => Promise<CreatePaymentIntentResponse | null>;

export type CapturePaymentIntentFunction = (
  paymentIntentId: string,
  options: MethodOptions
) => Promise<CapturePaymentIntentResponse | null>;

export type CreateCustomerFunction = (
  customer: CustomerRequest,
  options: MethodOptions
) => Promise<Customer | ErrorResponse>;

export type GetCustomersFunction = (
  nameSearchValue: string,
  options: MethodOptions
) => Promise<any | ErrorResponse>;

export type UpdateCustomerFunction = (
  customer: CustomerRequest,
  options: MethodOptions
) => Promise<Customer | ErrorResponse>;

export type RemoveCustomerFunction = () => void;

export type AddOrderNotesFunction = (orderNotes: string, options: MethodOptions) => Promise<string>;
export type UpdateOrderNotesFunction = (
  orderNotes: string,
  options: MethodOptions
) => Promise<string>;
export type RemoveOrderNotesFunction = (orderNotes: string, options: MethodOptions) => void;
export type AddUpdateOrderNotesToOrderFunction = (
  orderId: number,
  orderNotes: string,
  options: MethodOptions
) => Promise<OrderResponse | ErrorResponse>;
export type RemoveOrderNotesFromOrderFunction = (
  orderId: number,
  options: MethodOptions
) => Promise<OrderResponse | ErrorResponse>;

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

/**
 * Get the cart
 * https://developer.bigcommerce.com/api-reference/eb3777c8094b0-get-a-cart
 * @param cartId      string  Required. The cart ID
 * @param accessToken string  Required. The authorization token
 * @returns the Cart
 */
export const getCartMethod: GetCartFunction = async (cartId, { access_token }) => {
  const url = `${apiUri}/cart/${cartId}`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<Cart | ErrorResponse>;
  });
};

/**
 * Create a cart
 * https://developer.bigcommerce.com/api-reference/20c2c55c1763f-create-a-cart
 * @param cart        CreateCart  Required. The cart to create
 * @param accessToken string      Required. The authorization token
 * @returns the Cart
 */
export const createCartMethod: CreateCartFunction = (cartToCreate, { access_token }) => {
  const url = `${apiUri}/cart`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cartToCreate)
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<Cart>;
  });
};

/**
 * Update customer ID associated with a cart
 * Changing the Cart customer_id will remove any promotions or shipping on the Cart.
 * These are tied to the customer depending on cart conditions and any customer groups.
 * https://developer.bigcommerce.com/api-reference/3c3bd669000e7-update-customer-id
 * @param cartId      string  Required. The cart ID
 * @param accessToken string  Required. The authorization token
 * @returns the Cart
 */
export const updateCartCustomerIdMethod: UpdateCartCustomerIdFunction = async (
  cartId,
  customerId,
  { access_token }
) => {
  const url = `${apiUri}/cart/${cartId}`;
  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ customer_id: customerId })
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<Cart>;
  });
};

/**
 * Delete a cart
 * https://developer.bigcommerce.com/api-reference/9ce57d21efb62-delete-a-cart
 * @param cartId      string  Required. The cart ID
 * @param accessToken string
 * @returns void
 */
export const deleteCartMethod: DeleteCartFunction = async (cartId, { access_token }) => {
  const url = `${apiUri}/cart/${cartId}`;
  return fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    }
  }).then(async response => {
    //console.log(`Deleted cart id :: ${cartId} :: response text :: ${response.text}`);
  });
};

/**
 * Create a cart
 * https://developer.bigcommerce.com/api-reference/20c2c55c1763f-create-a-cart
 * @param cartId      string  Required. The cart ID
 * @param accessToken string  Required. The authorization token
 * @returns the Cart
 */
export const addCartLineItemsMethod: AddCartLineItemsFunction = async (
  cartId,
  cartItems,
  { access_token }
) => {
  const url = `${apiUri}/cart/${cartId}/items`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cartItems)
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<Cart>;
  });
};

/**
 * Update cart line item
 * Changing the Cart customer_id will remove any promotions or shipping on the Cart.
 * These are tied to the customer depending on cart conditions and any customer groups.
 * https://developer.bigcommerce.com/api-reference/3c3bd669000e7-update-customer-id
 * @param cartId      string  Required. The cart ID
 * @param itemId      string  Required. The cart line item ID
 * @param accessToken string  Required. The authorization token
 * @returns the Cart
 */
export const updateCartLineItemMethod: UpdateCartLineItemFunction = async (
  cartId,
  itemId,
  accessToken
) => {
  const url = `${apiUri}/cart/${cartId}/items`;
  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(itemId)
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<Cart>;
  });
};

/**
 * Delete a cart line item
 * https://developer.bigcommerce.com/api-reference/6ccaf4fd5d56a-delete-cart-line-item
 * @param cartId      string  Required. The cart ID
 * @param itemId      string  Required. The cart line item ID
 * @param accessToken string  Required. The authorization token
 * @returns void
 */
export const deleteCartLineItemMethod: DeleteCartLineItemFunction = async (
  cartId,
  itemId,
  accessToken
) => {
  const url = `${apiUri}/cart/${cartId}/items`;

  return fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(itemId)
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<Cart>;
  });
};

/**
 * Add a consignment
 * https://developer.bigcommerce.com/api-reference/dfbf31248722d-add-consignment-to-checkout
 * @param cartId      string  Required. The cart ID
 * @param consignment Consignment  Required. The consignment to add
 * @param accessToken string      Required. The authorization token
 * @returns the Cart
 */
export const addConsignmentMethod: AddConsignmentFunction = (
  cartId,
  consignments,
  { access_token }
) => {
  const url = `/api/checkout/${cartId}/consignment`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(consignments)
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<Checkout>;
  });
};

/**
 * Update a consignment
 * https://developer.bigcommerce.com/api-reference/fea1832a96623-update-checkout-consignment
 * @param cartId             string                    Required. The cart ID
 * @param consignmentId      string                    Required. The consignment ID
 * @param consignment        UpdateConsignmentRequest  Required. The consignment to update
 * @param accessToken        string                    Required. The authorization token
 * @returns the Cart
 */
export const updateConsignmentMethod: UpdateConsignmentFunction = (
  cartId,
  consignmentId,
  consignment,
  { access_token }
) => {
  const url = `/api/checkout/${cartId}/consignment`;

  // Update consignment with selected shipping option
  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ consignmentId: consignmentId, consignment: consignment })
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<Checkout>;
  });
};

/**
 * Delete a consignment
 * https://developer.bigcommerce.com/api-reference/fea1832a96623-update-checkout-consignment
 * @param cartId        string  Required. The cart ID
 * @param consignmentId string  Required. The consignment ID
 * @param accessToken   string  Required. The authorization token
 * @returns the Cart
 */
export const deleteConsignmentMethod: DeleteConsignmentFunction = (
  cartId,
  consignmentId,
  { access_token }
) => {
  const url = `/api/checkout/${cartId}/consignment`;
  return fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(consignmentId)
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<Checkout>;
  });
};

/**
 * Add billing address
 */
export const addBillingAddressMethod: AddBillingAddressFunction = (
  cartId,
  billingAddress,
  { access_token }
) => {
  const url = `/api/checkout/${cartId}/billing-address`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(billingAddress)
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<Checkout>;
  });
};

/**
 * Get accepted payment methods
 * @param request AcceptedPaymentMethodsRequest
 * @returns PaymentMethodResponse
 */
export const getAcceptedPaymentMethodsMethod: GetAcceptedPaymentMethodsFunction = (
  checkoutId,
  orderId,
  { access_token }
) => {
  const url = `${apiUri}/payment?checkoutId=${checkoutId}&orderId=${orderId}`;
  return fetch(url, {
    headers: {
      method: "GET",
      Authorization: `Bearer ${access_token}`
    }
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<PaymentMethodResponse | ErrorResponse>;
  });
};

/**
 * Create payment access token
 * @returns
 */
export const createPaymentAccessTokenMethod: CreatePaymentAccessTokenFunction = (
  orderId,
  isRecurring,
  { access_token }
) => {
  const url = `${apiUri}/payment`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ orderId: orderId, isRecurring: isRecurring })
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<PaymentAccessTokenResponse | ErrorResponse>;
  });
};

/**
 * Process manual payment method
 * @returns
 */
export const processManualPaymentMethod: ProcessManualPaymentFunction = (
  orderId,
  payment,
  paymentAccessToken,
  { access_token }
) => {
  const url = `${apiUri}/payment/process-manual-payment`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      orderId: orderId,
      payment: payment,
      paymentAccessToken: paymentAccessToken
    })
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<CompletedPaymentResponse | ErrorResponse>;
  });
};

/**
 * Process cash payment method
 * @returns
 */
export const processCashPaymentMethod: ProcessCashPaymentFunction = (payment, { access_token }) => {
  const url = `${apiUri}/payment/process-cash-payment`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payment)
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<CompletedPaymentResponse | ErrorResponse>;
  });
};

/**
 * Create order
 */
export const createOrderMethod: CreateOrderFunction = (cartId, { access_token }) => {
  const url = `/api/checkout/${cartId}/create-order`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    }
  }).then(async response => {
    const res = await handleResponse(response);
    return res.id as Promise<number>;
  });
};

export const getConnectionTokenMethod: GetConnectionTokenFunction = ({ access_token }) => {
  return fetch(`/api/stripe/connection-token`, {
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
    return response.json() as Promise<ConnectionTokenResponse | null>;
  });
};

export const getLocationsMethod: GetLocationsFunction = ({ access_token }) => {
  return fetch(`/api/stripe/locations`, {
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
    return response.json() as Promise<StripeLocation[] | null>;
  });
};

export const getReadersMethod: GetReadersFunction = (locationId, { access_token }) => {
  return fetch(`/api/stripe/readers`, {
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
    return response.json() as Promise<Reader[] | null>;
  });
};

export const createPaymentIntentMethod: CreatePaymentIntentFunction = (
  orderId,
  amount,
  { access_token }
) => {
  return fetch(`/api/stripe/create-payment-intent`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ orderId, amount })
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
    return response.json() as Promise<CreatePaymentIntentResponse>;
  });
};

export const capturePaymentIntentMethod: CapturePaymentIntentFunction = (
  paymentIntentId,
  { access_token }
) => {
  return fetch(`/api/stripe/capture-payment-intent`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ paymentIntentId })
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
    return response.json() as Promise<CapturePaymentIntentResponse>;
  });
};

export const createCustomerMethod: CreateCustomerFunction = (customer, { access_token }) => {
  const url = `${apiUri}/customers`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([customer])
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<Customer | ErrorResponse>;
  });
};

export const getCustomersMethod: GetCustomersFunction = (nameSearchValue, { access_token }) => {
  const url = `${apiUri}/customers?name:like=${nameSearchValue}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    }
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<any | ErrorResponse>;
  });
};

export const updateCustomerMethod: UpdateCustomerFunction = (customer, { access_token }) => {
  const url = `${apiUri}/customers`;
  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([customer])
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<Customer | ErrorResponse>;
  });
};

export const addUpdateOrderNotesToOrderMethod: AddUpdateOrderNotesToOrderFunction = (
  orderId,
  orderNotes,
  { access_token }
) => {
  const url = `${apiUri}/orders/${orderId}`;
  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ staff_notes: orderNotes })
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<OrderResponse | ErrorResponse>;
  });
};

export const removeOrderNotesFromOrderMethod: RemoveOrderNotesFromOrderFunction = (
  orderId,
  { access_token }
) => {
  const url = `${apiUri}/orders/${orderId}`;
  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ staff_notes: "" })
  }).then(async response => {
    const res = await handleResponse(response);
    return res as Promise<OrderResponse | ErrorResponse>;
  });
};
