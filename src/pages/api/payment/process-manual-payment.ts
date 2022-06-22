import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { OrderStatus } from "@/shared/enums/OrderTypes";
import { CompletedPaymentResponse, ErrorResponse } from "@/shared/types/response";

@injectable()
class CheckoutManualPaymentController extends ApiRouteController {
  private bigService = Injector.resolve<BigService>(BigService);

  constructor() {
    super();
  }

  /**
   * Process a manual payment
   */
  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const { orderId, payment, paymentAccessToken } = _req.body;
    const manualPayment = await this.bigService.paymentAPI.processManualPayment(
      payment,
      paymentAccessToken
    );

    let paymentResponse: CompletedPaymentResponse | ErrorResponse;
    if ("status" in manualPayment && manualPayment.status === "success") {
      const orderResponse = await this.bigService.ordersAPI.updateOrder(orderId, {
        status_id: OrderStatus.Completed
      });

      paymentResponse = {
        id: manualPayment.id,
        transaction_type: manualPayment.transaction_type,
        payment_type: "credit_card"
      };
    } else {
      paymentResponse = {
        message: manualPayment.detail,
        name: manualPayment.title,
        status: manualPayment.code
      };
    }

    res.json(paymentResponse);
  }
}
export default appContainer
  .resolve(CheckoutManualPaymentController)
  .addRequestType(RequestType.POST)
  .getRouteHandler();
