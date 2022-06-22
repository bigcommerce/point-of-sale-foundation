import { NextApiRequest, NextApiResponse } from "next";
import HttpStatus from "http-status-codes";
import { StripeApiController } from "@/backend/controllers/stripe-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { RequestType } from "@/backend/controllers/api-route-controller";
import { Injector } from "@/backend/decorators/Injector";
import StripeService from "@/backend/services/stripe.service";

export class TokenController extends StripeApiController {
  private stripeService = Injector.resolve<StripeService>(StripeService);

  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const connectionToken = await this.stripeService.createTerminalToken();
    return res.status(HttpStatus.OK).json({ secret: connectionToken.secret });
  }
}

export default appContainer
  .resolve(TokenController)
  .addRequestType(RequestType.GET)
  .getRouteHandler();
