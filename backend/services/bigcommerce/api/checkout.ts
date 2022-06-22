import { Injectable } from "@/backend/decorators/Injectable";
import {
  Checkout,
  CheckoutBillingAddress,
  ConsignmentRequest,
  CreateOrderResponse,
  UpdateConsignmentRequest
} from "@/frontend/providers/CartProvider";
import BigBaseApi from "./big-base-api";

@Injectable()
export default class CheckoutAPI extends BigBaseApi {
  private baseUri: string;
  private uriIncludes: string;

  constructor() {
    // set api version
    super("v3");
    this.baseUri = "/checkouts";
    this.uriIncludes = "?include=consignments.available_shipping_options";
  }
  /**
   * Add a consignment
   * @returns the checkout object
   */
  async addConsignment(checkoutId: string, consignments: ConsignmentRequest[]): Promise<Checkout> {
    const { data } = await this.client.post(
      `${this.baseUri}/${checkoutId}/consignments${this.uriIncludes}`,
      consignments
    );
    return data.data;
  }

  /**
   * Update a consignment
   * @returns the checkout object
   */
  async updateConsignment(
    checkoutId: string,
    consignmentId: string,
    consignment: UpdateConsignmentRequest
  ): Promise<Checkout> {
    const { data } = await this.client.put(
      `${this.baseUri}/${checkoutId}/consignments/${consignmentId}${this.uriIncludes}`,
      consignment
    );
    return data.data;
  }

  /**
   * Delete a consignment
   */
  async deleteConsignment(checkoutId: string, consignmentId: string): Promise<void> {
    await this.client.delete(
      `${this.baseUri}/${checkoutId}/consignments/${consignmentId}${this.uriIncludes}`
    );
  }

  /**
   * Add checkout billing address
   */
  async addBillingAddress(
    checkoutId: string,
    billingAddress: CheckoutBillingAddress
  ): Promise<Checkout> {
    const { data } = await this.client.post(
      `${this.baseUri}/${checkoutId}/billing-address`,
      billingAddress
    );
    return data.data;
  }

  /**
   * Update checkout billing address
   
  async updateBillingAddress(checkoutId: string, billingAddress: any): Promise<Checkout> {
    const { data } = await this.client.put(
      `${this.baseUri}/${checkoutId}/billing_address${this.uriIncludes}`,
      billingAddress
    );
    return data.data;
  }
  */

  /**
   * Create order
   * @param checkoutId  Required. The checkout ID
   * @returns CreateOrderResponse
   */
  async createOrder(checkoutId: string): Promise<CreateOrderResponse> {
    const { data } = await this.client.post(`${this.baseUri}/${checkoutId}/orders`);
    return data.data;
  }
}
