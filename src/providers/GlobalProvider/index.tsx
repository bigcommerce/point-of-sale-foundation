import React from "react";
import { GlobalContext } from "./context";

const GlobalProvider = (props: { children: React.ReactElement }) => {
  return (
    <GlobalContext.Provider value={{}}>{props.children}</GlobalContext.Provider>
  );
};
export default GlobalProvider;
