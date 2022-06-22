import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";

@injectable()
class CategoriesController extends ApiRouteController {
  private bigService = Injector.resolve<BigService>(BigService);

  constructor() {
    super();
  }

  /**
   * Returns all employee records.
   */
  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    const categories = await this.bigService.productsGQL.getProductCategories();
    return res.json(categories);
  }
}
export default appContainer
  .resolve(CategoriesController)
  .addRequestType(RequestType.GET)
  .getRouteHandler();
