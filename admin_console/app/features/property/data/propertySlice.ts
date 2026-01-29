// app/routes/property/data/propertySlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PropertyState {
  sortBy: string;
  sortOrder: string;
  search: string;
  filter: string;
  selectedProperty: any | null;
}

const initialState: PropertyState = {
  sortBy: "createdAt",
  sortOrder: "desc",
  search: "",
  filter: "all",
  selectedProperty: null,
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    setSort(
      state,
      action: PayloadAction<{ sortBy: string; sortOrder: string }>
    ) {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },

    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },

    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },

    setSelectedProperty(state, action: PayloadAction<any | null>) {
      state.selectedProperty = action.payload;
    },

    resetFilters(state) {
      state.sortBy = "createdAt";
      state.sortOrder = "desc";
      state.search = "";
      state.filter = "all";
      state.selectedProperty = null;
    },
  },
});

export const {
  setSort,
  setSearch,
  setFilter,
  setSelectedProperty,
  resetFilters,
} = propertySlice.actions;

export default propertySlice.reducer;
