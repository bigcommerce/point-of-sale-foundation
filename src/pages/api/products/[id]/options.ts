import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";
import { IdNumberRequest } from "@/requests/IdStringRequest";
import { ProductOptionsRequest } from "@/requests/ProductOptionsRequest";

@injectable()
class ProductsController extends ApiRouteController {
  private bigService = Injector.resolve<BigService>(BigService);
  // Override base class properties
  public query = new IdNumberRequest();
  public body = new ProductOptionsRequest();

  constructor() {
    super();
  }

  /**
   * Returns all employee records.
   */
  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const { id } = this.query;
    const { optionValueIds } = this.body;
    const product = await this.bigService.productsGQL.getProductWithOptionSelections({
      productId: id,
      optionValueIds
    });
    return res.json(product);
  }
}
export default appContainer
  .resolve(ProductsController)
  .addRequestType(RequestType.POST)
  .getRouteHandler();
