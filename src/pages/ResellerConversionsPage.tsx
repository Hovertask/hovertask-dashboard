import { useEffect, useState } from "react";
import {
  getResellerConversions,
  Conversion,
  PaginatedResponse,
} from "../utils/getResellerConversions";

export default function ResellerConversionsPage() {
  const [data, setData] = useState<Conversion[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Conversion> | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getResellerConversions(page, controller.signal)
      .then((res) => {
        setData(res.data);
        setPagination(res);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError("Failed to load conversions.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [page]);

  if (loading) {
    return (
      <div className="p-4 text-gray-500">
        <div className="animate-pulse bg-gray-200 h-4 w-40 mb-4 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 p-4">{error}</p>;
  }

  if (!data.length) {
    return <p className="text-gray-500 p-4">No conversions found yet.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Reseller Conversions</h1>

      <div className="bg-white rounded border shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Product</th>
              <th className="p-3">Code</th>
              <th className="p-3">Visitor</th>
              <th className="p-3">IP</th>
              <th className="p-3">User Agent</th>
              <th className="p-3">Commission</th>
            </tr>
          </thead>

          <tbody>
            {data.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <span className="font-medium">{c.product?.name}</span>
                  <span className="text-gray-400 ml-1">₦{c.product?.price}</span>
                </td>
                <td className="p-3">{c.reseller_code}</td>
                <td className="p-3">{c.visitor_cookie}</td>
                <td className="p-3">{c.ip}</td>
                <td className="p-3 text-gray-500">
                  {c.user_agent.length > 35
                    ? c.user_agent.slice(0, 35) + "..."
                    : c.user_agent}
                </td>
                <td className="p-3">500</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex gap-2 mt-4">
          <button
            disabled={!pagination.prev_page_url}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 rounded border ${
              pagination.prev_page_url
                ? "bg-white hover:bg-gray-100"
                : "bg-gray-200 cursor-not-allowed"
            }`}
          >
            Previous
          </button>

          <button
            disabled={!pagination.next_page_url}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded border ${
              pagination.next_page_url
                ? "bg-white hover:bg-gray-100"
                : "bg-gray-200 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
