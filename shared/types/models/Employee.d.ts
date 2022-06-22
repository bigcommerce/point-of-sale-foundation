type EmployeeInput = {
  id?: string;
  pin?: number;
  roleId?: string;
  firstName?: string;
  lastName?: string;
};

type CreateEmployeeInput = {
  pin: number;
  roleId: string;
  firstName: string;
  lastName: string;
};

type UpdateEmployeeInput = {
  pin?: number;
  roleId?: string;
  firstName?: string;
  lastName?: string;
};
