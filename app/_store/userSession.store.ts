import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { UserSession } from "@interfaces";

const stateInitial = {
  id: 0,
  name: "",
  email: "",
  role: "",
  isActive: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  manufacturingPlants: [],
  zones: [],
  manufacturingPlantCurrent: {
    id: 0,
    name: "",
    link: "",
    lat: 0,
    lng: 0,
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

type Actions = {
  setSession: (userSession: UserSession) => void;
  resetSession: () => void;
};

export const useUserSessionStore = create(
  persist<UserSession & Actions>(
    (set) => ({
      ...stateInitial,
      setSession: (userSession: UserSession) => set(userSession),
      resetSession: () => set(stateInitial),
    }),
    {
      name: "user-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
