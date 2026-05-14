import { createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import { authController } from '../api/http-controller'
import { User } from '../types'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

const savedUser = localStorage.getItem('user')

const initialState: AuthState = {
  user: savedUser
    ? JSON.parse(savedUser)
    : null,

  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (
    data: {
      email: string
      password: string
    },
    thunkAPI
  ) => {
    try {
        const user = await authController.login(data.email,
        data.password)

        localStorage.setItem(
        'user',
        JSON.stringify(user)
        )

        return user
    } catch (err) {
      return thunkAPI.rejectWithValue(
        (err as Error).message
      )
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authController.logout()

    localStorage.removeItem('user')
  }
)

export const authReducer = createReducer(
  initialState,
  (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
  }
)
