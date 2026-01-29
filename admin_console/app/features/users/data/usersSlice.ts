// app/routes/users/data/usersSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UsersState {
  sortBy: string;
  sortOrder: string;
  search: string;
  roleFilter: string;
  selectedUser: any | null;
}

const initialState: UsersState = {
  sortBy: "createdAt",
  sortOrder: "desc",
  search: "",
  roleFilter: "all",
  selectedUser: null,
};

const usersSlice = createSlice({
  name: "users",
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

    setRoleFilter(state, action: PayloadAction<string>) {
      state.roleFilter = action.payload;
    },

    setSelectedUser(state, action: PayloadAction<any | null>) {
      state.selectedUser = action.payload;
    },

    resetFilters(state) {
      state.sortBy = "createdAt";
      state.sortOrder = "desc";
      state.search = "";
      state.roleFilter = "all";
      state.selectedUser = null;
    },
  },
});

export const {
  setSort,
  setSearch,
  setRoleFilter,
  setSelectedUser,
  resetFilters,
} = usersSlice.actions;

export default usersSlice.reducer;
