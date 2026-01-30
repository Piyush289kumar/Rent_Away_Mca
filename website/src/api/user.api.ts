// website/src/api/user.api.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

/* ===========================
   TYPES
=========================== */

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "guest" | "host";
  avatar?: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  property: {
    _id: string;
    title: string;
    coverImage?: string;
  };
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  nights: number;
  pricing: {
    total: number;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

/* ===========================
   HELPERS
=========================== */

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/* ===========================
   USER INFO
=========================== */

/**
 * Get current logged-in user
 * GET /users/me
 */
export const useMe = () =>
  useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });

/* ===========================
   MY BOOKINGS
=========================== */

/**
 * Get logged-in user's bookings
 * GET /bookings/me
 */
export const useMyBookings = () =>
  useQuery<Booking[]>({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/bookings/me`, {
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");
      const json = await res.json();
      return json.data;
    },
  });

/* ===========================
   LOGOUT
=========================== */

/**
 * Logout user
 * POST /auth/logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Logout failed");
      return res.json();
    },
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear();
    },
  });
};
