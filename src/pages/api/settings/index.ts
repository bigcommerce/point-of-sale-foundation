import { NextApiRequest, NextApiResponse } from "next";
import { ApiRouteController, RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import HttpStatus from "http-status-codes";
import { settingsClient } from "@/backend/prisma-clients";

@injectable()
class CartController extends ApiRouteController {
  // Override base class properties

  constructor() {
    super();
  }

  public async run(_req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    switch (_req.method ?? "") {
      case RequestType.GET:
        return await this.getSettings(_req, res);
      case RequestType.POST:
        return await this.saveStoreAddress(_req, res);
      default:
        res.status(HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  /**
   * Get settings
   */
  public async getSettings(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const response = await settingsClient.findMany();
    return res.json(response);
  }

  /**
   * Save the store address
   */
  public async saveStoreAddress(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const storeAddress = _req.body;
    const settings: any = await settingsClient.upsert({
      create: {
        name: "store_address",
        value: JSON.stringify(storeAddress)
      },
      update: {
        value: JSON.stringify(storeAddress)
      },
      where: { name: "store_address" }
    });
    res.json(settings);
  }
}
export default appContainer
  .resolve(CartController)
  .addRequestType(RequestType.GET)
  .addRequestType(RequestType.POST)
  .getRouteHandler();
