import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  query: string;
}

const initialState: FiltersState = {
  query: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },

    resetFilters(state) {
      state.query = "";
    },
  },
});

export const { setQuery, resetFilters } = filtersSlice.actions;

export const filtersReducer = filtersSlice.reducer;
