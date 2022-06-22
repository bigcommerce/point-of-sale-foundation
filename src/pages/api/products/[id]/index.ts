import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";
import { IdNumberRequest } from "@/requests/IdStringRequest";

@injectable()
class ProductsController extends ApiRouteController {
  private bigService = Injector.resolve<BigService>(BigService);
  // Override base class properties
  public query = new IdNumberRequest();

  constructor() {
    super();
  }

  /**
   * Returns all employee records.
   */
  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const { id } = this.query;
    const product = await this.bigService.productsGQL.getProductById({ productId: id });
    return res.json(product);
  }
}
export default appContainer
  .resolve(ProductsController)
  .addRequestType(RequestType.GET)
  .getRouteHandler();
