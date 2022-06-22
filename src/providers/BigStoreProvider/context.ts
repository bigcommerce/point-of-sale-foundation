import { createContext, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BigStoreContextProps {}

export const BigStoreContext = createContext<BigStoreContextProps | undefined>(
  undefined
);

BigStoreContext.displayName = "BigStoreContext";

export function useBigStore() {
  const context = useContext(BigStoreContext);
  return context;
}
