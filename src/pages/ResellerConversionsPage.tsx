import { useEffect, useMemo, useState } from "react";
import {
  getResellerConversions,
  Conversion,
  PaginatedResponse,
} from "../utils/getResellerConversions";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import EmptyMapErr from "../shared/components/EmptyMapErr";

export default function ResellerConversionsPage() {
  const [data, setData] = useState<Conversion[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Conversion> | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => setPage((p) => p);

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

  // --------------------------
  // AGGREGATIONS
  // --------------------------

  const totalConversions = data.length;
  const totalCommission = totalConversions * 500;

  const productStats = useMemo(() => {
    const map: Record<
      string,
      {
        name: string;
        price: number;
        conversions: number;
        commission: number;
      }
    > = {};

    data.forEach((c) => {
      if (!c.product) return;
      const id = c.product.id;

      if (!map[id]) {
        map[id] = {
          name: c.product.name,
          price: c.product.price,
          conversions: 0,
          commission: 0,
        };
      }

      map[id].conversions += 1;
      map[id].commission += 500;
    });

    return Object.values(map);
  }, [data]);

  if (loading) {
    return (
      <div className="p-4 text-gray-500">
        <div className="animate-pulse bg-gray-200 h-4 w-40 mb-4 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyMapErr
        onButtonClick={refresh}
        description="Failed to load conversions."
        buttonInnerText="Try Again"
      />
    );
  }

  if (!data.length) {
    return (
      <EmptyMapErr
        onButtonClick={refresh}
        description="No conversions found yet."
        buttonInnerText="Refresh"
      />
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-6">
      <h1 className="text-lg md:text-xl font-semibold">Reseller Conversions Overview</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-3 md:p-4 bg-white rounded-xl shadow border">
          <p className="text-gray-500 text-xs md:text-sm">Total Conversions</p>
          <h2 className="text-lg md:text-2xl font-bold">{totalConversions}</h2>
        </div>

        <div className="p-3 md:p-4 bg-white rounded-xl shadow border">
          <p className="text-gray-500 text-xs md:text-sm">Total Commission</p>
          <h2 className="text-lg md:text-2xl font-bold">₦{totalCommission.toLocaleString()}</h2>
        </div>

        <div className="p-3 md:p-4 bg-white rounded-xl shadow border">
          <p className="text-gray-500 text-xs md:text-sm">Total Products</p>
          <h2 className="text-lg md:text-2xl font-bold">{productStats.length}</h2>
        </div>

        <div className="p-3 md:p-4 bg-white rounded-xl shadow border">
          <p className="text-gray-500 text-xs md:text-sm">Avg Commission</p>
          <h2 className="text-lg md:text-2xl font-bold">₦500 / conv.</h2>
        </div>
      </div>

      {/* ⭐ TOP PERFORMING PRODUCT */}
      {productStats.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-2">Top Performing Product</h2>

          {(() => {
            const top = [...productStats].sort((a, b) => b.conversions - a.conversions)[0];
            const percent = ((top.conversions / totalConversions) * 100).toFixed(1);

            return (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm opacity-80">Product</p>
                  <h3 className="text-xl md:text-2xl font-bold">{top.name}</h3>
                </div>

                <div>
                  <p className="text-sm opacity-80">Conversions</p>
                  <p className="text-lg md:text-xl font-semibold">
                    {top.conversions} ({percent}%)
                  </p>
                </div>

                <div>
                  <p className="text-sm opacity-80">Commission Earned</p>
                  <p className="text-lg md:text-xl font-semibold">
                    ₦{top.commission.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* BAR CHART */}
      <div className="bg-white rounded-xl shadow border p-3 md:p-4">
        <h2 className="text-base md:text-lg font-semibold mb-3">Conversions per Product</h2>

        <div className="w-full h-[220px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="conversions" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PRODUCT BREAKDOWN */}
      <div className="bg-white rounded-xl shadow border p-3 md:p-4">
        <h2 className="text-base md:text-lg font-semibold mb-3">Product Breakdown</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm min-w-[500px]">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 md:p-3">Product</th>
                <th className="p-2 md:p-3">Conversions</th>
                <th className="p-2 md:p-3">Commission</th>
              </tr>
            </thead>

            <tbody>
              {productStats.map((p, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-2 md:p-3 font-medium">{p.name}</td>
                  <td className="p-2 md:p-3">{p.conversions}</td>
                  <td className="p-2 md:p-3 font-semibold text-primary">
                    ₦{p.commission.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VISITOR LOGS */}
      <div>
        <h2 className="text-base md:text-lg font-semibold mb-3">Visitor Logs</h2>

        <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
          <table className="w-full text-xs md:text-sm min-w-[750px]">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 md:p-3">Product</th>
                <th className="p-2 md:p-3">Code</th>
                <th className="p-2 md:p-3">Visitor</th>
                <th className="p-2 md:p-3">User Agent</th>
                <th className="p-2 md:p-3">Commission</th>
              </tr>
            </thead>

            <tbody>
              {data.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="p-2 md:p-3">
                    <span className="font-medium">{c.product?.name}</span>
                    <span className="text-gray-400 ml-1">₦{c.product?.price}</span>
                  </td>
                  <td className="p-2 md:p-3">{c.reseller_code}</td>
                  <td className="p-2 md:p-3">{c.visitor_cookie}</td>
                  <td className="p-2 md:p-3 text-gray-500">
                    {c.user_agent.length > 35
                      ? c.user_agent.slice(0, 35) + "..."
                      : c.user_agent}
                  </td>
                  <td className="p-2 md:p-3 font-semibold text-primary">₦500</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {pagination && (
        <div className="flex gap-2 mt-4 justify-center">
          <button
            disabled={!pagination.prev_page_url}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 rounded border text-sm ${
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
            className={`px-4 py-2 rounded border text-sm ${
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
