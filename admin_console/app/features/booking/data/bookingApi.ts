// app/routes/booking/data/bookingApi.ts - (using RTK Query)

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "~/utils/auth";

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

/* ============================
   BOOKING TYPE
============================ */
export interface Booking {
  _id?: string;

  property: {
    _id: string;
    title?: string;
    coverImage?: string;
  };

  guest: {
    _id: string;
    name?: string;
    email?: string;
  };

  host: {
    _id: string;
    name?: string;
    email?: string;
  };

  checkIn: string;
  checkOut: string;
  nights: number;
  totalGuests: number;

  pricing?: {
    perNight?: number;
    cleaningFee?: number;
    serviceFee?: number;
    subtotal?: number;
    total?: number;
    currency?: string;
  };

  status: "pending" | "confirmed" | "cancelled" | "completed" | "rejected";

  note?: string;

  createdAt?: string;
  updatedAt?: string;
}

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/`,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Booking"],

  endpoints: (builder) => ({
    /* ============================
       🟢 CUSTOMER
    ============================ */

    /* Create booking */
    createBooking: builder.mutation<
      { success: boolean; data: Booking },
      {
        propertyId: string;
        checkIn: string;
        checkOut: string;
        totalGuests: number;
        note?: string;
      }
    >({
      query: (body) => ({
        url: "bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),

    /* My bookings */
    getMyBookings: builder.query<{ success: boolean; data: Booking[] }, void>({
      query: () => "bookings/me",
      providesTags: ["Booking"],
    }),

    /* Cancel booking */
    cancelBooking: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),

    /* ============================
       🔒 ADMIN
    ============================ */

    /* All bookings */
    getAllBookings: builder.query<
      {
        success: boolean;
        data: Booking[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      },
      PaginationParams
    >({
      query: ({ page = 1, limit = 10, search = "", status }) =>
        `bookings/admin/all?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search,
        )}${status && status !== "all" ? `&status=${status}` : ""}`,
      providesTags: ["Booking"],
    }),

    /* Booking by ID */
    getBookingById: builder.query<{ success: boolean; data: Booking }, string>({
      query: (id) => `bookings/admin/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Booking", id }],
    }),

    /* Delete booking (admin) */
    deleteBooking: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `bookings/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useCancelBookingMutation,
  /* ADMIN */
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useDeleteBookingMutation,
} = bookingApi;
