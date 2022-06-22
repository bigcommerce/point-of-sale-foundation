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
      case RequestType.POST:
        return await this.addCartLineItems(_req, res);
      case RequestType.PUT:
      //return await this.updateCartItem(_req, res);
      case RequestType.DELETE:
        return await this.deleteCartLineItem(_req, res);
      default:
        return res.status(HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  /**
   * Add cart line items
   */
  public async addCartLineItems(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const { id } = this.query;
    const lineItems = _req.body;
    const response = await this.bigService.cartAPI.addLineItems(id, lineItems);
    res.json(response);
  }

  /**
   * Delete cart line item
   */
  public async deleteCartLineItem(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const { id } = this.query;
    const item_id = _req.body;
    const response = await this.bigService.cartAPI.deleteLineItem(id, item_id);
    res.json(response);
  }

  /**
   * Update Cart Item

  public async updateCartItem(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const { id } = this.query;
    const customer_id = _req.body;
    const response = await this.bigService.cartAPI.updateCartItem(id, customer_id);
    res.json(response);
  }
  */
}
export default appContainer
  .resolve(CartController)
  .addRequestType(RequestType.POST)
  .addRequestType(RequestType.PUT)
  .addRequestType(RequestType.DELETE)
  .getRouteHandler();
