import { Reducer } from "react";

import ACTIONS from "../actions";
import { ActionMap } from "@/lib/utils";
import { initialState } from "../initialState";

export type LoginDetails = {
    username: string,
    isLoggedIn: boolean
}

export type AuthPayload = {
  [ACTIONS.SET_AUTH]: LoginDetails;
  [ACTIONS.REMOVE_AUTH]: undefined;
};

export type AuthAction = ActionMap<AuthPayload>[keyof ActionMap<AuthPayload>];

const authReducer: Reducer<LoginDetails, AuthAction> = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_AUTH:
      return { ...state, ...action.payload };
    case ACTIONS.REMOVE_AUTH:
      return { ...initialState.auth };
    default:
      return state;
  }
};

export default authReducer;
