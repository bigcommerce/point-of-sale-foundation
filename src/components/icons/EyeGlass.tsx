type EyeGlassIconProps = {
  className?: string;
};

const EyeGlassIcon = ({ className }: EyeGlassIconProps): JSX.Element => {
  if (!className) {
    className = "";
  }
  if (className.indexOf("h-") === -1) {
    className += " h-6";
  }
  if (className.indexOf("w-") === -1) {
    className += " w-6";
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      ></path>
    </svg>
  );
};

export default EyeGlassIcon;
