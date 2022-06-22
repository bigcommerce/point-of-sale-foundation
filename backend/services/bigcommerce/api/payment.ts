import { Injectable } from "@/backend/decorators/Injectable";
import BigBaseApi from "./big-base-api";
import {
  PaymentMethodResponse,
  PaymentAccessTokenResponse,
  ProcessPaymentRequest,
  ProcessPaymentResponse
} from "@/types/big-commerce/payment";

@Injectable()
export default class PaymentAPI extends BigBaseApi {
  private baseUri: string;

  constructor() {
    super();
    this.baseUri = "/payments";
  }
  /**
   * Get accepted payment methods ( for non terminal payments)
   */
  async getAcceptedPaymentMethods(
    checkoutId: string,
    orderId: number
  ): Promise<PaymentMethodResponse | null> {
    const { data } = await this.client.get(`${this.baseUri}/methods`, {
      params: {
        checkout_id: checkoutId,
        order_id: orderId
      }
    });
    return data.data;
  }
  /**
   * Create Payment Access Token
   */
  async createPaymentAccessToken(
    orderId: number,
    isRecurring: boolean
  ): Promise<PaymentAccessTokenResponse | null> {
    const { data } = await this.client.post(`${this.baseUri}/access_tokens`, {
      order: {
        id: orderId,
        is_recurring: isRecurring
      }
    });
    return data.data;
  }

  /**
   * Process manual payment
   */
  async processManualPayment(
    payment: ProcessPaymentRequest,
    paymentAccessToken: string
  ): Promise<ProcessPaymentResponse | null> {
    // Re-init big client using payment version
    this.initBigClient("payment", paymentAccessToken);
    // Process the payment
    const { data } = await this.client.post(`${this.baseUri}`, {
      payment
    });
    return data.data;
  }
}
