export const isTauri = import.meta.env.VITE_APP_MODE === "tauri";

const isDev = import.meta.env.DEV;

export const API_URL = isTauri ? "https://api.threatmonitoring.ru/api" : "/api";
