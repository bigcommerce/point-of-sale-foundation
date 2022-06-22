import { useEffect, useState } from "react";
import { BackspaceIcon } from "@heroicons/react/solid";
import { useCartContext } from "@/frontend/providers/CartProvider";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";

const TenderCash = () => {
  const { state, actions: cartActions } = useCartContext();
  const [ presetAmounts, setPresetAmounts ] = useState({});
  const [ tenderAmount, setTenderAmount ] = useState(state?.checkout?.grand_total?.toString());
  const maxTenderFieldLength = 10;
  const isMoney = true;
  const SEP = '.';

  useEffect(() => {
    setPresetAmounts({ 
      'one': nextIntegralBillAmount(1),
      'two': nextIntegralBillAmount(5, 'one'),
      'three': nextIntegralBillAmount(10, 'two'),
      'four': nextIntegralBillAmount(20, 'three'),
    })
  }, []);

  const currency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const nextIntegralBillAmount = (size: number, minProperty = '') => {
    const amountDue = state?.checkout?.grand_total;

    if (amountDue) {
        let minAmount = minProperty.length === 0 ? 0 : presetAmounts[minProperty]; 

        if(isNullOrUndefined(minAmount)) { 
            minAmount = 0; 
        }

        let billAmount = Math.max(minAmount + 1, Math.ceil(amountDue));
        while (billAmount % size !== 0) billAmount += 1;
        return billAmount.toString();
    } else {
        return '';
    }
  }

  const formatMoney = (newStringVal) => { 
    const minLength = 4; 
    const sepIndex = newStringVal.indexOf(SEP)
    
    if (sepIndex !== -1) { 
      // Remove separator
      const parts = newStringVal.split(SEP); 
      newStringVal = parts[0] + parts[1]; 
    }

    // Remove leading zeroes
    newStringVal = parseInt(newStringVal, 10) + ''; 

    const totalLength = newStringVal.length; 

    if (totalLength < minLength) { 
      const zeroPadding = (new Array(minLength - totalLength).join('0'));
      newStringVal = zeroPadding + newStringVal;
    } 

    return newStringVal.slice(0,-2) + SEP + newStringVal.slice(-2);
  }

  const appendDigit = (digit) => { 
    let newStringVal = tenderAmount + digit;

    if (newStringVal.length > maxTenderFieldLength) {
      newStringVal = newStringVal.substr(1);
    }

    if (isMoney) {
        newStringVal = formatMoney(newStringVal); 
    }

    setTenderAmount(newStringVal);
  }

  const appendSep = () => {
    const v = tenderAmount.trim()

    if(v.length > 0) {
      const sp = v.indexOf(SEP)

      if(sp !== -1) {
        // Already contains a seperator
        setTenderAmount(v.slice(0,sp) + v.slice(sp+1,v.length) + SEP)
      } else {
        setTenderAmount(v + SEP)
      }
    } else {
      setTenderAmount('0' + SEP)
    }
  }

  const backspace = () => { 
    let v = tenderAmount

    if((typeof v === 'string') && v.length > 0) { 
      v = v.slice(0, -1)

      if(isMoney) { 
        v = formatMoney(v)
      }

      setTenderAmount(v)
    }
  }

  const clear = () => {
    setTenderAmount('')
  }

  return (
      <form noValidate>
        <div className="form-group p-1 flex flex-row w-96	justify-between items-center rounded bg-gray-200">
          <div className="flex flex-col basis-80 mr-2">
            <input
              name="tender_amount"
              value={tenderAmount}
              className="block w-full px-3 py-3 text-base font-normal text-gray-700 bg-gray-200 bg-clip-padding border-0 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              readOnly
            />
          </div>
          <div className="flex flex-col basis-16">
            <button type="button" className="border rounded border-gray-400 p-2" onClick={() => clear()}>Clear</button>
          </div>
        </div>
        
        <div className="mt-2 flex w-96 justify-between items-center rounded bg-white">
          {Object.keys(presetAmounts).map(key => (
            <button type="button" className="border p-2 w-1/4" onClick={() => setTenderAmount(presetAmounts[key])} key={key}>{currency(presetAmounts[key])}</button>
          ))}
        </div>
       
        <div className="mt-2 flex flex-wrap w-96 justify-between items-center rounded bg-white">
          <button type="button" className="border p-5 w-1/3 text-4xl" onClick={() => appendDigit('1')}>1</button>
          <button type="button" className="border p-5 w-1/3 text-4xl" onClick={() => appendDigit('2')}>2</button>
          <button type="button" className="border p-5 w-1/3 text-4xl" onClick={() => appendDigit('3')}>3</button>
          <button type="button" className="border p-5 w-1/3 text-4xl" onClick={() => appendDigit('4')}>4</button>
          <button type="button" className="border p-5 w-1/3 text-4xl" onClick={() => appendDigit('5')}>5</button>
          <button type="button" className="border p-5 w-1/3 text-4xl" onClick={() => appendDigit('6')}>6</button>
          <button type="button" className="border p-5 w-1/3 text-4xl" onClick={() => appendDigit('7')}>7</button>
          <button type="button" className="border p-5 w-1/3 text-4xl" onClick={() => appendDigit('8')}>8</button>
          <button type="button" className="border p-5 w-1/3 text-4xl" onClick={() => appendDigit('9')}>9</button>
          <button type="button" className="border p-5 w-1/3 text-4xl" onClick={() => appendDigit('0')}>0</button>
          <button type="button" className="border p-5 w-1/3 text-4xl" onClick={() => appendDigit('00')}>00</button>
          <button type="button" className="border p-5 w-1/3 text-4xl" onClick={() => backspace()}><BackspaceIcon className="inline h-8 w-8" /></button>
        </div>

        <div className="form-group">
          <button
            type="button"
            className="w-full px-6 py-4 mt-4 bg-emerald-500 text-white rounded shadow-md focus:shadow-lg focus:outline-none focus:bg-emerald-700 focus:ring-0 disabled:bg-slate-200 disabled:shadow-none transition ease-in-out"
            disabled={parseFloat(tenderAmount) <= 0}
            onClick={async () => {
                await cartActions.processCashPayment({ 
                  order_id: state?.orderId,
                  amount_paid: parseFloat(tenderAmount),
                  order_total: state?.checkout?.grand_total
                });
              }
            }
          >
            Pay
          </button>
        </div>
      </form>
  );
};

export default TenderCash;