import { Injectable } from "@/backend/decorators/Injectable";
import { Cart, CreateCart, CartLineItem } from "@/frontend/providers/CartProvider";
import BigBaseApi from "./big-base-api";

@Injectable()
export default class CartAPI extends BigBaseApi {
  private baseUri: string;
  private uriIncludes: string;

  constructor() {
    // set api version
    super("v3");
    this.baseUri = "/carts";
    this.uriIncludes = "?include=line_items.physical_items.options";
  }
  /**
   * Get the cart
   * https://developer.bigcommerce.com/api-reference/eb3777c8094b0-get-a-cart
   * @param cart_id string  Required. The cart ID
   * @returns the cart object
   */
  async get(cart_id: string): Promise<Cart> {
    const { data } = await this.client.get(`${this.baseUri}/${cart_id}${this.uriIncludes}`);
    return data.data;
  }

  /**
   * Create the cart
   * https://developer.bigcommerce.com/api-reference/20c2c55c1763f-create-a-cart
   * @param cartToCreate CreateCart  Required. The cart to create
   * @returns the cart object
   */
  async create(cart: CreateCart): Promise<Cart> {
    const { data } = await this.client.post(`${this.baseUri}${this.uriIncludes}`, cart);

    return data.data;
  }

  /**
   * Delete the cart
   * @param cart_id string  Required. The cart ID
   * @returns void
   */
  async delete(cart_id: string): Promise<void> {
    await this.client.delete(`${this.baseUri}/${cart_id}`);
  }

  /**
   * Update cart customer ID
   * https://developer.bigcommerce.com/api-reference/20c2c55c1763f-create-a-cart
   * @param cart_id     string  Required. The cart ID
   * @param customer_id string  Required. The customer ID
   * @returns the cart object
   */
  async updateCustomerId(cart_id: string, customerId: { customer_id: string }): Promise<Cart> {
    const { data } = await this.client.put(
      `${this.baseUri}/${cart_id}${this.uriIncludes}`,
      customerId
    );
    return data.data;
  }

  /**
   * Add cart item(s)
   * @param cart_id string          Required. The cart ID
   * @param items   CartLineItem[]  Required. The cart line items to add
   * @returns
   */
  async addLineItems(cart_id: string, items: CartLineItem[]): Promise<Cart> {
    const { data } = await this.client.post(`${this.baseUri}/${cart_id}/items${this.uriIncludes}`, {
      line_items: items
    });
    return data.data;
  }

  /**
   * Delete cart item
   * @param cart_id string  Required. The cart ID
   * @param item_id string  Required. The cart line item ID to delete
   */
  async deleteLineItem(cart_id: string, item_id: string): Promise<Cart> {
    const { data } = await this.client.delete(
      `${this.baseUri}/${cart_id}/items/${item_id}${this.uriIncludes}`
    );
    return data.data;
  }
}
