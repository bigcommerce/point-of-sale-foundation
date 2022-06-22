import { createContext, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GlobalContextProps {}

export const GlobalContext = createContext<GlobalContextProps | undefined>(
  undefined
);

GlobalContext.displayName = "GlobalContext";

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  return context;
}
