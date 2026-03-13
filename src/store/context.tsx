import React, { createContext, useEffect, useMemo, useReducer } from "react";

import { appReducer, authReducer } from "./reducers";
import ACTIONS from "./actions";
import useCombinedReducer from "./useCombineReducer";
import { ContextType, initialState } from "./initialState";
import { ReactChild } from "@/lib/utils";

export const Context = createContext<ContextType>({
  state: initialState,
  dispatch: () => null,
  isAuthenticated: false,
});

export const LoggerContext = React.createContext("");

const ContextProvider: React.FC<ReactChild> = ({ children }) => {
  const [state, dispatch] = useCombinedReducer({
    app: useReducer(appReducer, initialState.app),
    auth: useReducer(authReducer, initialState.auth),
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