const EmployeeTile = ({ id, firstName, lastName, active, onClick }) => {
  if (!onClick) {
    onClick = () => {};
  }
  return (
    <div
      key={id}
      onClick={onClick}
      className={`flex h-24 w-72 shadow ${
        active ? "bg-slate-300" : "bg-gray-50"
      } overflow-hidden`}
    >
      <div className="my-auto px-4 text-center">
        <div className="flex justify-center items-center rounded-full uppercase inline-block text-3xl text-gray-50 bg-gray-300 w-16 h-16">
          {firstName && firstName.charAt(0)}
          {lastName && lastName.charAt(0)}
        </div>
      </div>
      <div className="my-auto">
        <p className="font-bold text-gray-800">
          {firstName || "(Empty)"}
          <br />
          {lastName || "(Empty)"}
        </p>
        <span className="text-gray-600"></span>
      </div>
    </div>
  );
};

export default EmployeeTile;
