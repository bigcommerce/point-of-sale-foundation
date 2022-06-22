import { Injectable } from "@/backend/decorators/Injectable";
import BigBaseApi from "./big-base-api";
import { AxiosResponse } from "axios";
import { CreateOrderBody, OrderResponse, UpdateOrderBody } from "@/types/big-commerce/orders";

@Injectable()
export default class OrdersAPI extends BigBaseApi {
  constructor() {
    super("v2");
  }
  async getAllOrders(params?: { [key: string]: string | string[] }) {
    const { data } = await this.client.get<OrderResponse[], AxiosResponse<OrderResponse[]>>(
      `/orders`,
      { params }
    );
    return data;
  }
  async updateOrder(id: number | string, order: UpdateOrderBody) {
    const { data } = await this.client.put<
      OrderResponse,
      AxiosResponse<OrderResponse>,
      UpdateOrderBody
    >(`/orders/${id}`, order);
    return data;
  }
}
