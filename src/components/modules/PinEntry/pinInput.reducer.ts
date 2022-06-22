/**
 * Potential Improvements:
 *
 * - move isValidating state from Login.tsx to this file under ValidationState interface
 * - include dispatch actions for setting isValidating state
 */

export enum ACTION {
  SET_PIN = "SET_PIN",
  SET_VALIDATION = "SET_VALIDATION",
  RESET_PIN = "RESET_PIN"
}

export const PIN_LENGTH = 4;

interface ValidationState {
  message?: string;
  isValid?: boolean;
}

interface State {
  pin: Array<number | undefined>;
  validation: ValidationState;
}

type ActionType =
  | {
      type: ACTION.SET_PIN;
      pin: Array<number | undefined>;
    }
  | {
      type: ACTION.SET_VALIDATION;
      validation: ValidationState;
    }
  | {
      type: ACTION.RESET_PIN;
    };

const reducer = (state: State, action: ActionType) => {
  switch (action.type) {
    case ACTION.SET_PIN:
      return {
        ...state,
        pin: action.pin
      };
    case ACTION.SET_VALIDATION:
      return {
        ...state,
        validation: action.validation
      };
    case ACTION.RESET_PIN:
      return {
        ...state,
        pin: new Array(PIN_LENGTH)
      };
  }
};

export default reducer;
