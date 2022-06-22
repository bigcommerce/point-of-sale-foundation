import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/outline";
import Button from "@/frontend/components/base/Button";

const Dialog = ({ employee, loading, onSubmit, onCancel }) => {
  return (
    <div className="fixed z-40 inset-0 flex justify-center items-center bg-opaque-500">
      <div className="px-6 py-8 max-w-sm rounded-lg bg-gray-50 shadow-lg">
        <div className="flex justify-center pb-6">
          <span className="text-center text-xl">
            Are you sure you want to remove '{employee.firstName}{" "}
            {employee.lastName}'?
          </span>
        </div>
        <div className="flex justify-between">
          <Button
            className="w-1/2"
            onClick={() => onCancel(employee)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="w-1/2"
            theme="danger"
            onClick={() => onSubmit(employee)}
            disabled={loading}
          >
            <span>
              <TrashIcon className="w-6 h-6 -mt-1 inline-block" /> Remove
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
