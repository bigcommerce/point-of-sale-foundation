import { NextApiRequest, NextApiResponse } from "next";
import { RequestType } from "@/backend/controllers/api-route-controller";
import HttpStatus from "http-status-codes";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { BaseMarketingController } from "@/backend/controllers/base-marketing-controller";
import { MarketingService } from "@/backend/services/marketing.service";
import CreateCouponPayload from "@/shared/payloads/marketing/CreateCouponPayload";

@injectable()
class CouponsController extends BaseMarketingController {
  // Override base class properties
  public body = new CreateCouponPayload();

  constructor(marketingService: MarketingService) {
    super(marketingService);
  }

  /**
   * Routes the request to the appropriate method.
   */
   public async run(
    req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    switch (req.method ?? "") {
      case RequestType.GET:
        return await this.getCoupons(req, res);
      case RequestType.POST:
        return await this.createCoupon(req, res);
      default:
        return res.status(HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  /**
   * Returns all coupons
   */
  public async getCoupons(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const coupons = await this.marketingService.getAllCoupons()
    return res.json(coupons)
  }

  /**
   * Creates new customer coupon 
   */
  public async createCoupon(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const result = await this.marketingService.createCustomerCoupon(this.body)
    return res.json(result)
  }
}
export default appContainer
  .resolve(CouponsController)
  .addRequestType(RequestType.GET)
  .addRequestType(RequestType.POST)
  .getRouteHandler();
