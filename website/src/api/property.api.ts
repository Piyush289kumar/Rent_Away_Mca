import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export interface Property {
  _id: string;
  title: string;
  coverImage?: string;
  gallery?: string[];
  guests: number;
  propertyType: string;
  pricing: {
    perNight: number;
  };
  rating?: {
    avg: number;
  };
  isFeatured?: boolean;
}

interface ApiResponse {
  data: Property[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useProperties = (
  page = 1,
  limit = 8,
  search = ""
) =>
  useQuery({
    queryKey: ["properties", page, limit, search],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/properties?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`
      );
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
    placeholderData: (prev) => prev, // smooth pagination
  });



export const usePropertyById = (id?: string) =>
  useQuery({
    queryKey: ["property", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch(`${API_URL}/properties/${id}`);
      if (!res.ok) throw new Error("Failed to fetch property");
      return res.json();
    },
  });