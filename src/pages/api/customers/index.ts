import { NextApiRequest } from "@/types/next";

import { NextApiResponse } from "next";
import HttpStatus from "http-status-codes";
import { Injector } from "@/backend/decorators/Injector";
import { BigService } from "@/backend/services/bigcommerce.service";
import { appContainer } from "@/shared/di-container/app";
import { RequestType } from "@/backend/controllers/api-route-controller";
import { AuthApiController } from "@/backend/controllers/auth-route-controller";
import { injectable } from "tsyringe";

/**
 * - Allowed Query params
 *
 * company:in = string
 * Filter items by company. company:in=bigcommerce,commongood
 *
 * customer_group_id:in = array[string]
 * Filter items by customer_group_id. customer_group_id:in=5,6
 *
 * date_created = string<date-time>
 * Filter items by date_created. date_created=2018-09-05T13:43:54
 *
 * date_created:max = string
 * Filter items by maximum date_created. date_created:max=2018-09-10
 *
 * date_created:min = string<date-time>
 * Filter items by date_created. date_created:min=2018-09-05
 *
 * date_modified = string<date-time>
 * Filter items by date_modified. date_modified=2018-09-05T13:45:03
 *
 * date_modified:max = string<date-time>
 * Filter items by maximum date_modified date_modified:max=2018-09-05T13:45:03 or date_modified:max=2019-09-04
 *
 * date_modified:min = string
 * Filter items by mininum date_modified. date_modified:min=2019-09-04T:00:00:00 or date_modified:min=2019-09-04
 *
 * email:in = string
 * Filter items by email. email:in=janedoe@example.com
 *
 * id:in = array[integer]
 * Filter items by ID. id:in=4,5,6
 *
 * include = string
 * Indicates whether to include customer sub-resources:
 * addresses - customer addresses
 * storecredit - store credit
 * attributes - customer attributes and address attributes
 * formfields - customer and address form fields
 * include=addresses,storecredit,attributes,formfields
 * Allowed values: addresses | storecredit | attributes | formfields
 *
 * limit = number
 * Items count per page. limit=50
 *
 * name:in = array[string]
 * Filter items by first_name and last_name. name=james moriarty
 *
 * name:like = array[string]
 * Filter items by substring in first_name and last_name. name:like=moriarty, sherlock Concatenates the first_name and last_name fields.
 *
 * page = integer
 * Page number. page=1
 *
 * registration_ip_address:in = array[integer]
 * Filter items by registration_ip_address. If the customer was created using the API, then registration address is blank. registration_ip_address:in=12.345.6.789
 *
 * sort = string
 * Sort items by date_created, date_modified, or last_name:* date_created:asc - date created, ascending* date_created:desc - date created, descending* last_name:asc - last name, ascending* last_name:desc - last name, descending * date_modified:asc - date modified, ascending* date_modified:desc- date modified, descending Example: sort=last_name:asc
 * Allowed values: date_created:asc | date_created:desc | last_name:asc | last_name:desc | date_modified:asc | date_modified:desc
 */

@injectable()
export class CustomersController extends AuthApiController {
  private bigService = Injector.resolve<BigService>(BigService);

  /**
   * Routes the request to the appropriate method.
   */
  public async run(req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    switch (req.method ?? "") {
      case RequestType.GET:
        return await this.getCustomers(req, res);
      case RequestType.POST:
        return await this.createCustomers(req, res);
      case RequestType.PUT:
        return await this.updateCustomers(req, res);
      default:
        return res.status(HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  /*
  public async run(_req?: NextApiRexquest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    try {
      const customers = await this.bigService.customersAPI.getAll(_req.query);
      return res.status(HttpStatus.OK).json(customers);
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: error.message });
    }
  }
  */

  /**
   * Gets all customers
   */
  public async getCustomers(
    req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const customers = await this.bigService.customersAPI.getAll(req.query);
    return res.status(HttpStatus.OK).json(customers);
  }

  /**
   * Create new customer(s)
   */
  public async createCustomers(
    req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const customer = await this.bigService.customersAPI.create(req.body);
    return res.status(HttpStatus.OK).json(customer);
  }

  /**
   * Update customer(s)
   */ s;
  public async updateCustomers(
    req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const customer = await this.bigService.customersAPI.update(req.body);
    return res.status(HttpStatus.OK).json(customer);
  }
}
export default appContainer
  .resolve(CustomersController)
  .addRequestType(RequestType.GET)
  .addRequestType(RequestType.POST)
  .addRequestType(RequestType.PUT)
  .getRouteHandler();
