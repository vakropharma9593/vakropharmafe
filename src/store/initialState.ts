
import { InventoryItem } from "./reducers/adminReducer";
import { AppType } from "./reducers/appReducer";
import { LoginDetails } from "./reducers/authReducer";
import { actionType } from "./useCombineReducer";

export interface StateType {
  app: AppType;
  auth: LoginDetails;
  inventory: InventoryItem[]
}

export type ContextType = {
  state: StateType;
  dispatch: React.Dispatch<actionType>;
  isAuthenticated: boolean;
};

export const initialState = {
  auth: {
    username: "",
    isLoggedIn: false,
  },
  app: {
    loader: false,
    toast: false,
    severity: "",
    message: "",
  },
  inventory: []
};