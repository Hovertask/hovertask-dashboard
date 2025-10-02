// src/hooks/useProductWithSeller.ts
import { useEffect, useState } from "react";
import type { Product, AuthUserDTO } from "../../types";
import apiEndpointBaseURL from "../utils/apiEndpointBaseURL";
import getAuthorization from "../utils/getAuthorization";
import { toast } from "sonner";
import { useNavigate } from "react-router";

// Simple in-memory caches
const productCache = new Map<string, Product>();
const sellerCache = new Map<string, AuthUserDTO>();

interface ProductWithSeller {
  product: Product;
  seller: AuthUserDTO;
}

export default function useProductWithSeller(id: string) {
  const [data, setData] = useState<ProductWithSeller | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Use cache if available
        const cachedProduct = productCache.get(id);
        const cachedSeller = sellerCache.get(id);

        if (cachedProduct && cachedSeller) {
          setData({ product: cachedProduct, seller: cachedSeller });
          setLoading(false);
          return;
        }

        // Fetch both in parallel
        const [productRes, sellerRes] = await Promise.all([
          fetch(`${apiEndpointBaseURL}/products/show-product/${id}`, {
            headers: { authorization: getAuthorization() },
          }),
          fetch(`${apiEndpointBaseURL}/products/contact-seller/${id}`, {
            headers: { authorization: getAuthorization() },
            method: "POST",
          }),
        ]);

        if (!productRes.ok || !sellerRes.ok) {
          throw new Error("Network error");
        }

        const productData = await productRes.json();
        const sellerData = await sellerRes.json();

        if (!productData.success) {
          toast.error("This product does not exist or was removed.");
          navigate("/marketplace");
          return;
        }

        const product = productData.product as Product;
        const seller = sellerData.user as AuthUserDTO;

        // Cache
        productCache.set(id, product);
        sellerCache.set(id, seller);

        setData({ product, seller });
      } catch (err) {
        console.error(err);
        setError("Failed to load product details.");
        toast.error("We couldn't complete this request at the moment.");
        navigate("/marketplace");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, navigate]);

  return { ...data, loading, error };
}
