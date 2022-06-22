import { singleton } from "tsyringe";
import BigBaseApi from "./bigcommerce/api/big-base-api";

@singleton()
export class MarketingService extends BigBaseApi {

    /**
     * Constructor of Marketing class
     */
    constructor() {
        super('v2')
    }

    /**
     * Returns all coupons from bigcommerce
     * @returns Coupons
     */
    async getAllCoupons() {
        const { data } = await this.client.get("/coupons");
        return data;
    }

    /**
     * Creates new customer coupon
     * @param params customer coupon data
     * @returns Result of created new coupon
     */
    async createCustomerCoupon(params: CreateCouponInput) {
        const { data } = await this.client.post("/coupons", params);
        return data;
    }
}
