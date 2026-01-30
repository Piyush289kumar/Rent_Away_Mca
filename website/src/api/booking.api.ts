import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

/* ============================
   TYPES
============================ */

export interface Booking {
  _id: string;

  property: {
    _id: string;
    title?: string;
    coverImage?: string;
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

  status:
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed"
    | "rejected";

  note?: string;

  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/* ============================
   HELPERS
============================ */

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/* ============================
   🟢 CUSTOMER APIS
============================ */

/* -------- Create Booking -------- */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      propertyId: string;
      checkIn: string;
      checkOut: string;
      totalGuests: number;
      note?: string;
    }) => {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Booking failed");
      }

      return res.json() as Promise<ApiResponse<Booking>>;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
};

/* -------- My Bookings -------- */
export const useMyBookings = () =>
  useQuery<ApiResponse<Booking[]>>({
    queryKey: ["my-bookings"],

    queryFn: async () => {
      const res = await fetch(`${API_URL}/bookings/me`, {
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");

      return res.json();
    },
  });

/* -------- Cancel Booking -------- */
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Cancel failed");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
};
