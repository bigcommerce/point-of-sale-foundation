import React, { useEffect, useRef } from "react";
import styles from "./PinEntry.module.css";
import { removeFromArray } from "@/frontend/utils/removeFromArray";
import PinNumPad from "./PinNumpad";

interface PinEntryProps {
  pin: (number | undefined)[];
  pinLength: number;
  isValidating: boolean;
  onPinChange: (pinEntry: number | undefined, index: number) => void;
  clearPinInput: () => void;
}

const PIN_MIN_VALUE = 0;
const PIN_MAX_VALUE = 9;
const BACKSPACE_KEY = "Backspace";

const PinEntry = ({
  pin,
  pinLength,
  isValidating,
  onPinChange,
  clearPinInput
}: PinEntryProps): JSX.Element => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const changeFocus = (pinIndex: number) => {
    const ref = inputRefs.current[pinIndex];
    if (ref) {
      ref.focus();
    }
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const previousValue = event.target.defaultValue;
    const values = event.target.value.split("");

    removeFromArray(values, previousValue);

    const currentValue = values.pop();

    if (!currentValue) return;

    const pinNumber = Number(currentValue.trim());

    if (isNaN(pinNumber) || currentValue.trim().length === 0) return;

    if (pinNumber >= PIN_MIN_VALUE && pinNumber <= PIN_MAX_VALUE) {
      onPinChange(pinNumber, index);

      if (index < pinLength - 1) {
        changeFocus(index + 1);
      }
    }
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const keyCode = event.nativeEvent.code;

    if (keyCode !== BACKSPACE_KEY) return;

    if (pin[index] === undefined) {
      changeFocus(index - 1);
    } else {
      onPinChange(undefined, index);
    }
  };

  useEffect(() => {
    changeFocus(0);
  }, []);

  return (
    <div className="flex flex-col h-screen justify-center w-full">
      <div className="flex items-center justify-center gap-3 my-4">
        {Array.from({ length: pinLength }, (_, index) => (
          <input
            key={index}
            ref={el => {
              if (el) inputRefs.current[index] = el;
            }}
            type="text"
            onChange={event => onChange(event, index)}
            value={pin[index] ?? ""}
            inputMode="none"
            onKeyDown={event => onKeyDown(event, index)}
            autoComplete="off"
            className={`rounded ${styles.pinInputField} disabled:bg-slate-300 disabled:text-gray-500`}
            disabled={isValidating}
          />
        ))}
      </div>
      <PinNumPad
        pin={pin}
        isValidating={isValidating}
        changeFocus={changeFocus}
        onPinChange={onPinChange}
        clearPinInput={clearPinInput}
      />
    </div>
  );
};

export default PinEntry;
