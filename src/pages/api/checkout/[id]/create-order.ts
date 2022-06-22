import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";
import { IdStringRequest } from "@/requests/IdStringRequest";

@injectable()
class CheckoutCreateOrderController extends ApiRouteController {
  private bigService = Injector.resolve<BigService>(BigService);
  // Override base class properties
  public query = new IdStringRequest();

  constructor() {
    super();
  }

  /**
   * Create the cart
   */
  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const { id } = this.query;
    const response = await this.bigService.checkoutAPI.createOrder(id);
    res.json(response);
  }
}
export default appContainer
  .resolve(CheckoutCreateOrderController)
  .addRequestType(RequestType.POST)
  .getRouteHandler();
