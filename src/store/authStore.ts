import { StateCreator } from "zustand";

export type AuthState = {
  username: string;
  isLoggedIn: boolean;
};

export type AuthSlice = {
  auth: AuthState;
  setAuth: (data: AuthState) => void;
  removeAuth: () => void;
};

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  auth: {
    username: "",
    isLoggedIn: false,
  },

  setAuth: (data) =>
    set(() => ({
      auth: data,
    })),

  removeAuth: () =>
    set(() => ({
      auth: { username: "", isLoggedIn: false },
    })),
});