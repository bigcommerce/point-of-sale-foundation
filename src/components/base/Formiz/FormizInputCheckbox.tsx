import React from "react";
import { useField } from "@formiz/core";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";

export const FormizInputCheckbox = (props): JSX.Element => {
  const { errorMessage, id, isValid, isPristine, isSubmitted, resetKey, setValue, value } =
    useField(props);
  const { name, label, required, defaultChecked, onClick } = props;

  const [isFocused, setIsFocused] = React.useState(false);
  const showError: boolean = !isValid && !isFocused && (!isPristine || isSubmitted);
  const placeholder: string = !!required ? label + " *" : label;
  const [checked, setChecked] = React.useState(defaultChecked);

  if (checked && isNullOrUndefined(value)) {
    setValue(checked);
  }

  const handleChange = (e: any) => {
    setValue(e.target.checked);
    setChecked(e.target.checked);
  };
  return (
    <div>
      <input
        key={resetKey}
        id={id}
        name={name}
        type="checkbox"
        placeholder={placeholder}
        checked={value}
        onClick={onClick}
        onChange={e => handleChange(e)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={!isValid}
        aria-describedby={!isValid ? `${id}-error` : null}
      />{" "}
      {label}
      {showError && (
        <div
          id={`${id}-error`}
          className="bg-red-100 text-red-600 rounded-md border border-red-600 p-2 mt-2"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};
