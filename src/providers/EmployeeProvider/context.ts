import { createContext, useContext } from "react";

import { UserError } from "@/shared/methods/bigcommerce";
import { ErrorResponse } from "@/shared/types/response";

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  roleId: string;
  pin: string;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeFormData = {
  firstName: string;
  lastName: string;
  roleId: string;
  pin: string;
};

export type EmployeeLoadingStates = {
  getEmployeeDetails: boolean;
  getEmployees: boolean;
  addEmployee: boolean;
  editEmployee: boolean;
  removeEmployee: boolean;
};

export type EmployeeErrorStates = {
  getEmployeeDetails: UserError | Error | null;
  getEmployees: UserError | Error | null;
  addEmployee: UserError | Error | null;
  editEmployee: UserError | Error | null;
  removeEmployee: UserError | Error | null;
};

export interface EmployeeContextState {
  loaders: EmployeeLoadingStates;
  errors: EmployeeErrorStates;
  employees: Employee[];
  employeeDetails: Employee | null;
}

export type GetEmployeeDetailsAction = (id: string) => Promise<Employee | ErrorResponse | null>;
export type GetEmployeesAction = () => Promise<Employee[]>;

export type AddEmployeeAction = (
  employee: EmployeeFormData
) => Promise<Employee | ErrorResponse | null>;

export type EditEmployeeAction = (
  id: string,
  employee: EmployeeFormData
) => Promise<Employee | ErrorResponse | null>;
export type RemoveEmployeeAction = (id: string) => Promise<Employee | ErrorResponse | null>;
export type ClearEmployeesAction = () => Promise<null>;
export type ClearEmployeeDetailsAction = () => Promise<null>;
export type ClearErrorsAction = () => Promise<null>;

export interface EmployeeContextActions {
  getEmployeeDetails: GetEmployeeDetailsAction;
  getEmployees: GetEmployeesAction;
  addEmployee: AddEmployeeAction;
  editEmployee: EditEmployeeAction;
  removeEmployee: RemoveEmployeeAction;
  clearEmployees: ClearEmployeesAction;
  clearEmployeeDetails: ClearEmployeeDetailsAction;
  clearErrors: ClearErrorsAction;
}

export interface EmployeeContextProps {
  state: EmployeeContextState;
  actions: EmployeeContextActions;
}

export const EmployeeContext = createContext<EmployeeContextProps>({
  state: {
    loaders: {
      // Keep loaders false on initialization as to not block SSR renders
      getEmployeeDetails: false,
      getEmployees: false,
      addEmployee: false,
      editEmployee: false,
      removeEmployee: false
    },
    errors: {
      getEmployeeDetails: null,
      getEmployees: null,
      addEmployee: null,
      editEmployee: null,
      removeEmployee: null
    },
    employees: [],
    employeeDetails: null
  },
  actions: {
    getEmployeeDetails: id => Promise.resolve(null),
    getEmployees: () => Promise.resolve([]),
    addEmployee: employee => Promise.resolve(null),
    editEmployee: (id, employee) => Promise.resolve(null),
    removeEmployee: id => Promise.resolve(null),
    clearEmployees: () => Promise.resolve(null),
    clearEmployeeDetails: () => Promise.resolve(null),
    clearErrors: () => Promise.resolve(null)
  }
});

EmployeeContext.displayName = "EmployeeContext";

export function useEmployeeContext() {
  const context = useContext(EmployeeContext);
  return context;
}
