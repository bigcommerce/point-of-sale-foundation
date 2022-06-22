import { NextApiRequest, NextApiResponse } from "next";
import HttpStatus from "http-status-codes";
import HttpError from "@/backend/exceptions/http-error";
import { PinNumberRequest } from "@/requests/PinNumberRequest";
import { BaseEmployeeController } from "@/backend/controllers/base-employee-controller";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";
import { RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { RoleType } from "@/shared/enums/RoleType";

@injectable()
class EmployeeController extends BaseEmployeeController {
  // Override base class properties
  public requiredRole?: RoleType[] = [
    RoleType.Admin,
    RoleType.Manager,
    RoleType.Cashier
  ];
  public body = new PinNumberRequest();

  /**
   * Updates the pin of the current user.
   */
  public async run(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    if (isNullOrUndefined(this.user.id)) {
      throw new HttpError(
        "Unable to update the employee record of the current user",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    // Update the employee record
    const employee = await this.employeeService.updateEmployee(this.user.id, {
      pin: this.body.pin
    });
    if (isNullOrUndefined(employee)) {
      throw new HttpError(
        "Unable to update the employee record",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    return res.status(HttpStatus.OK).json(employee);
  }
}
export default appContainer
  .resolve(EmployeeController)
  .addRequestType(RequestType.PATCH)
  .getRouteHandler();
