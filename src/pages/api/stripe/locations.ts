import { NextApiRequest, NextApiResponse } from "next";
import HttpStatus from "http-status-codes";
import { StripeApiController } from "@/backend/controllers/stripe-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { RequestType } from "@/backend/controllers/api-route-controller";
import { Injector } from "@/backend/decorators/Injector";
import StripeService from "@/backend/services/stripe.service";

export class LocationsController extends StripeApiController {
  private stripeService = Injector.resolve<StripeService>(StripeService);

  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const locations = await this.stripeService.getLocations();
    return res.status(HttpStatus.OK).json(locations.data);
  }
}

export default appContainer
  .resolve(LocationsController)
  .addRequestType(RequestType.GET)
  .getRouteHandler();
