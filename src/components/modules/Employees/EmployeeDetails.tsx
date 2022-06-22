import React, { useState } from "react";
import { RoleType } from "@/shared/enums/RoleType";
import { XIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";

const EmployeeDetails = ({ employee, onEdit, onRemove, onCancel }) => {
  const [showPin, setShowPin] = useState(false);
  const role = Object.keys(RoleType).find(
    key => RoleType[key] === employee.roleId
  );
  return (
    <div className="flex w-96 flex-col justify-between">
      <div className="flex py-1">
        <a
          className="flex flex-nowrap items-center min-w-fit w-full"
          onClick={() => onEdit(employee)}
        >
          <PencilIcon className="h-8 w-8 mx-4 my-3 inline-block" />
        </a>
        <a
          className="flex flex-nowrap items-center min-w-fit w-full"
          onClick={() => onRemove(employee)}
        >
          <TrashIcon className="h-8 w-8 mx-4 my-3 text-red-600 inline-block" />
        </a>
        <a
          className="flex flex-nowrap items-center min-w-fit w-full"
          onClick={() => onCancel(employee)}
        >
          <XIcon className="h-8 w-8 mx-4 my-3 inline-block" />
        </a>
      </div>
      <div className="flex py-1">
        <span className="w-2/5 font-bold px-3">First Name</span>
        <p className="w-3/5">{employee.firstName}</p>
      </div>
      <div className="flex py-1">
        <span className="w-2/5 font-bold px-3">Last Name</span>
        <p className="w-3/5">{employee.lastName}</p>
      </div>
      <div className="flex py-1">
        <span className="w-2/5 font-bold px-3">Role</span>
        <p className="w-3/5">{role}</p>
      </div>
      <div className="flex py-1">
        <span className="w-2/5 font-bold px-3">Pin Code</span>
        <p className="w-3/5">
          <span className={showPin ? "" : "blur-sm"}>
            {showPin ? employee.pin : "####"}
          </span>
          <button
            className="mx-2 px-2 py-0.5 rounded-full text-gray-50 bg-slate-400 shadow"
            onClick={() => setShowPin(!showPin)}
          >
            {showPin ? "Hide" : "Show"}
          </button>
        </p>
      </div>
    </div>
  );
};
export default EmployeeDetails;
