// app/routes/gallery/data/gallerySlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface GalleryState {
  sortBy: string;
  sortOrder: "asc" | "desc";
  search: string;
  selectedGallery: any | null;
  page: number;
  limit: number;
}

const initialState: GalleryState = {
  sortBy: "createdAt",
  sortOrder: "desc",
  search: "",
  selectedGallery: null,
  page: 1,
  limit: 10,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setSort(
      state,
      action: PayloadAction<{ sortBy: string; sortOrder: "asc" | "desc" }>
    ) {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      state.page = 1; // reset pagination on sort
    },

    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },

    setSelectedGallery(state, action: PayloadAction<any | null>) {
      state.selectedGallery = action.payload;
    },

    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },

    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.page = 1;
    },

    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setSort,
  setSearch,
  setSelectedGallery,
  setPage,
  setLimit,
  resetFilters,
} = gallerySlice.actions;

export default gallerySlice.reducer;
