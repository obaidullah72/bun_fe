import { create } from "zustand";

document.documentElement.classList.remove("dark");

export const useThemeStore = create(function () {
  return {
    theme: "light",
    toggleTheme: function () {
      // Light theme only for consistent UI
    }
  };
});
