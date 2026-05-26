import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { requestsReducer } from "./requests";
import { filtersReducer } from "./filters";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
    filters: filtersReducer,
  },

  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
