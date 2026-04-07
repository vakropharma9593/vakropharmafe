import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createAuthSlice, AuthSlice } from "./authStore";
import { createAppSlice, AppSlice } from "./appStore";
import { createAdminSlice, AdminSlice } from "./adminStore";

type Store = AuthSlice & AppSlice & AdminSlice & {
    hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
  };

export const useStore = create<Store>()(
  persist(
    (set, get, store) => ({
      ...createAuthSlice(set, get, store),
      ...createAppSlice(set, get, store),
      ...createAdminSlice(set, get, store),

      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "app-storage",

      partialize: (state) => ({
        auth: state.auth,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);