import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";
import { IdStringRequest } from "@/requests/IdStringRequest";
import HttpStatus from "http-status-codes";

@injectable()
class CheckoutBillingAddressController extends ApiRouteController {
  private bigService = Injector.resolve<BigService>(BigService);
  // Override base class propertiess
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
        return await this.addBillingAddress(_req, res);
      default:
        return res.status(HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  /**
   * Add billing address
   */
  public async addBillingAddress(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const { id } = this.query;
    const billingAddress = _req.body;
    const response = await this.bigService.checkoutAPI.addBillingAddress(id, billingAddress);
    res.json(response);
  }
}
export default appContainer
  .resolve(CheckoutBillingAddressController)
  .addRequestType(RequestType.POST)
  .getRouteHandler();
