type MenuIconProps = {
  className?: string;
};

const MenuIcon = ({ className }: MenuIconProps): JSX.Element => {
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
        d="M4 6h16M4 12h16M4 18h7"
      ></path>
    </svg>
  );
};

export default MenuIcon;
