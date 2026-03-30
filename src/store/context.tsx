import React, { createContext, useMemo, useReducer } from "react";

import { adminReducer, appReducer, authReducer } from "./reducers";
import useCombinedReducer from "./useCombineReducer";
import { ContextType, initialState } from "./initialState";
import { ReactChild } from "@/lib/utils";

export const Context = createContext<ContextType>({
  state: initialState,
  dispatch: () => null,
});

const getInitialAuth = () => {
  if (typeof window === "undefined") return initialState.auth;

  const storedAuth = localStorage.getItem("auth");
  return storedAuth ? JSON.parse(storedAuth) : initialState.auth;
};

const ContextProvider: React.FC<ReactChild> = ({ children }) => {
  const [state, dispatch] = useCombinedReducer({
    app: useReducer(appReducer, initialState.app),
    auth: useReducer(authReducer, getInitialAuth()),
    adminData: useReducer(adminReducer, initialState.adminData),
  });

  const {
    auth: { isLoggedIn }
  } = state;


  const value = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch, isLoggedIn]);

  return (
    <Context.Provider value={value}>
        {children}
    </Context.Provider>
  );
};

export default ContextProvider;