import { appContainer } from "@/shared/di-container/app";
import { RoleType } from "@/shared/enums/RoleType";
import { EmployeeService } from "../services/employee.service";
import { AuthApiController } from "./auth-route-controller";

export abstract class BaseEmployeeController extends AuthApiController {
  // Override base class properties
  public requiredRole?: RoleType | RoleType[] = RoleType.Admin;
  public employeeService: EmployeeService;

  /**
   * Initializes a {@link BaseEmployeeController} instance.
   */
  constructor() {
    super();
    this.employeeService = appContainer.resolve(EmployeeService);
  }
}
