/* eslint-disable @typescript-eslint/no-explicit-any */

import { ActionMap } from "@/lib/utils";
import { initialState, StateType } from "./initialState";
import { AppPayload } from "./reducers/appReducer";
import { AuthPayload } from "./reducers/authReducer";

// to merge the TYPE
type UnionToType<U extends Record<string, unknown>> = {
  [K in U extends unknown ? keyof U : never]: U extends unknown ? (K extends keyof U ? U[K] : never) : never;
};
// merging all the payload
type combinedPayload = UnionToType<AuthPayload | AppPayload >;

// mapped all the actions along with the payload
export type actionType = ActionMap<combinedPayload>[keyof ActionMap<combinedPayload>];

const useCombinedReducer = (combinedReducers: any): [StateType, (action: actionType) => void] => {
  // Global State
  const state: StateType = Object.keys(combinedReducers).reduce(
    (acc, key) => ({ ...acc, [key]: combinedReducers[key][0] }),
    initialState
  );

  // Global Dispatch Function
  const dispatch = (action: actionType) =>
    Object.keys(combinedReducers)
      .map((key) => combinedReducers[key][1])
      .forEach((fn) => fn(action));

  return [state, dispatch];
};

export default useCombinedReducer;