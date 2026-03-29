
import { ProductType } from "@/lib/utils";
import { InventoryItem } from "./reducers/adminReducer";
import { AppType } from "./reducers/appReducer";
import { LoginDetails } from "./reducers/authReducer";
import { actionType } from "./useCombineReducer";

export interface StateType {
  app: AppType;
  auth: LoginDetails;
  adminData: {
   inventory: InventoryItem[];
    products: ProductType[]; 
  }
}

export type ContextType = {
  state: StateType;
  dispatch: React.Dispatch<actionType>;
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
  adminData: {
    inventory: [],
    products: [],
  }
};