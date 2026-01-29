// app/routes/users/data/usersApi.ts - (using RTK Query)

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/auth";

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/`,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["User"],

  endpoints: (builder) => ({
    /* ------------------ 🟢 PUBLIC ------------------ */

    getPublicUserById: builder.query<{ data: User }, string>({
      query: (id) => `users/${id}`,
    }),

    /* ------------------ 🔒 ADMIN ------------------ */

    getUsers: builder.query<
      { data: User[]; pagination: any },
      PaginationParams
    >({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        role,
      }) =>
        `users/admin/all?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}${role && role !== "all" ? `&role=${role}` : ""}`,
      providesTags: ["User"],
    }),

    getUserById: builder.query<{ data: User }, string>({
      query: (id) => `users/admin/${id}`,
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),

    createUser: builder.mutation<
      { success: boolean; data: User },
      FormData
    >({
      query: (data) => ({
        url: `users/admin`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation<
      { success: boolean; data: User },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `users/admin/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    partialUpdateUser: builder.mutation<
      { success: boolean; data: User },
      { id: string; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `users/admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "User", id }],
    }),

    deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `users/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetPublicUserByIdQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  usePartialUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
