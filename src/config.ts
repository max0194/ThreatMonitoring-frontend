export const isTauri = import.meta.env.VITE_APP_MODE === "tauri";

const isDev = import.meta.env.DEV;

export const API_URL = isTauri
  ? "https://176.15.201.152:8080"
  : isDev
    ? "/api"
    : "https://176.15.201.152:8080";
