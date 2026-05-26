export const isTauri = import.meta.env.VITE_APP_MODE === "tauri";

export const routerBasename = isTauri ? "/" : "/ThreatMonitoring-frontend/";
