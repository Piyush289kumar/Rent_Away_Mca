// app/routes/gallery/data/galleryApi.ts - (using RTK Query)

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/auth";

export const galleryApi = createApi({
  reducerPath: "galleryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ["Gallery", "GalleryList"],

  endpoints: (builder) => ({
    /* ================================
       🟢 PUBLIC
    ================================ */

    getPublicGalleries: builder.query({
      query: () => `gallery/active`,
      providesTags: ["GalleryList"],
    }),

    getPublicGalleryById: builder.query({
      query: (id: string) => `gallery/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Gallery", id }],
    }),

    /* ================================
       🔒 ADMIN
    ================================ */

    getGalleries: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        sortBy = "createdAt",
        sortOrder = "desc",
      }) =>
        `gallery?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      providesTags: ["GalleryList"],
    }),

    getGalleryById: builder.query({
      query: (id: string) => `gallery/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Gallery", id }],
    }),

    createGallery: builder.mutation({
      query: (formData: FormData) => ({
        url: `gallery`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["GalleryList"],
    }),

    updateGallery: builder.mutation({
      query: ({ id, formData }: { id: string; formData: FormData }) => ({
        url: `gallery/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Gallery", id },
        "GalleryList",
      ],
    }),

    partiallyUpdateGallery: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `gallery/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Gallery", id },
        "GalleryList",
      ],
    }),

    deleteGallery: builder.mutation({
      query: (id: string) => ({
        url: `gallery/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GalleryList"],
    }),

    /* ================================
       🛠 ADMIN STATS ACTIONS
    ================================ */

    resetGalleryStats: builder.mutation({
      query: (id: string) => ({
        url: `gallery/${id}`,
        method: "PATCH",
        body: {
          stats: {
            likes: 0,
            favorites: 0,
            downloads: 0,
            shares: 0,
            views: 0,
          },
        },
      }),
      invalidatesTags: (_r, _e, id) => [{ type: "Gallery", id }],
    }),
  }),
});

export const {
  useGetPublicGalleriesQuery,
  useGetPublicGalleryByIdQuery,
  useGetGalleriesQuery,
  useGetGalleryByIdQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  usePartiallyUpdateGalleryMutation,
  useDeleteGalleryMutation,
  useResetGalleryStatsMutation,
} = galleryApi;
