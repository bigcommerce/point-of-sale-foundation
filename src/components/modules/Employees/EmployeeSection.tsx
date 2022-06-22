const EmployeeSection = ({ role, children }) => (
  <div key={role} className="w-full">
    <div className="flex items-center w-full px-3 py-2">
      <span className="text-lg text-gray-500">{role}s</span>
      <div className="h-1 w-full ml-3 shadow"></div>
    </div>
    <div className="flex flex-wrap justify-start content-start gap-2 my-1 mx-2 w-full">
      {children}
    </div>
  </div>
);

export default EmployeeSection;
