import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { CategoriesState } from "@interfaces";

const stateInitial = {
  mainTypes: [],
  zones: [],
};

type Actions = {
  setCategories: (categories: CategoriesState) => void;
};

export const useCategoriesStore = create(
  persist<CategoriesState & Actions>(
    (set) => ({
      ...stateInitial,
      setCategories: (categories: CategoriesState) => set(categories),
    }),
    {
      name: "categories",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
