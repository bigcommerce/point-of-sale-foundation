const OrderNotesSection = ({ children }): JSX.Element => (
  <div className="w-full p-6">
    <h2 className="text-lg text-center font-bold mb-2">Order Notes</h2>
    {children}
  </div>
);

export default OrderNotesSection;
