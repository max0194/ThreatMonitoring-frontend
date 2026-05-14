import { createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import { requestsController } from '../api/http-controller'

interface RequestsState {
  loading: boolean
  error: string | null
  success: string | null
}

const initialState: RequestsState = {
  loading: false,
  error: null,
  success: null,
}

export const createRequest = createAsyncThunk(
  'requests/create',
  async (
    data: {
      title: string
      description: string
      threat_type_id: number
    },
    thunkAPI
  ) => {
    try {
      await requestsController.createRequest(data)
    } catch (err) {
      return thunkAPI.rejectWithValue(
        (err as Error).message
      )
    }
  }
)

export const requestsReducer = createReducer(
  initialState,
  (builder) => {
    builder
      .addCase(createRequest.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })

      .addCase(createRequest.fulfilled, (state) => {
        state.loading = false
        state.success = 'Заявка успешно создана'
      })

      .addCase(createRequest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
)
