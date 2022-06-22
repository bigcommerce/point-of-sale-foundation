import React, { useEffect } from "react";
import { BigStoreContext } from "./context";

const BigStoreProvider = (props: { children: React.ReactElement }) => {
  useEffect(() => {
    // do something
  }, []);

  return (
    <BigStoreContext.Provider value={{}}>
      {props.children}
    </BigStoreContext.Provider>
  );
};

export default BigStoreProvider;
