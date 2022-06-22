import { NextApiRequest, NextApiResponse } from "next";
import HttpStatus from "http-status-codes";
import { BaseEmployeeController } from "@/backend/controllers/base-employee-controller";
import HttpError from "@/backend/exceptions/http-error";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";
import { RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import { IdStringRequest } from "@/requests/IdStringRequest";
import { PinNumberRequest } from "@/requests/PinNumberRequest";
import { RoleType } from "@/shared/enums/RoleType";

@injectable()
class EmployeeController extends BaseEmployeeController {
  // Override base class properties
  public requiredRole?: RoleType[] = [RoleType.Admin, RoleType.Manager];
  public query = new IdStringRequest();
  public body = new PinNumberRequest();

  /**
   * Updates the target employee's pin.
   */
  public async run(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    // Check if the ID corresponds to a valid employee
    const employeeExists = await this.employeeService.isEmployeeExist({
      id: this.query.id
    });
    if (!employeeExists) {
      throw new HttpError(
        "Employee not found with the given ID",
        HttpStatus.BAD_REQUEST
      );
    }

    // Check if an employee already has the specified PIN
    const canChangePin = await this.employeeService.canChangePin(
      this.query.id,
      this.body.pin
    );
    if (!canChangePin) {
      throw new HttpError(
        "The specified PIN is already in use",
        HttpStatus.BAD_REQUEST
      );
    }

    // Update the employee record
    const employee = await this.employeeService.updateEmployee(this.query.id, {
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
