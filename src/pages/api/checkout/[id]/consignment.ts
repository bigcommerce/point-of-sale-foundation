import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";
import { IdStringRequest } from "@/requests/IdStringRequest";
import HttpStatus from "http-status-codes";

@injectable()
class CheckoutConsignmentController extends ApiRouteController {
  private bigService = Injector.resolve<BigService>(BigService);
  // Override base class properties
  public query = new IdStringRequest();

  constructor() {
    super();
  }

  /**
   * Returns the cart
   */
  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    switch (_req.method ?? "") {
      case RequestType.POST:
        return await this.addConsignment(_req, res);
      case RequestType.PUT:
        return await this.updateConsignment(_req, res);
      default:
        return res.status(HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  /**
   * Add a consignment
   */
  public async addConsignment(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const { id } = this.query;
    const consignments = _req.body;
    const response = await this.bigService.checkoutAPI.addConsignment(id, consignments);
    res.json(response);
  }

  /**
   * Update a consignment
   */
  public async updateConsignment(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const { id } = this.query;
    const { consignmentId, consignment } = _req.body;
    const response = await this.bigService.checkoutAPI.updateConsignment(
      id,
      consignmentId,
      consignment
    );
    res.json(response);
  }
}
export default appContainer
  .resolve(CheckoutConsignmentController)
  .addRequestType(RequestType.POST)
  .addRequestType(RequestType.PUT)
  .getRouteHandler();
