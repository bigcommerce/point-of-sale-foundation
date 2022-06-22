import React from "react";

const themes = {
  primary: "text-white bg-slate-400",
  success: "text-white bg-emerald-500",
  danger: "text-white bg-red-500"
};

const ButtonLoader = (): JSX.Element => {
  return (
    <svg
      className="animate-spin absolute mt-1 right-4 h-5 w-5 text-gray-50 inline"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-40"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

const Button = ({
  className = "",
  disabled = false,
  loader = false,
  onClick = () => {},
  theme = "primary",
  children
}) => (
  <button
    className={`relative mx-2 px-4 py-3 text-xl rounded-lg shadow ${className} ${themes[theme]}`}
    {...{ onClick, disabled }}
  >
    {children}
    {loader && <ButtonLoader />}
  </button>
);

export default Button;
