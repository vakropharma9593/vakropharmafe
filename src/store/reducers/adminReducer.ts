import { Reducer } from "react";
import ACTIONS from "../actions";
import { ActionMap, ProductType } from "@/lib/utils";

export interface InventoryItem {
  _id?: string;
  batch: string;
  productId: string;
  productName?: string;
  totalCount: number;
  remainingCount?: number;
  receivedDate: string;
  mfgDate: string;
  expiryDate: string;
  mrp?: number;
  costPrice?: number;
  gstPercentage?: number;
  gstPercentageOnCostPrice?: number;
}

export interface AdminState {
  inventory: InventoryItem[];
  products: ProductType[];
}

export type AdminPayload = {
  [ACTIONS.SET_INVENTORY]: InventoryItem[];
  [ACTIONS.SET_PRODUCTS]: ProductType[];
};

export type AdminAction =
  ActionMap<AdminPayload>[keyof ActionMap<AdminPayload>];

const initialState: AdminState = {
  inventory: [],
  products: [],
};

const adminReducer: Reducer<AdminState, AdminAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case ACTIONS.SET_INVENTORY:
      return {
        ...state,
        inventory: action.payload,
      };

    case ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };

    default:
      return state;
  }
};

export default adminReducer;