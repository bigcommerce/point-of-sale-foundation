import React, { useState } from "react";
import { useRouter } from "next/router";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";
import { destroyCookie } from "nookies";
import {
  EmployeeContext,
  GetEmployeeDetailsAction,
  GetEmployeesAction,
  AddEmployeeAction,
  EditEmployeeAction,
  RemoveEmployeeAction,
  ClearEmployeesAction,
  ClearEmployeeDetailsAction,
  ClearErrorsAction
} from "./context";
import {
  getEmployeeDetailsMethod,
  getEmployeesMethod,
  addEmployeeMethod,
  editEmployeeMethod,
  removeEmployeeMethod
} from "./methods";
import { SessionExpiredError } from "@/shared/methods/bigcommerce";
export * from "./context";

const EmployeeProvider = (props: { access_token: string; children: React.ReactElement | any }) => {
  const { access_token, children } = props;
  const router = useRouter();
  const [getEmployeeDetailsLoader, setGetEmployeeDetailsLoader] = useState(false);
  const [getEmployeesLoader, setGetEmployeesLoader] = useState(false);
  const [addEmployeeLoader, setAddEmployeeLoader] = useState(false);
  const [editEmployeeLoader, setEditEmployeeLoader] = useState(false);
  const [removeEmployeeLoader, setRemoveEmployeeLoader] = useState(false);

  const [getEmployeeDetailsError, setGetEmployeeDetailsError] = useState(null);
  const [getEmployeesError, setGetEmployeesError] = useState(null);
  const [addEmployeeError, setAddEmployeeError] = useState(null);
  const [editEmployeeError, setEditEmployeeError] = useState(null);
  const [removeEmployeeError, setRemoveEmployeeError] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState(null);

  const actionBuilder = ({ setLoader, setData, setError, execMethod }) =>
    function (...args) {
      args = Array.from(args).concat([{ access_token }]);
      setError(null);
      setLoader(true);
      return execMethod
        .apply(this, args)
        .then(data => {
          if (isNullOrUndefined(data.status)) {
            setData(data);
          } else {
            setError(data);
          }
          setLoader(false);
          return data;
        })
        .catch(e => {
          if (e instanceof SessionExpiredError) {
            destroyCookie(null, "access_token");
            destroyCookie(null, "first_time");
            destroyCookie(null, "employee");
            router.reload();
            return null;
          }
          setError(e);
          setLoader(false);
          throw e;
        });
    };

  const getEmployeeDetails: GetEmployeeDetailsAction = actionBuilder({
    setLoader: setGetEmployeeDetailsLoader,
    setData: setEmployeeDetails,
    setError: setGetEmployeeDetailsError,
    execMethod: getEmployeeDetailsMethod
  });

  const getEmployees: GetEmployeesAction = actionBuilder({
    setLoader: setGetEmployeesLoader,
    setData: setEmployees,
    setError: setGetEmployeesError,
    execMethod: getEmployeesMethod
  });

  const addEmployee: AddEmployeeAction = actionBuilder({
    setLoader: setAddEmployeeLoader,
    setData: () => {},
    setError: setAddEmployeeError,
    execMethod: addEmployeeMethod
  });

  const editEmployee: EditEmployeeAction = actionBuilder({
    setLoader: setEditEmployeeLoader,
    setData: () => {},
    setError: setEditEmployeeError,
    execMethod: editEmployeeMethod
  });

  const removeEmployee: RemoveEmployeeAction = actionBuilder({
    setLoader: setRemoveEmployeeLoader,
    setData: () => {},
    setError: setRemoveEmployeeError,
    execMethod: removeEmployeeMethod
  });

  const clearEmployees: ClearEmployeesAction = async () => {
    setEmployees([]);
    return null;
  };

  const clearEmployeeDetails: ClearEmployeeDetailsAction = async () => {
    setEmployeeDetails(null);
    return null;
  };

  const clearErrors: ClearErrorsAction = async () => {
    getEmployeeDetailsError && setGetEmployeeDetailsError(null);
    getEmployeesError && setGetEmployeesError(null);
    addEmployeeError && setAddEmployeeError(null);
    editEmployeeError && setEditEmployeeError(null);
    removeEmployeeError && setRemoveEmployeeError(null);
    return null;
  };

  const value = {
    state: {
      loaders: {
        getEmployeeDetails: getEmployeeDetailsLoader,
        getEmployees: getEmployeesLoader,
        addEmployee: addEmployeeLoader,
        editEmployee: editEmployeeLoader,
        removeEmployee: removeEmployeeLoader
      },
      errors: {
        getEmployeeDetails: getEmployeeDetailsError,
        getEmployees: getEmployeesError,
        addEmployee: addEmployeeError,
        editEmployee: editEmployeeError,
        removeEmployee: removeEmployeeError
      },
      employees,
      employeeDetails
    },
    actions: {
      getEmployeeDetails,
      getEmployees,
      addEmployee,
      editEmployee,
      removeEmployee,
      clearEmployees,
      clearEmployeeDetails,
      clearErrors
    }
  };

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
};
export default EmployeeProvider;
