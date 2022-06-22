import { roleClient } from "@/backend/prisma-clients";
import { NextApiRequest, NextApiResponse } from "next";
import HttpStatus from "http-status-codes";
import HttpError from "@/backend/exceptions/http-error";
import { RoleType } from "@/shared/enums/RoleType";
import { RoleStringRequest } from "@/requests/RoleIdRequest";
import { IdStringRequest } from "@/requests/IdStringRequest";
import { BaseEmployeeController } from "@/backend/controllers/base-employee-controller";
import { injectable } from "tsyringe";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";
import { RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";

@injectable()
class EmployeeController extends BaseEmployeeController {
  // Override base class properties
  public requiredRole?: RoleType[] = [RoleType.Admin, RoleType.Manager];
  public query = new IdStringRequest();
  public body = new RoleStringRequest();

  /**
   * Updates the target employee's role.
   *
   * The employee's role can only be updated to non-admin roles via this endpoint.
   */
  public async run(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    // Get the employee by ID
    const employeeExists = await this.employeeService.isEmployeeExist({
      id: this.query.id
    });
    if (!employeeExists) {
      throw new HttpError(
        "Employee not found with the given ID",
        HttpStatus.BAD_REQUEST
      );
    }

    // Only permit the updating employees to non-admin roles
    const nonAdminRoleIDs =
      (
        await roleClient.findMany({
          where: { id: { not: RoleType.Admin } }
        })
      )?.map(role => role.id) ?? [];
    if (!nonAdminRoleIDs.includes(this.body.roleId)) {
      throw new HttpError(
        "Unable to update an employee to that roleId",
        HttpStatus.BAD_REQUEST
      );
    }

    // Update the employee record
    const employee = await this.employeeService.updateEmployee(this.query.id, {
      roleId: this.body.roleId
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
