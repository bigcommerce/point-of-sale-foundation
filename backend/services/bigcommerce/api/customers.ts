import { Injectable } from "@/backend/decorators/Injectable";
import { CustomerRequest } from "@/frontend/providers/CartProvider";
import BigBaseApi from "./big-base-api";

@Injectable()
export default class CustomersAPI extends BigBaseApi {
  constructor() {
    super("v3");
  }
  /**
   * Get customer(s)
   * https://developer.bigcommerce.com/api-reference/761ec193054b6-get-all-customers
   * @param params
   * @returns
   */
  async getAll(params?: { [key: string]: string | string[] }) {
    const { data } = await this.client.get(`/customers`, { params });
    return data;
  }
  /**
   * Create Customer(s)
   * https://developer.bigcommerce.com/api-reference/1cea64e1d698e-create-customers
   * @param customer CustomerRequest
   * @returns
   */
  async create(customer: CustomerRequest[]) {
    const { data } = await this.client.post(`/customers`, customer);
    return data.data[0];
  }
  /**
   * Update customer(s)
   * https://developer.bigcommerce.com/api-reference/595425896c3ec-update-customers
   * @param customer CustomerRequest
   * @returns
   */
  async update(customer: CustomerRequest[]) {
    const { data } = await this.client.put(`/customers`, customer);
    return data.data[0];
  }
}
