import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsStoreState = {
  gameId: string;
  fun_ticket: string;
  SESSION: string;
  setGameId: (g: string) => void;
  setFunTicket: (g: string) => void;
  setSession: (g: string) => void;
};

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      gameId: "",
      fun_ticket: "",
      SESSION: "",
      setGameId: (gameId) => set({ gameId }),
      setFunTicket: (fun_ticket) => set({ fun_ticket }),
      setSession: (SESSION) => set({ SESSION }),
    }),
    {
      name: "settings",
    }
  )
);
