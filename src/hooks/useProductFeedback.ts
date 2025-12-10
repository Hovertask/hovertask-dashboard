import { useEffect, useState, useCallback } from "react";
import apiEndpointBaseURL from "../utils/apiEndpointBaseURL";


export interface ProductFeedback {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    id: number;
    fname: string;
    lname: string;
    avatar?: string | null;
  };
}

interface PaginatedResponse {
  data: ProductFeedback[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function useProductFeedback(productId: string | number) {
  const [data, setData] = useState<ProductFeedback[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse | null>(null);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------------------
  // FETCH function (SWR-like refetch, no full page reload)
  // ----------------------------------------------------
  const fetchFeedback = useCallback(
    async (pageNumber = page) => {
      try {
        setLoading(true);
        setError(null);

        const controller = new AbortController();

        const res = await fetch(
          `${apiEndpointBaseURL}/products/${productId}/feedback?page=${pageNumber}`,
          {
            method: "GET",
            signal: controller.signal,
            headers: {
              accept: "application/json",
            },
          }
        );

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to fetch feedback");

        setData(json.data || []);
        setPagination(json);

        return () => controller.abort();
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError("Unable to load feedback.");
        }
      } finally {
        setLoading(false);
      }
    },
    [productId, page]
  );

  // initial load
  useEffect(() => {
    fetchFeedback(1);
  }, [productId]);

  // load next/previous pages
  useEffect(() => {
    fetchFeedback(page);
  }, [page]);

  return {
    data,
    loading,
    error,
    pagination,
    lastPage: pagination?.last_page ?? 1, // <-- add this
    page,
    setPage,
    setData, // keep original for optimistic updates
    refetch: fetchFeedback,
  };
}
