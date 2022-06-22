import { NextApiRequest, NextApiResponse } from "next";
import { RequestType } from "@/backend/controllers/api-route-controller";
import HttpStatus from "http-status-codes";
import HttpError from "@/backend/exceptions/http-error";
import { RoleType } from "@/shared/enums/RoleType";
import { BaseEmployeeController } from "@/backend/controllers/base-employee-controller";
import { appContainer } from "@/shared/di-container/app";
import { injectable } from "tsyringe";
import CreateEmployeePayload from "@/shared/payloads/employees/CreateEmployeePayload";
import { parseCookies } from "nookies";

@injectable()
class EmployeeController extends BaseEmployeeController {
  // Override base class properties
  public requiredRole?: RoleType[] = [RoleType.Admin, RoleType.Manager];
  x;
  public body = new CreateEmployeePayload();

  /**
   * Routes the request to the appropriate method.
   */
  public async run(req?: NextApiRequest, res?: NextApiResponse): Promise<NextApiResponse | void> {
    switch (req.method ?? "") {
      case RequestType.GET:
        return await this.getEmployees(req, res);
      case RequestType.POST:
        return await this.createEmployee(req, res);
      default:
        return res.status(HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  /**
   * Returns all employee records.
   */
  public async getEmployees(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const employees = (await this.employeeService.getEmployees()) ?? [];
    return res.json(employees);
  }

  /**
   * Create an employee
   */
  public async createEmployee(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    const cookies = parseCookies(res);

    // Check if an employee record already exists
    const employeeExists = await this.employeeService.isEmployeeExist({
      pin: this.body.pin
    });
    if (employeeExists) {
      throw new HttpError("An employee with that pin already exists", HttpStatus.CONFLICT);
    }

    // If creating admin, checking that logged in employee is also admin
    if (RoleType.Admin == this.body.roleId && RoleType.Admin != this.user.roleId) {
      throw new HttpError(
        "Must be an admin to create an employee with the role of admin.",
        HttpStatus.CONFLICT
      );
    }

    // Create new employee
    const employee = await this.employeeService.createEmployee(this.body);

    return res.status(HttpStatus.CREATED).json(employee);
  }
}
export default appContainer
  .resolve(EmployeeController)
  .addRequestType(RequestType.GET)
  .addRequestType(RequestType.POST)
  .getRouteHandler();
