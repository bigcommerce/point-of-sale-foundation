import { NextApiRequest, NextApiResponse } from "next";
import { RequestType } from "@/backend/controllers/api-route-controller";
import HttpStatus from "http-status-codes";
import { RoleType } from "@/shared/enums/RoleType";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { AuthApiController } from "@/backend/controllers/auth-route-controller";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";

@injectable()
class OrdersController extends AuthApiController {
  public requiredRole?: RoleType[] = [RoleType.Admin, RoleType.Manager, RoleType.Cashier];
  private bigService = Injector.resolve<BigService>(BigService);

  constructor() {
    super();
  }

  /**
   * Routes the request to the appropriate method.
   */
  public async run(req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    switch (req.method ?? "") {
      case RequestType.GET:
        return await this.getOrders(req, res);
      default:
        return res.status(HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  /**
   * Returns all orders
   */
  public async getOrders(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const orders = await this.bigService.ordersAPI.getAllOrders();
    return res.json(orders);
  }
}

export default appContainer
  .resolve(OrdersController)
  .addRequestType(RequestType.GET)
  .getRouteHandler();
