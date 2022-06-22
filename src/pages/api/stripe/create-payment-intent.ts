import { NextApiRequest, NextApiResponse } from "next";
import HttpStatus from "http-status-codes";
import { StripeApiController } from "@/backend/controllers/stripe-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { RequestType } from "@/backend/controllers/api-route-controller";
import { Injector } from "@/backend/decorators/Injector";
import StripeService from "@/backend/services/stripe.service";
import CreatePaymentIntentPayload from "@/shared/payloads/stripe/CreatePaymentIntentPayload";

export class CreatePaymentIntentController extends StripeApiController {
  private stripeService = Injector.resolve<StripeService>(StripeService);

  public body = new CreatePaymentIntentPayload();

  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const { orderId, amount } = this.body;
    const intent = await this.stripeService.createPaymentIntent(orderId, amount);
    return res.status(HttpStatus.OK).json(intent);
  }
}

export default appContainer
  .resolve(CreatePaymentIntentController)
  .addRequestType(RequestType.POST)
  .getRouteHandler();
