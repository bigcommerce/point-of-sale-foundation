import { NextApiRequest, NextApiResponse } from "next";
import HttpStatus from "http-status-codes";
import { StripeApiController } from "@/backend/controllers/stripe-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { RequestType } from "@/backend/controllers/api-route-controller";
import { Injector } from "@/backend/decorators/Injector";
import StripeService from "@/backend/services/stripe.service";

export class ReadersController extends StripeApiController {
  private stripeService = Injector.resolve<StripeService>(StripeService);

  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const readers = await this.stripeService.getReaders();
    return res.status(HttpStatus.OK).json(readers.data);
  }
}

export default appContainer
  .resolve(ReadersController)
  .addRequestType(RequestType.GET)
  .getRouteHandler();
