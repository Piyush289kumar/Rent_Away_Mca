// website/src/api/auth.api.ts

// website/src/api/auth.api.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

/* ===========================
   TYPES
=========================== */
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  role:string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

/* ===========================
   TOKEN HELPERS
=========================== */
export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

/* ===========================
   LOGIN
=========================== */
export const useLogin = () =>
  useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: async (body) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      return res.json();
    },

    onSuccess: (data) => {
      saveToken(data.token);
    },
  });

/* ===========================
   REGISTER
=========================== */
export const useRegister = () =>
  useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: async (body) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }

      return res.json();
    },

    onSuccess: (data) => {
      saveToken(data.token);
    },
  });

/* ===========================
   LOGOUT
=========================== */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error("Logout failed");
      return res.json();
    },

    onSuccess: () => {
      removeToken();
      queryClient.clear();
    },
  });
};
