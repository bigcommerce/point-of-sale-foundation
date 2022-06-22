import { Employee } from ".prisma/client";
import { RoleType } from "@/shared/enums/RoleType";
import { NextApiRequest } from "@/types/next";
import { verifyUser } from "../middlewares/auth";
import { ApiRouteController } from "./api-route-controller";
import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from "@/constants/common";

/**
 * Controller class that provides API routing with
 * request authentication flows.
 */
export abstract class StripeApiController extends ApiRouteController {
    //#region Properties

    public requiresAuth = true;
    public requiredRole?: RoleType | RoleType[];
    protected user: Employee;
    private _stripe: Stripe;

    //#endregion

    public get stripe(): Stripe {
        if(!this._stripe) {
            this._stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" })
            return this._stripe
        }
        return this._stripe
    }

    //#region Private Methods

    protected override async beforeRun(req?: NextApiRequest): Promise<void> {
        if (this.requiresAuth) {
            this.user = await this.getUser(req, this.requiredRole);
        }
    }

    /**
     * Returns the current user validated from given request.
     */
    protected getUser(req: NextApiRequest, role?: RoleType | RoleType[]): Promise<Employee> {
        return verifyUser(req, role);
    }

    //#region
}
