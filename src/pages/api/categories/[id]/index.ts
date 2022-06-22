import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";
import { PaginatedRequestWithId } from "@/requests/PaginatedRequest";

@injectable()
class CategoryController extends ApiRouteController {
  private bigService = Injector.resolve<BigService>(BigService);
  // Override base class properties
  public query = new PaginatedRequestWithId();

  constructor() {
    super();
  }

  /**
   * Returns all employee records.
   */
  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const { id, cursor, pageSize } = this.query;
    const product = await this.bigService.productsGQL.getProductsByCategoryId({
      categoryId: id,
      cursor,
      pageSize
    });
    return res.json(product);
  }
}
export default appContainer
  .resolve(CategoryController)
  .addRequestType(RequestType.GET)
  .getRouteHandler();
