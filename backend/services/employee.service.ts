import { singleton } from "tsyringe";
import { employeeClient } from "../prisma-clients";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";
import { Employee } from "@prisma/client";

@singleton()
export class EmployeeService {
  /**
   * Returns whether an employee exists for the given criteria.
   * @param input The employee input criteria.
   * @returns Whether an employee exists.
   */
  public async isEmployeeExist(input: EmployeeInput): Promise<boolean> {
    const employee = await this.getEmployee(input);
    return !isNullOrUndefined(employee);
  }

  /**
   * Returns whether an employee can change their current PIN to
   * the new specified one. This method check to make sure no other
   * employee has the same PIN set.
   * @param employeeId The employee that is changing their PIN.
   * @param newPin The employee's new PIN number.
   * @returns Whether the PIN can be changed.
   */
  public async canChangePin(
    employeeId: string,
    newPin: number
  ): Promise<boolean> {
    const otherEmployee = await employeeClient.findFirst({
      where: { id: { not: employeeId }, pin: newPin }
    });
    return isNullOrUndefined(otherEmployee);
  }

  /**
   * Returns an employee with the given criteria.
   * @param input The employee input criteria.
   * @returns The {@link Employee} or `null`.
   */
  public async getEmployee(input: EmployeeInput): Promise<Employee | null> {
    return await employeeClient.findUnique({
      where: input,
      include: { role: true }
    });
  }

  /**
   * Returns all employees matching the given criteria.
   * @param input The optional employee input criteria.
   * @returns The {@link Employee} collection or `null`.
   */
  public async getEmployees(input?: EmployeeInput): Promise<any> {
    return await employeeClient.findMany({
      where: input,
      include: { role: true }
    });
  }
  s;

  /**
   * Create an employee with the given input.
   * @param data: The employee data.
   * @return The newly created {@link Employee} object.
   */
  public async createEmployee(data: CreateEmployeeInput): Promise<Employee> {
    return await employeeClient.create({ data: data, include: { role: true } });
  }

  /**
   * Delete an employee with the specified ID.
   * @param userId The ID of the current employee.
   * @param employeeId The ID of the employee to delete.
   */
  public async deleteEmployee(
    userId: string,
    employeeId: string
  ): Promise<boolean> {
    if (isNullOrUndefined(userId) || isNullOrUndefined(employeeId)) {
      return false;
    }
    if (userId.toLowerCase() === employeeId.toUpperCase()) {
      return false;
    }
    try {
      await employeeClient.delete({ where: { id: employeeId } });
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Updates an employee with the given input.
   * @param input The employee data.
   * @return The updated {@link Employee} or `null` if an error occurred.
   */
  public async updateEmployee(
    employeeId: string,
    data: UpdateEmployeeInput
  ): Promise<Employee | null> {
    try {
      return await employeeClient.update({
        where: { id: employeeId },
        data: data,
        include: { role: true }
      });
    } catch {
      return null;
    }
  }
}
