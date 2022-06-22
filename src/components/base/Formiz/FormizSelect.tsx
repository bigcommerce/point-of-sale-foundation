import React, { useState, useMemo } from "react";
import { useField } from '@formiz/core'
import Select from 'react-select';

export const FormizSelect = (props): JSX.Element => {

  const {
    errorMessage,
    id,
    isValid,
    isPristine,
    isSubmitted,
    resetKey,
    setValue,
    value,
  } = useField(props)
  const { name, defaultValue, options } = props
  const [isFocused, setIsFocused] = React.useState(false);
  const showError:boolean = !isValid && !isFocused && (!isPristine || isSubmitted)
  //const placeholder:string = !!required ? label + ' *' : label;

  const onChange = value => {
    setValue(value);
  }
  
  return (
    <div>
      <Select
        key={resetKey}
        id={id}
        name={name}
        options={options}
        defaultValue={defaultValue}
        value={value}
        classNamePrefix="form-select"
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={!isValid}
        aria-describedby={!isValid ? `${id}-error` : null}
      />
      {showError && (
        <div id={`${id}-error`} className="bg-red-100 text-red-600 rounded-md border border-red-600 p-2 mt-2">
          { errorMessage }
        </div>
      )}
    </div>
  );
};