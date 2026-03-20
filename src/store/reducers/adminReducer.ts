import { Reducer } from "react";

import ACTIONS from "../actions";
import { ActionMap } from "@/lib/utils";

export interface InventoryItem {
  id: string;
  batch: string;
  itemName: string;
  totalCount: number;
  remainingCount: number;
  receivedDate: string;
  mfgDate: string;
  expiryDate: string;
  mrp: number;
  basePrice: number;
  costPrice: number;
  gstAmount: number;
  gstPercentage: number;
}

export type AdminPayload = {
  [ACTIONS.SET_INVENTORY]: InventoryItem[];
};

export type AuthAction = ActionMap<AdminPayload>[keyof ActionMap<AdminPayload>];

const adminReducer: Reducer<InventoryItem[], AuthAction> = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_INVENTORY:
      return [ ...action.payload ];
    default:
      return state;
  }
};

export default adminReducer;
