import { NextApiRequest, NextApiResponse } from "next";
import HttpStatus from "http-status-codes";
import HttpError from "@/backend/exceptions/http-error";
import { BaseEmployeeController } from "@/backend/controllers/base-employee-controller";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";
import { RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { RoleType } from "@/shared/enums/RoleType";

@injectable()
class EmployeeController extends BaseEmployeeController {
  public requiredRole?: RoleType[] = [
    RoleType.Admin,
    RoleType.Manager,
    RoleType.Cashier
  ];

  /**
   * Updates the pin of the current user.
   */
  public async run(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    if (isNullOrUndefined(this.user.id)) {
      throw new HttpError(
        "Unable to get the employee record of the current user",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    // Update the employee record
    const employee = await this.employeeService.getEmployee({
      id: this.user.id
    });
    if (isNullOrUndefined(employee)) {
      throw new HttpError(
        "Unable to get the employee record",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    return res.status(HttpStatus.OK).json(employee);
  }
}
export default appContainer
  .resolve(EmployeeController)
  .addRequestType(RequestType.GET)
  .getRouteHandler();
