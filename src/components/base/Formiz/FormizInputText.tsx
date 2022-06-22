import React from "react";
import { useField } from "@formiz/core";

export const FormizInputText = (props): JSX.Element => {
  const { errorMessage, id, isValid, isPristine, isSubmitted, resetKey, setValue, value } =
    useField(props);
  const { name, label, type, defaultValue, required, placeholder, classNameOverride } = props;
  const [isFocused, setIsFocused] = React.useState(false);
  const showError: boolean = !isValid && !isFocused && (!isPristine || isSubmitted);
  let pholder: string = !!required ? label + " *" : label;
  const css =
    classNameOverride ??
    "block w-full px-3 py-3 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

  const input_value = defaultValue ? defaultValue : value;

  if (placeholder) {
    pholder = placeholder;
    if (required) {
      pholder = pholder + " *";
    }
  }

  return (
    <div>
      <input
        key={resetKey}
        id={id}
        name={name}
        type={type || "text"}
        value={input_value}
        placeholder={pholder}
        className={css}
        onChange={e => {
          setValue(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={!isValid}
        aria-describedby={!isValid ? `${id}-error` : null}
      />
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
