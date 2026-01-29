// app/routes/property/data/propertyApi.ts - (using RTK Query)

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/auth";

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  filter?: string;
}

export interface Property {
  _id?: string;
  title: string;
  slug?: string;

  propertyType?: string;

  guests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;

  pricing?: {
    perNight?: number;
    cleaningFee?: number;
    serviceFee?: number;
    currency?: string;
  };

  amenities?: string[];
  coverImage?: string | null;
  gallery?: string[];

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };

  location?: {
    city?: string;
    country?: string;
  };

  isActive?: boolean;
  isPublished?: boolean;
  isFeatured?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export const propertyApi = createApi({
  reducerPath: "propertyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/`,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Property"],

  endpoints: (builder) => ({
    /* ------------------ 🟢 PUBLIC ------------------ */
    getPublicProperties: builder.query<
      { data: Property[]; pagination: any },
      PaginationParams
    >({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `property?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
      providesTags: ["Property"],
    }),

    getPropertyById: builder.query<{ data: Property }, string>({
      query: (id) => `property/${id}`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    /* ------------------ 🔒 ADMIN ------------------ */
    getProperties: builder.query<
      { data: Property[]; pagination: any },
      PaginationParams
    >({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        sortBy = "createdAt",
        sortOrder = "desc",
        filter = "all",
      }) =>
        `property/admin/all?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}&sortBy=${sortBy}&sortOrder=${sortOrder}&filter=${filter}`,
      providesTags: ["Property"],
    }),

    createProperty: builder.mutation<
      { message: string; data: Property },
      FormData
    >({
      query: (formData) => ({
        url: `property`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Property"],
    }),

    updateProperty: builder.mutation<
      { message: string; data: Property },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `property/admin/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Property"],
    }),

    deleteProperty: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `property/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"],
    }),
  }),
});

export const {
  useGetPublicPropertiesQuery,
  useGetPropertyByIdQuery,
  useGetPropertiesQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
} = propertyApi;
