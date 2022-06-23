import { createContext, useContext } from "react";
import { StoreAddress } from "@/frontend/providers/SettingsProvider";
import { ProcessCashPaymentRequest } from "@/shared/types/requests";
import { ErrorResponse, CompletedPaymentResponse } from "@/shared/types/response";
import {
  PaymentAccessTokenResponse,
  PaymentMethodResponse,
  ProcessPaymentRequest
} from "@/types/big-commerce/payment";
import { OrderResponse } from "@/types/big-commerce/orders";
import { Reader } from "@stripe/terminal-js";

export type GetCartAction = (cartId: string) => Promise<Cart | ErrorResponse | null>;
export type CreateCartAction = (cartToCreate: CreateCart) => Promise<Cart | ErrorResponse | null>;
export type UpdateCartCustomerIdAction = (
  cartId: string,
  customerId: number
) => Promise<Cart | ErrorResponse | null>;
export type DeleteCartAction = (cartId: string) => Promise<Cart | ErrorResponse | null>;
export type ClearCartCheckoutFunction = () => void;
export type AddCartLineItemsAction = (
  cartId: string,
  lineItems: CartLineItem[]
) => Promise<Cart | ErrorResponse | null>;
export type UpdateCartLineItemAction = (
  cartId: string,
  itemId: string
) => Promise<Cart | ErrorResponse | null>;
export type DeleteCartLineItemAction = (
  cartId: string,
  itemId: string
) => Promise<Cart | ErrorResponse | null>;
export type AddConsignmentAction = (
  cartId: string,
  consignments: ConsignmentRequest[]
) => Promise<Checkout | ErrorResponse>;
export type UpdateConsignmentAction = (
  cartId: string,
  consignmentId: string,
  consignments: UpdateConsignmentRequest
) => Promise<Checkout | ErrorResponse>;
export type DeleteConsignmentAction = (
  cartId: string,
  consignmentId: string
) => Promise<Checkout | ErrorResponse>;
export type AddBillingAddressAction = (
  cartId: string,
  billingAddress: CheckoutBillingAddress
) => Promise<Checkout | ErrorResponse>;
export type GetAcceptedPaymentMethodsAction = (
  checkoutId: string,
  orderId: number
) => Promise<PaymentMethodResponse[]>;
export type CreatePaymentAccessTokenAction = (
  orderId: number,
  isRecurring: boolean
) => Promise<PaymentAccessTokenResponse>;
export type ProcessManualPaymentAction = (
  orderId: number,
  payment: ProcessPaymentRequest,
  paymentAccessToken: string
) => Promise<CompletedPaymentResponse>;
export type ProcessCashPaymentAction = (
  payment: ProcessCashPaymentRequest
) => Promise<CompletedPaymentResponse>;
export type InitCheckoutFunction = (
  shipAddress: StoreAddress,
  storeEmail: string
) => Promise<number | ErrorResponse>;
export type CreateOrderAction = (cartId) => Promise<number | ErrorResponse>;
export type GetLocationsAction = () => Promise<StripeLocation[]>;
export type GetReadersAction = (locationId: string) => Promise<Reader[]>;
export type SetReaderAction = (reader: Reader) => Promise<Reader | null>;

/*
export type SetReaderDisplayAction = (
  displayInfo: ISetReaderDisplayRequest
) => Promise<ISetReaderDisplayResponse | null>;
*/
export type CollectTerminalPaymentFunction = () => void;
export type StopCollectingTerminalPaymentFunction = () => void;
export type ClearLocationsAction = () => Promise<null>;
export type ClearReadersAction = () => Promise<null>;
export type ClearReaderAction = () => Promise<null>;
export type ClearErrorsAction = () => Promise<null>;

export type CreateCustomerAction = (customer: CustomerRequest) => Promise<Customer | ErrorResponse>;
export type GetCustomersAction = (nameSearchValue: string) => Promise<any | ErrorResponse | null>;
export type SetActiveCustomerAction = (customer: Customer) => void;
export type ClearCustomersLookupResultAction = () => void;
export type UpdateCustomerAction = (customer: CustomerRequest) => Promise<Customer | ErrorResponse>;
export type RemoveCustomerAction = () => void;
export type OpenCustomerTabFunction = (action: string) => void;

export type AddOrderNotesFunction = (orderNote: string) => string;
export type UpdateOrderNotesFunction = (orderNote: string) => string;
export type RemoveOrderNotesFunction = () => void;
export type OpenOrderNotesTabFunction = (action: string) => void;
export type AddUpdateOrderNotesToOrderAction = (
  orderId: number,
  orderNote: string
) => Promise<OrderResponse | ErrorResponse>;
export type RemoveOrderNotesFromOrderAction = (
  orderId: number
) => Promise<OrderResponse | ErrorResponse>;

export interface CustomerRequest {
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  phone?: string;
  notes?: string;
  tax_exempt_category?: string;
  customer_group_id?: number;
  addresses?: CustomerAddressRequest[];
  authentication?: CustomerAuthentication;
  accepts_product_review_abandoned_cart_emails?: boolean;
  store_credit_amounts?: StoreCreditAmount[];
  origin_channel_id?: number;
  channel_ids?: number[];
  form_fields: FormField[];
}

export interface CustomerAddressRequest {
  address1: string;
  address2: string;
  address_type: string;
  city: string;
  company: string;
  country_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  postal_code: string;
  state_or_province: string;
  form_fields: FormField[];
}

export interface Customer {
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  phone: string;
  registration_ip_address: string;
  notes: string;
  tax_exempt_category: string;
  customer_group_id: number;
  id: number;
  date_modified: string;
  date_created: string;
  address_count: number;
  attribute_count: number;
  authentication: CustomerAuthentication;
  addresses: CustomerAddress[];
  attributes: CustomerAttribute[];
  form_fields: FormField[];
  store_credit_amounts: StoreCreditAmount[];
  accepts_product_review_abandoned_cart_emails: boolean;
  origin_channel_id: number;
  channel_ids: number[];
}

export interface CustomerAddress {
  first_name: string;
  last_name: string;
  address1: string;
  address2: string;
  city: string;
  state_or_province: string;
  postal_code: string;
  country_code: string;
  phone: string;
  address_type: string;
  customer_id: number;
  id: number;
  country: string;
}

export interface CustomerAttribute {
  attribute_id: number;
  attribute_value: string;
  customer_id: number;
  date_created: string;
  date_modified: string;
  id: number;
}

export interface FormField {
  name: string;
  value: string;
}

export interface CustomerAuthentication {
  force_password_reset: boolean;
  new_password?: string;
}

export interface StoreCreditAmount {
  amount: number;
}

export type ConsignmentRequest = {
  address: ConsignmentAddress;
  line_items: ConsignmentLineItem[];
};

export type UpdateConsignmentRequest = {
  address?: ConsignmentAddress;
  line_items?: ConsignmentLineItem[];
  shipping_option_id?: string;
};

export interface Consignment {
  id: string;
  shipping_cost_inc_tax: number;
  shipping_cost_ex_tax: number;
  handling_cost_inc_tax: number;
  handling_cost_ex_tax: number;
  coupon_discounts: any[];
  discounts: any[];
  line_item_ids: string[];
  address: ConsignmentAddress;
  available_shipping_options: ConsignmentAvailableShippingOption[];
}

export interface ConsignmentAddress {
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state_or_province?: string;
  state_or_province_code?: string;
  postal_code: string;
  country_code: string;
  phone?: string;
  custom_fields?: CustomField[];
}

export interface ConsignmentAvailableShippingOption {
  id: string;
  type: string;
  description: string;
  image_url: string;
  cost: number;
  transit_time: string;
  additional_description: string;
}

/**
 * Consignment line item
 * @type item_id string  Required. Corresponds to line_items.physical_items[N].id value from GET checkout response.
 * @type quantity number  Required.
 */
export type ConsignmentLineItem = {
  item_id: string;
  quantity: number;
};
export type Checkout = {
  id: string;
  cart: Cart;
  billing_address: CheckoutBillingAddress;
  consignments: Consignment[];
  taxes: Tax[];
  coupons: any[];
  order_id: null;
  shipping_cost_total_inc_tax: number;
  shipping_cost_total_ex_tax: number;
  handling_cost_total_inc_tax: number;
  handling_cost_total_ex_tax: number;
  tax_total: number;
  subtotal_inc_tax: number;
  subtotal_ex_tax: number;
  grand_total: number;
  created_time: Date;
  updated_time: Date;
  customer_message: string;
};

export interface CheckoutBillingAddress {
  id?: string;
  first_name?: null | string;
  last_name?: null | string;
  email: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state_or_province?: string;
  state_or_province_code?: string;
  country?: string;
  country_code: string;
  postal_code?: null | string;
  phone?: null | string;
  custom_fields?: CustomField[];
}

export interface CustomField {
  field_id: string;
  field_value: string;
}

export interface Tax {
  name: string;
  amount: number;
}

/**
 * Due to the binary nature of their encoding, some decimal numbers
 * cannot be represented with perfect accuracy. This is analagous to
 * how the fraction 1/3 cannot be accurately represented with a
 * decimal number with a finite number of digits.
 * The Solution: An Int Type
 * */
export type Int = number & { __int__: void };

export type CartDiscounts = {
  id: string;
  discounted_amount: number;
};

export type CartCoupons = {
  code: string;
  id: string;
  coupon_type: string;
  discounted_amount: number;
};

export type CreateCart = {
  customer_id?: Int;
  line_items: CartLineItem[];
  custom_items?: CartCustomItems[];
  gift_certificates?: CartGiftCertificates[];
  channel_id?: Int;
  currency?: CartCurrency;
  locale?: string;
};

export type CartLineItem = {
  quantity: number;
  product_id: number;
  list_price?: number;
  variant_id?: number;
  name?: string;
  gift_wrapping?: CartGiftWrapping;
  option_selections?: CartOptionSelections[];
};

export type CartOptionSelections = {
  option_id: number;
  option_value: number;
};

export type CartGiftWrapping = {
  wrap_together: boolean;
  wrap_details: [
    {
      id: number;
      message: string;
    }
  ];
};

export type CartCustomItems = {
  sku: string;
  name: string;
  quantity: number;
  list_price: number;
};

export type CartGiftCertificates = {
  name: string;
  theme: string;
  amount: number;
  quantity: Int;
  sender: {
    name: string;
    email: string;
  };
  recipient: {
    name: string;
    email: string;
  };
  message: string;
};

export type CartCurrency = {
  code: string; // string <ISO-4217>
};

/**
 * API response for cart
 * This one matches the response from the api
 */
export type Cart = {
  id: string;
  customer_id: number;
  channel_id: number;
  email: string;
  currency: CartCurrency;
  tax_included: boolean;
  base_amount: number;
  discount_amount: number;
  cart_amount: number;
  coupons: any[];
  line_items: LineItems;
  created_time: string;
  updated_time: string;
  locale: string;
};

export type LineItems = {
  physical_items: PhysicalItem[];
  digital_items: any[];
  gift_certificates: any[];
  custom_items: any[];
};

export type PhysicalItem = {
  id: string;
  parent_id: any;
  variant_id: number;
  product_id: number;
  sku: string;
  name: string;
  options: CartPhysicalItemOptions[];
  url: string;
  quantity: number;
  taxable: boolean;
  image_url: string;
  discounts: any[];
  coupons: any[];
  discount_amount: number;
  coupon_amount: number;
  list_price: number;
  sale_price: number;
  extended_list_price: number;
  extended_sale_price: number;
  is_require_shipping: boolean;
  is_mutable: boolean;
};

export type CartPhysicalItemOptions = {
  name: string;
  nameId: number;
  value: string;
  valueId: number;
};

export type CreateOrderResponse = {
  id: number;
};

export type ConnectionTokenResponse = {
  secret: string;
};

export type CreatePaymentIntentResponse = any;
export type CapturePaymentIntentResponse = any;

export type StripeLocationAddress = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
};

export type StripeLocation = {
  id: string;
  object: string;
  address: StripeLocationAddress;
  display_name: string;
  livemode: boolean;
  metadata: any;
};

export type StripeReader = {
  id: string;
  object: string;
  device_sw_version: string;
  device_type: string;
  ip_address: string;
  label: string;
  livemode: boolean;
  location: string;
  metadata: any;
  serial_number: string;
  status: string;
};

export type StripeReaderConnection = any;

export type CartLoadingStates = {
  getCart: boolean;
  createCart: boolean;
  updateCartCustomerId: boolean;
  deleteCart: boolean;
  addCartLineItems: boolean;
  updateCartLineItem: boolean;
  deleteCartLineItem: boolean;
  addConsignment: boolean;
  updateConsignment: boolean;
  deleteConsignment: boolean;
  addBillingAddress: boolean;
  getAcceptedPaymentMethods: boolean;
  createPaymentAccessToken: boolean;
  processManualPayment: boolean;
  processCashPayment: boolean;
  getLocations: boolean;
  getReaders: boolean;
  setReader: boolean;
  collectTerminalPayment: boolean;
  processTerminalPayment: boolean;
  captureTerminalPayment: boolean;
  createCustomer: boolean;
  getCustomers: boolean;
  updateCustomer: boolean;
  removeCustomer: boolean;
  addUpdateOrderNotesToOrder: boolean;
};

export type CartErrorStates = {
  getCart: ErrorResponse | Error | null;
  createCart: ErrorResponse | Error | null;
  updateCartCustomerId: ErrorResponse | Error | null;
  deleteCart: ErrorResponse | Error | null;
  addCartLineItems: ErrorResponse | Error | null;
  updateCartLineItem: ErrorResponse | Error | null;
  deleteCartLineItem: ErrorResponse | Error | null;
  addConsignment: ErrorResponse | Error | null;
  updateConsignment: ErrorResponse | Error | null;
  deleteConsignment: ErrorResponse | Error | null;
  addBillingAddress: ErrorResponse | Error | null;
  getAcceptedPaymentMethods: ErrorResponse | Error | [];
  createPaymentAccessToken: ErrorResponse | Error | null;
  processManualPayment: ErrorResponse | Error | null;
  processCashPayment: ErrorResponse | Error | null;
  getLocations: ErrorResponse | Error | null;
  getReaders: ErrorResponse | Error | null;
  setReader: ErrorResponse | Error | null;
  collectTerminalPayment: ErrorResponse | Error | null;
  processTerminalPayment: ErrorResponse | Error | null;
  captureTerminalPayment: ErrorResponse | Error | null;
  createCustomer: ErrorResponse | Error | null;
  updateCustomer: ErrorResponse | Error | null;
  removeCustomer: ErrorResponse | Error | null;
  addUpdateOrderNotesToOrder: ErrorResponse | Error | null;
};

export type CartState = {
  loaders: CartLoadingStates;
  errors: CartErrorStates;
  cart: Cart;
  checkout: Checkout;
  orderId: number;
  acceptedPaymentMethods: PaymentMethodResponse[];
  paymentAccessToken: PaymentAccessTokenResponse;
  completedPayment: CompletedPaymentResponse;
  locations: StripeLocation[];
  readers: Reader[];
  reader: Reader;
  customer: Customer;
  orderNotes: string;
  customersLookupResult: any;
};

export type CartActions = {
  getCart: GetCartAction;
  createCart: CreateCartAction;
  updateCartCustomerId: UpdateCartCustomerIdAction;
  deleteCart: DeleteCartAction;
  clearCartCheckout: ClearCartCheckoutFunction;
  addCartLineItems: AddCartLineItemsAction;
  updateCartLineItem: UpdateCartLineItemAction;
  deleteCartLineItem: DeleteCartLineItemAction;
  addConsignment: AddConsignmentAction;
  updateConsignment: UpdateConsignmentAction;
  deleteConsignment: DeleteConsignmentAction;
  addBillingAddress: AddBillingAddressAction;
  getAcceptedPaymentMethods: GetAcceptedPaymentMethodsAction;
  createPaymentAccessToken: CreatePaymentAccessTokenAction;
  processManualPayment: ProcessManualPaymentAction;
  processCashPayment: ProcessCashPaymentAction;
  initCheckout: InitCheckoutFunction;
  getLocations: GetLocationsAction;
  getReaders: GetReadersAction;
  setReader: SetReaderAction;
  collectTerminalPayment: CollectTerminalPaymentFunction;
  stopCollectingTerminalPayment: StopCollectingTerminalPaymentFunction;
  //setReaderDisplay: SetReaderDisplayAction;
  clearLocations: ClearLocationsAction;
  clearReaders: ClearReadersAction;
  clearReader: ClearReaderAction;
  clearErrors: ClearErrorsAction;
  createCustomer: CreateCustomerAction;
  getCustomers: GetCustomersAction;
  setActiveCustomer: SetActiveCustomerAction;
  clearCustomersLookupResult: ClearCustomersLookupResultAction;
  updateCustomer: UpdateCustomerAction;
  removeCustomer: RemoveCustomerAction;
  openCustomerTab: OpenCustomerTabFunction;
  addOrderNotes: AddOrderNotesFunction;
  updateOrderNotes: UpdateOrderNotesFunction;
  removeOrderNotes: RemoveOrderNotesFunction;
  openOrderNotesTab: OpenCustomerTabFunction;
  addUpdateOrderNotesToOrder: AddUpdateOrderNotesToOrderAction;
};

export type CartContextProps = {
  state: CartState;
  actions: CartActions;
};

// Keep loaders false on initialization as to not block SSR renders
export const CartContext = createContext<CartContextProps>({
  state: {
    loaders: {
      getCart: false,
      createCart: false,
      updateCartCustomerId: false,
      deleteCart: false,
      addCartLineItems: false,
      updateCartLineItem: false,
      deleteCartLineItem: false,
      addConsignment: false,
      updateConsignment: false,
      deleteConsignment: false,
      addBillingAddress: false,
      getAcceptedPaymentMethods: false,
      createPaymentAccessToken: false,
      processManualPayment: false,
      processCashPayment: false,
      getLocations: false,
      getReaders: false,
      setReader: false,
      collectTerminalPayment: false,
      processTerminalPayment: false,
      captureTerminalPayment: false,
      createCustomer: false,
      getCustomers: false,
      updateCustomer: false,
      removeCustomer: false,
      addUpdateOrderNotesToOrder: false
    },
    errors: {
      getCart: null,
      createCart: null,
      updateCartCustomerId: null,
      deleteCart: null,
      addCartLineItems: null,
      updateCartLineItem: null,
      deleteCartLineItem: null,
      addConsignment: null,
      updateConsignment: null,
      deleteConsignment: null,
      addBillingAddress: null,
      getAcceptedPaymentMethods: null,
      createPaymentAccessToken: null,
      processManualPayment: null,
      processCashPayment: null,
      getLocations: null,
      getReaders: null,
      setReader: null,
      collectTerminalPayment: null,
      processTerminalPayment: null,
      captureTerminalPayment: null,
      createCustomer: null,
      updateCustomer: null,
      removeCustomer: null,
      addUpdateOrderNotesToOrder: null
    },
    cart: null,
    checkout: null,
    orderId: 0,
    acceptedPaymentMethods: [],
    paymentAccessToken: null,
    completedPayment: null,
    locations: [],
    readers: [],
    reader: null,
    customer: null,
    orderNotes: null,
    customersLookupResult: null
  },
  actions: {
    getCart: cartId => Promise.resolve(null),
    createCart: cartToCreate => Promise.resolve(null),
    updateCartCustomerId: cartId => Promise.resolve(null),
    deleteCart: cartId => Promise.resolve(null),
    clearCartCheckout: () => {},
    addCartLineItems: (cartId, lineItems) => Promise.resolve(null),
    updateCartLineItem: (cartId, itemId) => Promise.resolve(null),
    deleteCartLineItem: (cartId, itemId) => Promise.resolve(null),
    addConsignment: (cartId, consignments) => Promise.resolve(null),
    updateConsignment: (cartId, consignmentId) => Promise.resolve(null),
    deleteConsignment: (cartId, consignmentId) => null,
    addBillingAddress: billingAddress => Promise.resolve(null),
    getAcceptedPaymentMethods: (checkoutId, orderId) => Promise.resolve([]),
    createPaymentAccessToken: (orderId, IsRecurring) => Promise.resolve(null),
    processManualPayment: payment => Promise.resolve(null),
    processCashPayment: payment => Promise.resolve(null),
    initCheckout: (storeAddress, storeEmail) => Promise.resolve(null),
    getLocations: () => Promise.resolve([]),
    getReaders: locationId => Promise.resolve([]),
    setReader: reader => Promise.resolve(null),
    collectTerminalPayment: () => Promise.resolve(null),
    stopCollectingTerminalPayment: () => {},
    //setReaderDisplay: displayInfo => Promise.resolve(null),
    clearLocations: () => Promise.resolve(null),
    clearReaders: () => Promise.resolve(null),
    clearReader: () => Promise.resolve(null),
    clearErrors: () => Promise.resolve(null),
    createCustomer: customer => Promise.resolve(null),
    getCustomers: nameSearchValue => Promise.resolve(null),
    setActiveCustomer: customer => {},
    clearCustomersLookupResult: () => {},
    updateCustomer: customer => Promise.resolve(null),
    removeCustomer: () => Promise.resolve(null),
    openCustomerTab: () => {},
    addOrderNotes: orderNote => null,
    updateOrderNotes: orderNote => null,
    removeOrderNotes: () => {},
    openOrderNotesTab: () => {},
    addUpdateOrderNotesToOrder: (orderId, orderNotes) => Promise.resolve(null)
  }
});

CartContext.displayName = "CartContext";

export function useCartContext() {
  const context = useContext(CartContext);
  return context;
}
