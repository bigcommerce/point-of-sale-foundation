import React, { useEffect, useState } from "react";
import { useField } from '@formiz/core'

export const FormizTextarea = (props): JSX.Element => {
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
  const { name, label, required } = props
  const [isFocused, setIsFocused] = useState(false);
  const showError:boolean = !isValid && !isFocused && (!isPristine || isSubmitted)
  const placeholder:string = !!required ? label + ' *' : label;

  useEffect(() => {
    setIsFocused(false);
  }, [resetKey]);
  
  return (

    <div>

      <textarea 
        key={resetKey}
        id={id}
        name={name}
        value={value ?? ''} 
        placeholder={placeholder}
        className="block
        w-full
        px-3
        py-3
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        onChange={e => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={!isValid}
        aria-describedby={!isValid ? `${id}-error` : null}
      ></textarea>
      {showError && (
        <div id={`${id}-error`} className="dbg-red-100 text-red-600 rounded-md border border-red-600 p-2 mt-2">
          { errorMessage }
        </div>
      )}
    </div>
  
  )
}