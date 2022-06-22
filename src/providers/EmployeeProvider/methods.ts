import { Employee, EmployeeFormData } from "./context";
import { UserError, SessionExpiredError, ForbiddenError } from "@/shared/methods/bigcommerce";
import { ErrorResponse } from "@/shared/types/response";

export interface MethodOptions {
  access_token: string;
}

export interface GetEmployeeDetailsProps {
  id: string;
  options: MethodOptions;
}
export type GetEmployeeDetailsFunction = (
  id: string,
  options: MethodOptions
) => Promise<Employee | ErrorResponse | null>;
export type GetEmployeesFunction = (options: MethodOptions) => Promise<Employee[]>;
export type AddEmployeeFunction = (
  employee: EmployeeFormData,
  options: MethodOptions
) => Promise<Employee | ErrorResponse | null>;
export type EditEmployeeFunction = (
  id: string,
  employee: EmployeeFormData,
  options: MethodOptions
) => Promise<Employee | ErrorResponse | null>;
export type RemoveEmployeeFunction = (
  id: string,
  options: MethodOptions
) => Promise<Employee | ErrorResponse | null>;

const apiUri = "/api";

export const getEmployeeDetailsMethod: GetEmployeeDetailsFunction = (id, { access_token }) => {
  return fetch(`${apiUri}/employees/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }).then(response => {
    if (!response.ok) {
      if (response.status === 400) {
        return response.json().then(data => {
          throw new UserError(response.statusText, data);
        });
      } else if (response.status === 401) {
        throw new SessionExpiredError("JWT expired");
      } else if (response.status === 403) {
        throw new ForbiddenError("Forbidden");
      }
    }
    return response.json() as Promise<Employee | null>;
  });
};

export const getEmployeesMethod: GetEmployeesFunction = ({ access_token }) => {
  const url = `${apiUri}/employees`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }).then(response => {
    if (!response.ok) {
      if (response.status === 400) {
        return response.json().then(data => {
          throw new UserError(response.statusText, data);
        });
      } else if (response.status === 401) {
        throw new SessionExpiredError("JWT expired");
      } else if (response.status === 403) {
        throw new ForbiddenError("Forbidden");
      }
    }
    return response.json() as Promise<Employee[]>;
  });
};

export const addEmployeeMethod: AddEmployeeFunction = (employee, { access_token }) => {
  return fetch(`${apiUri}/employees`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(employee)
  }).then(response => {
    if (!response.ok) {
      if (response.status === 400) {
        return response.json().then(data => {
          throw new UserError(response.statusText, data);
        });
      } else if (response.status === 401) {
        throw new SessionExpiredError("JWT expired");
      } else if (response.status === 403) {
        throw new ForbiddenError("Forbidden");
      }
    }
    return response.json() as Promise<Employee>;
  });
};

export const editEmployeeMethod: EditEmployeeFunction = (id, employee, { access_token }) => {
  return fetch(`${apiUri}/employees/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(employee)
  }).then(response => {
    if (!response.ok) {
      if (response.status === 400) {
        return response.json().then(data => {
          throw new UserError(response.statusText, data);
        });
      } else if (response.status === 401) {
        throw new SessionExpiredError("JWT expired");
      } else if (response.status === 403) {
        throw new ForbiddenError("Forbidden");
      }
    }
    return response.json() as Promise<Employee>;
  });
};

export const removeEmployeeMethod: RemoveEmployeeFunction = (id, { access_token }) => {
  return fetch(`${apiUri}/employees/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    }
  }).then(response => {
    if (!response.ok) {
      if (response.status === 400) {
        return response.json().then(data => {
          throw new UserError(response.statusText, data);
        });
      } else if (response.status === 401) {
        throw new SessionExpiredError("JWT expired");
      } else if (response.status === 403) {
        throw new ForbiddenError("Forbidden");
      }
    }
    return response.json() as Promise<Employee>;
  });
};
