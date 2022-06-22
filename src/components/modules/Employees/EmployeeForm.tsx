import React, { useState } from "react";
import { RoleType } from "@/shared/enums/RoleType";
import Button from "@/frontend/components/base/Button";
import { UserError } from "@/shared/methods/bigcommerce";
import InputText from "@/frontend/components/base/InputText";

const EmployeeForm = ({ employee = null, loading, error, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: (employee && employee.id) || undefined,
    firstName: (employee && employee.firstName) || "",
    lastName: (employee && employee.lastName) || "",
    pin: (employee && employee.pin) || "",
    roleId: (employee && employee.roleId) || ""
  });
  const onChange = key => event => {
    setFormData({ ...formData, [key]: event.target.value });
  };

  const displayError = error => {
    if (error instanceof UserError) {
      return error.getResponseJson().errors.message;
    }
    return error.message;
  };

  return (
    <div className="flex w-96 py-2 flex-col justify-between">
      <div className="flex items-center py-2">
        <span className="w-2/6 font-bold px-3">First Name</span>
        <InputText className="w-4/6" value={formData.firstName} onChange={onChange("firstName")} />
      </div>
      <div className="flex items-center py-2">
        <span className="w-2/6 font-bold px-3">Last Name</span>
        <InputText className="w-4/6" value={formData.lastName} onChange={onChange("lastName")} />
      </div>
      <div className="flex items-center py-2">
        <span className="w-2/6 font-bold px-3">Pin Code</span>
        <InputText className="w-4/6" value={formData.pin} onChange={onChange("pin")} />
      </div>
      <div className="flex items-center py-2">
        <span className="w-2/6 font-bold px-3">Role</span>
        <p className="w-4/6 pr-4">
          <select
            className="w-full px-3 py-2 text-xl bg-gray-50 rounded-md outline-blue-200 shadow-dark"
            value={formData.roleId}
            onChange={onChange("roleId")}
          >
            <option></option>
            {Object.keys(RoleType).map(key => (
              <option key={key} value={RoleType[key]}>
                {key}
              </option>
            ))}
          </select>
        </p>
      </div>
      <div className="py-4 flex justify-end">
        <Button className="w-1/2" onClick={() => onCancel(formData)} disabled={loading}>
          Cancel
        </Button>
        <Button
          theme="success"
          className="w-1/2"
          onClick={() => onSubmit(formData)}
          disabled={loading}
          loader={loading}
        >
          {formData.id ? "Update" : "Add"}
        </Button>
      </div>
      <div className="px-2 py-1">
        {error && (
          <div className="px-2 py-1 bg-red-200 text-red-600 rounded border border-red-600">
            {displayError(error)}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeForm;
