import React, { createContext, useMemo, useReducer } from "react";

import { adminReducer, appReducer, authReducer } from "./reducers";
import useCombinedReducer from "./useCombineReducer";
import { ContextType, initialState } from "./initialState";
import { ReactChild } from "@/lib/utils";

export const Context = createContext<ContextType>({
  state: initialState,
  dispatch: () => null,
  isAuthenticated: false,
});

const ContextProvider: React.FC<ReactChild> = ({ children }) => {
  const [state, dispatch] = useCombinedReducer({
    app: useReducer(appReducer, initialState.app),
    auth: useReducer(authReducer, initialState.auth),
    adminData: useReducer(adminReducer, initialState.adminData),
  });

  const {
    auth: { isLoggedIn }
} = state;


  const value = useMemo(() => {
    return { state, dispatch, isAuthenticated: isLoggedIn, };
  }, [state, dispatch, isLoggedIn]);

  return (
    <Context.Provider value={value}>
        {children}
    </Context.Provider>
  );
};

export default ContextProvider;