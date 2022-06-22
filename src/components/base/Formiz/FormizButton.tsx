import React from "react";
import { useField } from '@formiz/core'

export const FormizButton = (props): JSX.Element => {
  const {
    id,
    value,
  } = useField(props)
  const { label, type, disabled, classNameOverride } = props
  const css = classNameOverride ?? "w-full px-6 py-4 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out";
  return (
    <button
      id={id}
      type={type || 'button'}
      value={value || ''}
      disabled={disabled}
      className={css}
    >{label}</button>
  )
}