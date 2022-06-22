import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";
import { PaginatedRequestWithCategoryId } from "@/requests/PaginatedRequest";

@injectable()
class ProductsController extends ApiRouteController {
  private bigService = Injector.resolve<BigService>(BigService);
  // Override base class properties
  public query = new PaginatedRequestWithCategoryId();

  constructor() {
    super();
  }

  /**
   * Returns all employee records.
   */
  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const { cursor, pageSize, categoryId } = this.query;
    const products = await this.bigService.productsGQL.getAllProducts({
      cursor,
      pageSize,
      categoryId
    });
    return res.json(products);
  }
}
export default appContainer
  .resolve(ProductsController)
  .addRequestType(RequestType.GET)
  .getRouteHandler();
