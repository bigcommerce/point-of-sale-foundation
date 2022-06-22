import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import GlobalProvider from "../providers/GlobalProvider";
import withAuth, { withAuthServerSideProps } from "@/frontend/hocs/withAuth";
import { DotIcon, PlusIcon } from "@/frontend/components/icons";
import EmployeeTile from "@/frontend/components/modules/Employees/EmployeeTile";
import EmployeeSection from "@/frontend/components/modules/Employees/EmployeeSection";
import EmployeeDetails from "@/frontend/components/modules/Employees/EmployeeDetails";
import EmployeeForm from "@/frontend/components/modules/Employees/EmployeeForm";
import EmployeeRemoveDialog from "@/frontend/components/modules/Employees/EmployeeRemoveDialog";
import { useEmployeeContext } from "@/frontend/providers/EmployeeProvider";
import { RoleType } from "@/shared/enums/RoleType";
import Loader from "@/frontend/components/base/Loader";
import InputText from "@/frontend/components/base/InputText";
import { SearchIcon } from "@heroicons/react/outline";
import Button from "@/frontend/components/base/Button";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(async context => {
  return {
    props: {}
  };
});

const employeesInitObj = () => {
  return Object.keys(RoleType).reduce((previousValue, currentValue) => {
    previousValue[RoleType[currentValue]] = [];
    return previousValue;
  }, {});
};

const rolesIdMap = Object.keys(RoleType).reduce((previousValue, currentValue) => {
  previousValue[RoleType[currentValue]] = currentValue;
  return previousValue;
}, {});

const EmployeesPage = (props): JSX.Element => {
  const { state, actions } = useEmployeeContext();
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState({});
  const [removeDialog, setRemoveDialog] = useState(false);
  const [formState, setFormState] = useState("default");

  useEffect(() => {
    actions.getEmployees();
  }, []);

  useEffect(() => {
    const searchRegex = new RegExp(search, "i");
    const employeeFilter = search
      ? state.employees.filter(
          employee => searchRegex.test(employee.firstName) || searchRegex.test(employee.lastName)
        )
      : state.employees;
    const employeeState = employeeFilter.reduce((previousValue, employee) => {
      if (!previousValue[employee.roleId]) {
        previousValue[employee.roleId] = [];
      }
      previousValue[employee.roleId].push(employee);
      return previousValue;
    }, employeesInitObj());
    setEmployees(employeeState);
  }, [state.employees, search]);

  const onEmployeeClick = employee => async () => {
    await actions.getEmployeeDetails(employee.id);
    setFormState("details");
  };

  useEffect(() => {
    (async () => {
      if (isNullOrUndefined(state.errors.addEmployee)) {
        await actions.clearEmployeeDetails();
        await actions.getEmployees();
        setFormState("default");
      }
    })();
  }, [state.errors.addEmployee]);

  const onAddClick = () => {
    setFormState("add");
  };
  const onAddSubmit = async employee => {
    try {
      await actions.addEmployee(employee);
    } catch (e) {
      console.error("Add Employee Error", e);
    }
  };

  const onAddCancel = async () => {
    await actions.clearErrors();
    await actions.clearEmployeeDetails();
    setFormState("default");
  };

  const onEditClick = async employee => {
    await actions.getEmployeeDetails(employee.id);
    setFormState("edit");
  };

  const onEditSubmit = async employee => {
    try {
      await actions.editEmployee(employee.id, { ...employee, id: undefined });
      await actions.clearEmployeeDetails();
      await actions.getEmployees();
      setFormState("default");
    } catch (e) {
      console.error("Edit Employee Error", e);
    }
  };

  const onEditCancel = async () => {
    await actions.clearErrors();
    await actions.clearEmployeeDetails();
    setFormState("default");
  };

  const onDetailsCancel = async () => {
    await actions.clearErrors();
    await actions.clearEmployeeDetails();
    setFormState("default");
  };

  const onRemoveClick = async employee => {
    setRemoveDialog(true);
  };

  const onRemoveSubmit = async employee => {
    await actions.removeEmployee(employee.id);
    setRemoveDialog(false);
    await actions.clearEmployeeDetails();
    await actions.getEmployees();
    setFormState("default");
  };

  const onRemoveCancel = async employee => {
    await actions.clearErrors();
    setRemoveDialog(false);
  };

  const onSearchChange = event => {
    if (event && event.target) {
      setSearch(event.target.value);
    }
  };

  return (
    <GlobalProvider>
      <>
        {removeDialog && (
          <EmployeeRemoveDialog
            employee={state.employeeDetails}
            loading={state.loaders.removeEmployee}
            onSubmit={onRemoveSubmit}
            onCancel={onRemoveCancel}
          />
        )}
        <div className="flex justify-between w-screen mb-0.5 bg-gray-50 shadow">
          <div className="font-bold py-4 px-5"></div>
          <div className="flex justify-between w-112 py-4 px-2">
            <PlusIcon />
            <h3 className="font-bold">Employee Details</h3>
            <DotIcon />
          </div>
        </div>
        <div className="flex justify-between w-screen">
          <div className="w-full h-screen--navbar overflow-x-hidden overflow-y-scroll">
            <div className="">
              <InputText
                className="mt-4 mx-6"
                inputClassName="transition-all w-36 focus:w-72 valid:w-72"
                icon={SearchIcon}
                onChange={onSearchChange}
                cancel={true}
                placeholder="Search..."
              />
            </div>
            {state.loaders.getEmployees && !state.employees.length && (
              <div className="flex flex-initial w-full h-full items-center justify-items-center justify-center">
                <Loader />
              </div>
            )}
            {Object.keys(employees).map(key => (
              <EmployeeSection key={rolesIdMap[key]} role={rolesIdMap[key]}>
                {employees[key].map(employee => (
                  <EmployeeTile
                    key={employee.id}
                    active={state.employeeDetails && state.employeeDetails.id === employee.id}
                    onClick={onEmployeeClick(employee)}
                    {...employee}
                  />
                ))}
              </EmployeeSection>
            ))}
          </div>
          <div className="h-screen--navbar w-112 bg-gray-50 shadow">
            {state.loaders.getEmployeeDetails && (
              <div className="flex flex-initial w-112 h-full items-center justify-items-center justify-center">
                <Loader />
              </div>
            )}
            {formState === "default" && (
              <div className="flex flex-initial w-112 h-full items-center justify-items-center justify-center">
                <Button className="w-1/2" onClick={onAddClick}>
                  Add Employee
                </Button>
              </div>
            )}
            {formState === "details" && state.employeeDetails && (
              <EmployeeDetails
                employee={state.employeeDetails}
                onEdit={onEditClick}
                onRemove={onRemoveClick}
                onCancel={onDetailsCancel}
              />
            )}
            {formState === "edit" && state.employeeDetails && (
              <EmployeeForm
                employee={state.employeeDetails}
                loading={state.loaders.editEmployee}
                error={state.errors.editEmployee}
                onSubmit={onEditSubmit}
                onCancel={onEditCancel}
              />
            )}
            {formState === "add" && (
              <EmployeeForm
                loading={state.loaders.addEmployee}
                error={state.errors.addEmployee}
                onSubmit={onAddSubmit}
                onCancel={onAddCancel}
              />
            )}
          </div>
        </div>
      </>
    </GlobalProvider>
  );
};

export default withAuth(EmployeesPage);
