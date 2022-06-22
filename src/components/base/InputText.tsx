import React, { useRef } from "react";
import { XIcon } from "@heroicons/react/outline";

const InputText = ({
  className = "",
  inputClassName = "",
  icon: Icon = null,
  placeholder = "",
  onChange = null,
  value = "",
  cancel = false,
  invalid = false,
  disabled = false
}) => {
  const inputRef = useRef(null);
  const inputSizeClassName = `${Icon ? "pl-10" : "px-3"} py-2`;
  const inputStylesClassName =
    "peer text-xl bg-gray-50 rounded-md outline-blue-200 shadow-dark";
  const onCancel = () => {
    if (inputRef && inputRef.current) {
      // Create js native value setter call on react input ref
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      nativeInputValueSetter.call(inputRef.current, "");
      // dispatch onChange event
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };
  return (
    <div className={`relative ${className} inline-block`}>
      <input
        ref={inputRef}
        className={`${inputClassName} ${inputSizeClassName} ${inputStylesClassName}`}
        type="text"
        required
        {...{ value, onChange, placeholder, disabled }}
      />
      {Icon && (
        <div className="absolute top-0 left-0 px-2 py-2.5">
          <Icon className="w-6 h-6 text-gray-500" />
        </div>
      )}
      {cancel && (
        <button
          className="absolute opacity-0 peer-valid:opacity-100 top-0 right-0 px-2 py-2.5"
          onClick={onCancel}
        >
          <XIcon className="w-6 h-6 text-red-500" />
        </button>
      )}
    </div>
  );
};

export default InputText;
