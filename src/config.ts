export const isTauri = import.meta.env.VITE_APP_MODE === "tauri";

const isDev = import.meta.env.DEV;

export const API_URL = isTauri
  ? "http://192.168.8.138:8085/api"
  : isDev
    ? "/api"
    : "https://api.threatmonitoring.ru/api";
