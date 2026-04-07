import { StateCreator } from "zustand";

type SeverityType = "error" | "success" | "info" | string;

export type AppSlice = {
  app: {
    loader: boolean;
    toast: boolean;
    severity?: SeverityType;
    message?: string;
  };

  showLoader: () => void;
  hideLoader: () => void;
  showToast: (data: { severity?: SeverityType; message?: string }) => void;
  hideToast: () => void;
};

export const createAppSlice: StateCreator<AppSlice> = (set) => ({
  app: {
    loader: false,
    toast: false,
    severity: "",
    message: "",
  },

  showLoader: () =>
    set((state) => ({ app: { ...state.app, loader: true } })),

  hideLoader: () =>
    set((state) => ({ app: { ...state.app, loader: false } })),

  showToast: (data) =>
    set((state) => ({
      app: { ...state.app, toast: true, ...data },
    })),

  hideToast: () =>
    set((state) => ({
      app: { ...state.app, toast: false, severity: "", message: "" },
    })),
});