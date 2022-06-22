import type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  TaxProviderId
} from "@/shared/enums/OrderTypes";
import type { Prices } from "@/backend/services/bigcommerce/graphql/queries/getProducts";

type CatalogProduct = {
  entityId: number;
  sku: string;
  name: string;
  plainTextDescription?: string;
  availabilityV2?: { status: string; description: string };
  brand?: { name: string };
  reviewSummary?: { summationOfRatings: number; numberOfReviews: number };
  defaultImage?: { url1280wide: string; altText: string };
  price: number;
  prices: Prices;
  quantity: number;
  productOptions?: [];
  selectedProductOptions?: {
    id: number;
    value: string;
    displayName: string;
    label: string;
  }[];
  taxable: boolean;
  notes?: string;
};

type ShippingAddress = {
  first_name: string;
  last_name: string;
  street_1: string;
  street_2: string;
  city: string;
  state: string;
  country: string;
  country_iso2: string;
  email: string;
  zip: number;
  phone: number;
  company: string;
  shipping_method?: string;
};

type AddressFormField = {
  name: string;
  value: string;
};

type BillingAddress = {
  first_name?: string;
  last_name?: string;
  street_1?: string;
  street_2?: string;
  city?: string;
  state?: string;
  country?: string;
  country_iso2?: string;
  email?: string;
  zip: string;
  phone?: number;
  company?: string;
  form_fields?: AddressFormField[];
};

type CreateOrderProduct = {
  name: string;
  name_customer?: string;
  name_merchant?: string;
  quantity: number;
  price_inc_tax: number;
  price_ex_tax: number;
  upc?: string;
  sku: string;
};

/**
 * UpdateOrderProduct
 * @param id number  Optional. The order product id.
 * To add a product to an existing order, don't include id in the payload.
 * id is required when updating an order product.
 * @param product_options array[object]  Optional. List of product variant options and modifiers.
 * product_options are required when adding a product with variants and not specifying
 * the variant_id, or when products have mandatory modifiers.
 * @link https://developer.bigcommerce.com/api-reference/d140040bfe6ef-update-an-order
 */
type UpdateOrderProduct = {
  id: number;
  product_id: number;
  name: string;
  name_customer?: string;
  name_merchant?: string;
  product_options: [];
  quantity: number;
  price_inc_tax: number;
  price_ex_tax: number;
  upc?: string;
  variant_id: number;
  wrapping_name: string;
  wrapping_message: string;
  wrapping_cost_ex_tax: number;
  wrapping_cost_inc_tax: number;
};

type CreateOrderBody = {
  products: CreateOrderProduct[];
  shipping_addresses?: ShippingAddress[];
  base_handling_cost?: string;
  base_shipping_cost?: string;
  base_wrapping_cost?: string | number;
  billing_address: BillingAddress;
  channel_id?: number;
  customer_id?: number;
  customer_message?: string;
  date_created?: string;
  default_currency_code?: string;
  discount_amount?: string;
  ebay_order_id?: string;
  external_id?: any;
  external_merchant_id?: any;
  external_source?: any;
  geoip_country?: string;
  geoip_country_iso2?: string;
  handling_cost_ex_tax?: string;
  handling_cost_inc_tax?: string;
  ip_address?: string;
  ip_address_v6?: string;
  is_deleted?: boolean;
  items_shipped?: number;
  items_total?: number;
  order_is_digital?: boolean;
  payment_method?: PaymentMethod;
  payment_provider_id?: string | number;
  refunded_amount?: string;
  shipping_cost_ex_tax?: string;
  shipping_cost_inc_tax?: string;
  staff_notes?: string;
  status_id?: OrderStatus;
  subtotal_ex_tax?: string;
  subtotal_inc_tax?: string;
  tax_provider_id?: TaxProviderId;
  customer_locale?: string;
  total_ex_tax?: string;
  total_inc_tax?: string;
  wrapping_cost_ex_tax?: string;
  wrapping_cost_inc_tax?: string;
};

type UpdateOrderBody = {
  products?: UpdateOrderProduct[];
  shipping_addresses?: ShippingAddress[];
  base_handling_cost?: string;
  base_shipping_cost?: string;
  base_wrapping_cost?: string | number;
  billing_address?: BillingAddress;
  channel_id?: number;
  customer_id?: number;
  customer_message?: string;
  date_created?: string;
  default_currency_code?: string;
  discount_amount?: string;
  ebay_order_id?: string;
  external_id?: any;
  external_merchant_id?: any;
  external_source?: any;
  geoip_country?: string;
  geoip_country_iso2?: string;
  handling_cost_ex_tax?: string;
  handling_cost_inc_tax?: string;
  ip_address?: string;
  ip_address_v6?: string;
  is_deleted?: boolean;
  items_shipped?: number;
  items_total?: number;
  order_is_digital?: boolean;
  payment_method?: PaymentMethod;
  payment_provider_id?: string | number;
  refunded_amount?: string;
  shipping_cost_ex_tax?: string;
  shipping_cost_inc_tax?: string;
  staff_notes?: string;
  status_id?: OrderStatus;
  subtotal_ex_tax?: string;
  subtotal_inc_tax?: string;
  tax_provider_id?: TaxProviderId;
  customer_locale?: string;
  total_ex_tax?: string;
  total_inc_tax?: string;
  wrapping_cost_ex_tax?: string;
  wrapping_cost_inc_tax?: string;
};

type ApiResource = {
  url: string;
  resource: string;
};

type OrderResponse = {
  id: number;
  date_modified: string;
  date_shipped: string;
  cart_id: string;
  status: string;
  subtotal_tax: string;
  shipping_cost_tax: string;
  shipping_cost_tax_class_id: number;
  handling_cost_tax: string;
  handling_cost_tax_class_id: number;
  wrapping_cost_tax: string;
  wrapping_cost_tax_class_id: number;
  payment_status: PaymentStatus;
  store_credit_amount: string;
  gift_certificate_amount: string;
  currency_id: number;
  currency_code: string;
  currency_exchange_rate: string;
  default_currency_id: number;
  default_currency_code: string;
  store_default_currency_code: string;
  store_default_to_transactional_exchange_rate: string;
  coupon_discount: string;
  shipping_address_count: number;
  is_email_opt_in: boolean;
  order_source: string;
  products: ApiResource;
  shipping_addresses: ApiResource;
  coupons: ApiResource;
  status_id: OrderStatus;
  base_handling_cost: string;
  base_shipping_cost: string;
  base_wrapping_cost: string | number;
  billing_address: BillingAddress;
  channel_id: number;
  customer_id: number;
  customer_message: string;
  date_created: string;
  discount_amount: string;
  ebay_order_id: string;
  external_id: string | any;
  external_merchant_id: string | any;
  external_source: string | any;
  geoip_country: string;
  geoip_country_iso2: string;
  handling_cost_ex_tax: string;
  handling_cost_inc_tax: string;
  ip_address: string;
  ip_address_v6: string;
  is_deleted: boolean;
  items_shipped: number;
  items_total: number;
  order_is_digital: boolean;
  payment_method: PaymentMethod;
  payment_provider_id: string | number;
  refunded_amount: string;
  shipping_cost_ex_tax: string;
  shipping_cost_inc_tax: string;
  staff_notes: string;
  subtotal_ex_tax: string;
  subtotal_inc_total: string;
  tax_provider_id: TaxProviderId;
  customer_locale: string;
  total_ex_tax: string;
  total_inc_tax: string;
  wrapping_cost_ex_tax: string;
  wrapping_cost_inc_tax: string;
};
