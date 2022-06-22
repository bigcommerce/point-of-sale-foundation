import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";
import { IdStringRequest } from "@/requests/IdStringRequest";
import HttpStatus from "http-status-codes";

@injectable()
class CartController extends ApiRouteController {
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
      case RequestType.GET:
        return await this.getCart(_req, res);
      case RequestType.PUT:
        return await this.updateCartCustomerId(_req, res);
      case RequestType.DELETE:
        await this.deleteCart(_req, res);
        break;
      default:
        res.status(HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  /**
   * Get the cart
   */
  public async getCart(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const { id } = this.query;
    const response = await this.bigService.cartAPI.get(id);
    return res.json(response);
  }

  /**
   * Update Cart Customer ID
   */
  public async updateCartCustomerId(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const { id } = this.query;
    const customerId = _req.body;
    const response = await this.bigService.cartAPI.updateCustomerId(id, customerId);
    return res.json(response);
  }

  /**
   * Delete the cart
   */
  public async deleteCart(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const { id } = this.query;
    const response = await this.bigService.cartAPI.delete(id);
    res.json(response);
  }
}
export default appContainer
  .resolve(CartController)
  .addRequestType(RequestType.GET)
  .addRequestType(RequestType.PUT)
  .addRequestType(RequestType.DELETE)
  .getRouteHandler();
