import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";

@injectable()
class CartController extends ApiRouteController {
  private bigService = Injector.resolve<BigService>(BigService);
  // Override base class properties

  constructor() {
    super();
  }

  /**
   * Create the cart
   */
  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const cartToCreate = _req.body;
    const response = await this.bigService.cartAPI.create(cartToCreate);
    res.json(response);
  }
}
export default appContainer
  .resolve(CartController)
  .addRequestType(RequestType.POST)
  .getRouteHandler();
