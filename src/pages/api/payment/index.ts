import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";
import HttpStatus from "http-status-codes";

@injectable()
class CheckoutPaymentMethodsController extends ApiRouteController {
  private bigService = Injector.resolve<BigService>(BigService);

  constructor() {
    super();
  }

  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    switch (_req.method ?? "") {
      case RequestType.GET:
        return await this.getAcceptedPaymentMethods(_req, res);
      case RequestType.POST:
        return await this.createPaymentAccessToken(_req, res);
      default:
        return res.status(HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  /**
   * Get acceepted payment methods
   */
  public async getAcceptedPaymentMethods(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const checkoutId = Array.isArray(_req.query.checkoutId)
      ? _req.query.checkoutId[0]
      : _req.query.checkoutId;
    const orderId = Array.isArray(_req.query.orderId)
      ? +_req.query.orderId[0]
      : +_req.query.orderId;

    const response = await this.bigService.paymentAPI.getAcceptedPaymentMethods(
      checkoutId,
      orderId
    );
    res.json(response);
  }

  /**
   * Create Payment Access Token
   */
  public async createPaymentAccessToken(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const { orderId, isRecurring } = _req.body;

    const response = await this.bigService.paymentAPI.createPaymentAccessToken(
      orderId,
      isRecurring
    );

    res.json(response);
  }
}
export default appContainer
  .resolve(CheckoutPaymentMethodsController)
  .addRequestType(RequestType.GET)
  .addRequestType(RequestType.POST)
  .getRouteHandler();
