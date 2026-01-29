// app/routes/booking/data/bookingSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BookingState {
  sortBy: string;
  sortOrder: "asc" | "desc";
  search: string;
  statusFilter: string;
  selectedBooking: any | null;
}

const initialState: BookingState = {
  sortBy: "createdAt",
  sortOrder: "desc",
  search: "",
  statusFilter: "all",
  selectedBooking: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSort(
      state,
      action: PayloadAction<{ sortBy: string; sortOrder: "asc" | "desc" }>
    ) {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },

    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },

    setStatusFilter(state, action: PayloadAction<string>) {
      state.statusFilter = action.payload;
    },

    setSelectedBooking(state, action: PayloadAction<any | null>) {
      state.selectedBooking = action.payload;
    },

    resetFilters(state) {
      state.sortBy = "createdAt";
      state.sortOrder = "desc";
      state.search = "";
      state.statusFilter = "all";
      state.selectedBooking = null;
    },
  },
});

export const {
  setSort,
  setSearch,
  setStatusFilter,
  setSelectedBooking,
  resetFilters,
} = bookingSlice.actions;

export default bookingSlice.reducer;
