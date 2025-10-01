import { useEffect, useState } from "react";
import getAuthorization from "../../utils/getAuthorization";
import apiEndpointBaseURL from "../../utils/apiEndpointBaseURL";
import ProductListings from "./ProductListings";
import ProductStatusSummary from "./ProductStatusSummary";

function ProductDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiEndpointBaseURL}/auth/products`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorization(),
          },
        });

        const data = await res.json();

        if (data.status) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="space-y-6">
      {/* ✅ Status Summary */}
      <ProductStatusSummary products={products} />

      {/* ✅ Product Table */}
      <ProductListings products={products} />
    </div>
  );
}

export default ProductDashboard;
