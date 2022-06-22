import { MarketingService } from "../services/marketing.service";
import { AuthApiController } from "./auth-route-controller";

export abstract class BaseMarketingController extends AuthApiController {
  /**
   * Initializes a {@link BaseMarketingController} instance.
   * @param marketingService The marketing service instance.
   */
  constructor(protected readonly marketingService: MarketingService) {
    super();
  }
}
