import { useCartContext } from "@/frontend/providers/CartProvider";
import {
  CreditCardIcon,
  CashIcon,
  TableIcon
} from "@heroicons/react/outline";

const TenderOption = ({ title, subtitle, Icon, onClick }: { title: string, subtitle?: string, Icon: any, onClick: () => void })  => (
  <div
    className="w-5/12 m-3 bg-white flex flex-col items-center py-8 px-8 shadow-md cursor-pointer"
    onClick={() => onClick()}
  >
    <Icon className="w-20 text-black" />
    <h2 className="text-4xl">{title}</h2>
    {subtitle && <div className="text-sm">{subtitle}</div>}
  </div>
)

const TenderSelect = ({ viewTenderCashPage, viewTenderCreditCardPage }) => {
  const { actions } = useCartContext();

  return (
    <div className="flex justify-center flex-wrap m-auto w-full mt-12">
      <TenderOption title="Credit Card" subtitle="Terminal" Icon={CreditCardIcon} onClick={() => {
        actions.clearErrors();
        actions.collectTerminalPayment();
      }} />
      <TenderOption title="Credit Card" subtitle="Manual Entry" Icon={TableIcon} onClick={() => {
        actions.clearErrors();
        viewTenderCreditCardPage();
      }} />
      <TenderOption title="Cash" Icon={CashIcon} onClick={() => {
        actions.clearErrors();
        viewTenderCashPage();
      }} />
    </div>
  );
};

export default TenderSelect;
