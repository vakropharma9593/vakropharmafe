import { StateCreator } from "zustand";
import { ProductType } from "@/lib/utils";

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

export type AdminSlice = {
  adminData: {
    inventory: InventoryItem[];
    products: ProductType[];
  };

  setInventory: (data: InventoryItem[]) => void;
  setProducts: (data: ProductType[]) => void;
};

export const createAdminSlice: StateCreator<AdminSlice> = (set) => ({
  adminData: {
    inventory: [],
    products: [],
  },

  setInventory: (data) =>
    set((state) => ({
      adminData: { ...state.adminData, inventory: data },
    })),

  setProducts: (data) =>
    set((state) => ({
      adminData: { ...state.adminData, products: data },
    })),
});