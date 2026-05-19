import { create } from "zustand";

export const useAuthStore = create(function (set) {
  return {
    user: JSON.parse(localStorage.getItem("user") || "null"),
    accessToken: localStorage.getItem("accessToken"),

    setAuth: function ({ user, accessToken }) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);

      set({
        user,
        accessToken
      });
    },

    logout: function () {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      set({
        user: null,
        accessToken: null
      });
    }
  };
});