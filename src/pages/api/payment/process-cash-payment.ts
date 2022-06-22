import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { OrderStatus, PaymentMethod } from "@/shared/enums/OrderTypes";
import { CompletedPaymentResponse } from "@/shared/types/response";

@injectable()
class CheckoutCashPaymentController extends ApiRouteController {
  public RequireAuth = true;
  private bigService = Injector.resolve<BigService>(BigService);

  constructor() {
    super();
  }

  /**
   * Process a cash payment
   */
  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const payment = _req.body;

    const cashResponse: CompletedPaymentResponse = {
        amount_paid: payment.amount_paid,
        change: payment.amount_paid - payment.order_total,
        payment_type: 'cash'
    }

    const orderResponse = await this.bigService.ordersAPI.updateOrder(payment.order_id, {
      status_id: OrderStatus.Completed,
      payment_method: PaymentMethod.Cash
    });

    res.json(cashResponse);
  }
}
export default appContainer
  .resolve(CheckoutCashPaymentController)
  .addRequestType(RequestType.POST)
  .getRouteHandler();
