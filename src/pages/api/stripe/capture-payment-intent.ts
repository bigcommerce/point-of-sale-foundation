import { NextApiRequest, NextApiResponse } from "next";
import HttpStatus from "http-status-codes";
import { Injector } from "@/backend/decorators/Injector";
import { StripeApiController } from "@/backend/controllers/stripe-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { RequestType } from "@/backend/controllers/api-route-controller";
import StripeService from "@/backend/services/stripe.service";
import CapturePaymentIntentPayload from "@/shared/payloads/stripe/CapturePaymentIntentPayload";
import { BigService } from "@/backend/services/bigcommerce.service";
import { OrderStatus, PaymentMethod } from "@/shared/enums/OrderTypes";
import { CompletedPaymentResponse, ErrorResponse } from "@/shared/types/response";

export class CapturePaymentIntentController extends StripeApiController {
  private bigService = Injector.resolve<BigService>(BigService);
  private stripeService = Injector.resolve<StripeService>(StripeService);

  public body = new CapturePaymentIntentPayload();

  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const paymentIntent = await this.stripeService.capturePaymentIntent(this.body.paymentIntentId);

    let status_id: OrderStatus;
    switch (paymentIntent.status) {
      case "processing":
        status_id = OrderStatus.Pending;
        break;
      case "canceled":
        status_id = OrderStatus.Cancelled;
        break;
      case "succeeded":
        status_id = OrderStatus.Completed;
        break;
      case "requires_payment_method":
      case "requires_capture":
      case "requires_confirmation":
      case "requires_action":
        status_id = OrderStatus.Awaiting_Payment;
    }

    const orderResponse = await this.bigService.ordersAPI.updateOrder(
      paymentIntent.metadata.order_id,
      {
        status_id,
        payment_method: PaymentMethod.CreditCard,
        payment_provider_id: paymentIntent.id
      }
    );

    let paymentResponse: CompletedPaymentResponse | ErrorResponse;
    if ("id" in paymentIntent) {
      paymentResponse = {
        id: paymentIntent.id,
        transaction_type: "terminal",
        payment_type: "credit_card"
      };
    } else {
      paymentResponse = {
        message: "Stripe terminal request has failed. Please try again.",
        name: "Stripe terminal error",
        status: 500
      };
    }

    return res.status(HttpStatus.OK).json(paymentResponse);
  }
}

export default appContainer
  .resolve(CapturePaymentIntentController)
  .addRequestType(RequestType.POST)
  .getRouteHandler();
