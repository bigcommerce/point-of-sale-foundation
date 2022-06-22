import { NextApiRequest, NextApiResponse } from "next";
import HttpStatus from "http-status-codes";
import HttpError from "@/backend/exceptions/http-error";
import { IdStringRequest } from "@/requests/IdStringRequest";
import { BaseEmployeeController } from "@/backend/controllers/base-employee-controller";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";
import { injectable } from "tsyringe";
import { RequestType } from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { roleClient } from "@/backend/prisma-clients";
import { RoleType } from "@/shared/enums/RoleType";
import UpdateEmployeePayload from "@/shared/payloads/employees/UpdateEmployeePayload";

@injectable()
class EmployeeController extends BaseEmployeeController {
  // Override base class properties
  public requiredRole?: RoleType[] = [RoleType.Admin, RoleType.Manager];
  public query = new IdStringRequest();
  public body = new UpdateEmployeePayload();

  /**
   * Routes the request to the appropriate method.
   */
  public async run(
    req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    switch (req.method ?? "") {
      case RequestType.GET:
        return await this.getEmployee(req, res);
      case RequestType.POST:
        return await this.createEmployee(req, res);
      case RequestType.PUT:
        return await this.updateEmployee(req, res);
      case RequestType.DELETE:
        return await this.deleteEmployee(req, res);
      default:
        return res.status(HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  /**
   * Returns an employee record with the given `id`.
   */
  protected async getEmployee(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    // Get the employee by ID
    const employee = await this.employeeService.getEmployee({
      id: this.query.id
    });
    if (isNullOrUndefined(employee)) {
      throw new HttpError(
        "Employee not found with the given ID",
        HttpStatus.NOT_FOUND
      );
    }
    return res.json(employee);
  }

  protected async createEmployee(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    // Get the employee by ID
    const employee = await this.employeeService.getEmployee({
      id: this.query.id
    });
    if (isNullOrUndefined(employee)) {
      throw new HttpError(
        "Employee not found with the given ID",
        HttpStatus.NOT_FOUND
      );
    }
    return res.json(employee);
  }

  /**
   * Updates an employee record with the given `id`.
   */
  protected async updateEmployee(
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
    const employee = await this.employeeService.updateEmployee(
      this.query.id,
      this.body
    );
    if (isNullOrUndefined(employee)) {
      throw new HttpError(
        "Unable to update the employee record",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    return res.status(HttpStatus.OK).json(employee);
  }

  /**
   * Returns an employee record with the given `id`.
   */
  protected async deleteEmployee(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    // Get the employee by ID
    const employee = await this.employeeService.getEmployee({
      id: this.query.id
    });
    if (isNullOrUndefined(employee)) {
      throw new HttpError(
        "Employee not found with the given ID",
        HttpStatus.NOT_FOUND
      );
    }
    const employeeDeleted = await this.employeeService.deleteEmployee(
      this.user.id,
      this.query.id
    );
    if (!employeeDeleted) {
      throw new HttpError(
        "Unable to delete the requested employee",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
    return res.status(HttpStatus.OK).json(employeeDeleted);
  }
}
export default appContainer
  .resolve(EmployeeController)
  .addRequestType(RequestType.GET)
  .addRequestType(RequestType.PUT)
  .addRequestType(RequestType.DELETE)
  .getRouteHandler();
