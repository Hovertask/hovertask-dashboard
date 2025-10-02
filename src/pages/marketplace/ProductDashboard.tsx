import { useEffect, useState } from "react";
import getAuthorization from "../../utils/getAuthorization";
import apiEndpointBaseURL from "../../utils/apiEndpointBaseURL";
import ProductStatusSummary from "./ProductStatusSummary";
import ProductListings from "./ProductListings";

function ProductDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all"); // 👈 active tab filter

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiEndpointBaseURL}/products/auth-user-product`, {
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
      {/* ✅ Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">View Product Listings</h2>
        <p className="text-sm text-gray-500">
          Manage all your listed products. Edit details, update stock, and track live status.
        </p>
      </div>

      {/* ✅ Summary with Filter */}
      <ProductStatusSummary products={products} filter={filter} setFilter={setFilter} />

      {/* ✅ Product Listings */}
      <ProductListings products={products} filter={filter} />
    </div>
  );
}

export default ProductDashboard;
