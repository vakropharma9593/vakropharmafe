import { StateCreator } from "zustand";
import { HomepageProduct } from "@/lib/utils";

export type HomepageSlice = {
  homepageData: HomepageProduct[];

  setHomepageData: (data: HomepageProduct[]) => void;
};

export const createHomepageSlice: StateCreator<HomepageSlice> = (set) => ({
  homepageData: [],

  setHomepageData: (data) =>
    set((state) => {
        if (state.homepageData === data) return state;
        return { homepageData: data };
    })
});