import React, { useState } from "react";

const Dialog = ({
  children,
  submitButtonClassName = "mx-2 px-3 py-2 rounded-lg text-gray-50 bg-slate-400 shadow",
  submitButtonChildren,
  cancelButtonClassName = "mx-2 px-3 py-2 rounded-lg text-gray-50 bg-slate-400 shadow",
  cancelButtonChildren,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opaque-500">
      <div className="px-6 py-4 rounded-lg bg-gray-50">
        <div>{children}</div>
        <div>
          <button className={cancelButtonClassName} onClick={() => onCancel()}>
            {cancelButtonChildren}
          </button>
          <button className={submitButtonClassName} onClick={() => onSubmit()}>
            {submitButtonChildren}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
