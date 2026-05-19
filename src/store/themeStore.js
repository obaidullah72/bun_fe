import { create } from "zustand";

const stored = localStorage.getItem("theme") || "light";

if (stored === "dark") {
  document.documentElement.classList.add("dark");
}

export const useThemeStore = create(function (set) {
  return {
    theme: stored,
    toggleTheme: function () {
      set(function (state) {
        const next = state.theme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", next);
        if (next === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        return { theme: next };
      });
    }
  };
});
