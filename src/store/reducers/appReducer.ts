import { Reducer } from "react";

import ACTIONS from "../actions";
import { ActionMap } from "@/lib/utils";

type SeverityType = "error" | "success" | "info" | string;

export type AppType = {
  loader: boolean;
  toast: boolean;
  severity?: SeverityType;
  message?: string;
};

export type AppPayload = {
  [ACTIONS.SHOW_LOADER]: undefined;
  [ACTIONS.HIDE_LOADER]: undefined;
  [ACTIONS.SHOW_TOAST]: {
    severity?: SeverityType;
    message?: string;
  };
  [ACTIONS.HIDE_TOAST]: undefined;
};

export type AppAction = ActionMap<AppPayload>[keyof ActionMap<AppPayload>];

const appReducer: Reducer<AppType, AppAction> = (state, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_LOADER:
      return { ...state, loader: true };
    case ACTIONS.HIDE_LOADER:
      return { ...state, loader: false };
    case ACTIONS.SHOW_TOAST:
      return { ...state, toast: true, ...action.payload };
    case ACTIONS.HIDE_TOAST:
      return { ...state, toast: false, severity: "", message: "" };
    default:
      return state;
  }
};

export default appReducer;