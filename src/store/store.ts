import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './auth'
import { requestsReducer } from './requests'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
  },
})

export type RootState = ReturnType<
  typeof store.getState
>

export type AppDispatch = typeof store.dispatch
