import { injectable } from "tsyringe";
import { NextApiRequest } from "@/types/next";
import { NextApiResponse } from "next";
import getAccessToken from "@/backend/auth/get-auth-token";
import HttpStatus from "http-status-codes";
import HttpError from "@/backend/exceptions/http-error";
import { setCookieOnBackend } from "@/frontend/utils/cookies";
import { RoleType } from "@/shared/enums/RoleType";
import { DEFAULT_ADMIN_PASSWORD } from "@/shared/constants";
import {
  ApiRouteController,
  RequestType
} from "@/backend/controllers/api-route-controller";
import { appContainer } from "@/shared/di-container/app";
import { PinNumberRequest } from "@/requests/PinNumberRequest";
import { EmployeeService } from "@/backend/services/employee.service";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";

@injectable()
class LoginController extends ApiRouteController {
  // Override base class properties
  public body = new PinNumberRequest();

  constructor(protected readonly employeeService: EmployeeService) {
    super();
  }

  /**
   * Authenticates a user with the PIN number.
   */
  public async run(
    _req?: NextApiRequest,
    res?: NextApiResponse
  ): Promise<NextApiResponse | void> {
    // Get the employee with the given PIN number
    const employee = await this.employeeService.getEmployee({
      pin: this.body.pin
    });
    if (isNullOrUndefined(employee)) {
      throw new HttpError("Invalid employee PIN", HttpStatus.UNAUTHORIZED);
    }

    // Create a new JWT access token
    const accessToken = getAccessToken(employee);
    const firstTime =
      employee.roleId === RoleType.Admin &&
      employee.pin === DEFAULT_ADMIN_PASSWORD;
    setCookieOnBackend(res, "access_token", accessToken);
    setCookieOnBackend(res, "first_time", firstTime);
    return res.status(HttpStatus.OK).json({
      access_token: accessToken,
      first_time: firstTime
    });
  }
}

export default appContainer
  .resolve(LoginController)
  .addRequestType(RequestType.POST)
  .getRouteHandler();
