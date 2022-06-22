import { NextApiRequest } from "next";
import { verify } from "jsonwebtoken";
import HttpError from "../exceptions/http-error";
import HttpStatus from "http-status-codes";
import { RoleType } from "@/shared/enums/RoleType";
import { appContainer } from "@/shared/di-container/app";
import { Employee } from "@prisma/client";
import { EmployeeService } from "../services/employee.service";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";
import { isArray, isString } from "class-validator";

/**
 * Verifies a user from a request's authorization header.
 * @param req The request object.
 * @param role The required role, if specified.
 * @returns The verified {@link Employee}.
 * @throws {HttpError} If user verification failed.
 */
export async function verifyUser(
  req: NextApiRequest,
  role?: RoleType | RoleType[]
): Promise<Employee> {
  if (isString(role)) {
    role = [role];
  }

  try {
    if (
      isNullOrUndefined(req.headers.authorization) &&
      isNullOrUndefined(req.cookies.access_token)
    ) {
      throw new HttpError("Authorization required", HttpStatus.UNAUTHORIZED);
    }

    // Parse and verify the bearer token header
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ").pop()
      : req.cookies.access_token;
    const decoded = verify(token, process.env.JWT_SECRET) as VerifiedUser;

    // Fetch the corresponding user
    const employeeService = appContainer.resolve<EmployeeService>(EmployeeService);
    const employee = await employeeService.getEmployee({ id: decoded.userId });
    if (isNullOrUndefined(employee)) {
      throw new HttpError("Invalid user", HttpStatus.UNAUTHORIZED);
    }

    // Verify that the user's role matches the required role
    if (!isNullOrUndefined(role) && !role.includes(employee.roleId as RoleType)) {
      throw new HttpError("Invalid user permissions", HttpStatus.FORBIDDEN);
    }

    return employee;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(error.message, HttpStatus.UNAUTHORIZED, error.name);
  }
}
