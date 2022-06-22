import { NextApiRequest, NextApiResponse } from "next";
import { RequestType } from "@/backend/controllers/api-route-controller";
import HttpStatus from "http-status-codes";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import UpdateOrderPayload from "@/shared/payloads/orders/UpdateOrderPayload";
import { AuthApiController } from "@/backend/controllers/auth-route-controller";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";
import { IdStringRequest } from "@/requests/IdStringRequest";

@injectable()
class OrdersController extends AuthApiController {
  private bigService = Injector.resolve<BigService>(BigService);
  public query = new IdStringRequest();
  public body = new UpdateOrderPayload();

  constructor() {
    super();
  }

  /**
   * Routes the request to the appropriate method.
   */
  public async run(req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    switch (req.method ?? "") {
      case RequestType.PUT:
        return await this.updateOrder(req, res);
      default:
        return res.status(HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  /**
   * Update Order
   */
  public async updateOrder(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const { id } = this.query;
    const response = await this.bigService.ordersAPI.updateOrder(id, this.body);
    return res.json(response);
  }
}

export default appContainer
  .resolve(OrdersController)
  .addRequestType(RequestType.PUT)
  .getRouteHandler();
