import React from "react";
import Panel from "@/frontend/components/base/Panel";

const NUMPAD = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["Clear", "0", "Del"]
];

interface PinNumpadProps {
  pin: (number | undefined)[];
  isValidating: boolean;
  changeFocus: (pinIndex: number) => void;
  onPinChange: (pinEntry: number | undefined, index: number) => void;
  clearPinInput: () => void;
}

const PinNumpad = ({
  pin,
  isValidating,
  changeFocus,
  clearPinInput,
  onPinChange
}: PinNumpadProps): JSX.Element => {
  const getIndex = (): number => pin.findIndex(value => value === undefined);

  const onKeyPress = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (e.currentTarget.value) {
      const value = e.currentTarget.value;
      switch (value) {
        case "Clear":
          clearPinInput();
          changeFocus(0);
          break;
        case "Del":
          onDelete();
          break;
        default:
          const pinEntry = Number(value.trim());
          onPinChange(pinEntry, getIndex());
          changeFocus(getIndex());
      }
    }
  };

  const onDelete = (): void => {
    const index = getIndex() - 1;

    if (index < 0) return;

    if (pin[index] === undefined && index > 0) {
      changeFocus(index - 1);
    } else {
      onPinChange(undefined, index);
      changeFocus(index);
    }
  };

  return (
    <div className="w-full">
      <Panel>
        {NUMPAD.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row w-full gap-1">
            {row.map((value, index) => (
              <button
                key={index}
                value={value}
                onClick={onKeyPress}
                className="flex-grow w-0 p-10 box-border border-2 rounded disabled:bg-slate-100"
                disabled={isValidating}
              >
                {value}
              </button>
            ))}
          </div>
        ))}
      </Panel>
    </div>
  );
};

export default PinNumpad;
