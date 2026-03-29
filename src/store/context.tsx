import React, { createContext, useEffect, useMemo, useReducer } from "react";

import { adminReducer, appReducer, authReducer } from "./reducers";
import useCombinedReducer from "./useCombineReducer";
import { ContextType, initialState } from "./initialState";
import { ReactChild } from "@/lib/utils";
import ACTIONS from "./actions";

export const Context = createContext<ContextType>({
  state: initialState,
  dispatch: () => null,
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

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      dispatch({
        type: ACTIONS.SET_AUTH,
        payload: JSON.parse(storedAuth),
      });
    }
  }, []);


  const value = useMemo(() => {
    console.info("context logine", isLoggedIn);
    return { state, dispatch };
  }, [state, dispatch, isLoggedIn]);

  return (
    <Context.Provider value={value}>
        {children}
    </Context.Provider>
  );
};

export default ContextProvider;