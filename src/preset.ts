import { PresetConfig } from "types/index";

export const preset: PresetConfig = {
  localStorageKey: "auth_token",
  routes: {
    login: "/auth/login",
    check: "/auth/check",
    logout: "/auth/logout",
  },
};
