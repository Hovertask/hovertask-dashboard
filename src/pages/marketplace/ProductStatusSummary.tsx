function ProductStatusSummary({
  products,
  filter,
  setFilter,
}: {
  products: any[];
  filter: string;
  setFilter: (val: string) => void;
}) {
  const counts = {
    total: products.length,
    active: products.filter((p) => p.is_active).length,
    inactive: products.filter((p) => !p.is_active).length,
    pending: products.filter((p) => p.status === "pending").length,
    review: products.filter((p) => p.status === "review").length,
    failed: products.filter((p) => p.status === "failed").length,
  };

  const tabs = [
    { key: "all", label: `Total ${counts.total}`, color: "text-indigo-600 bg-indigo-50" },
    { key: "active", label: `${counts.active} Active`, color: "text-green-600 bg-green-50" },
    { key: "inactive", label: `${counts.inactive} Inactive`, color: "text-yellow-600 bg-yellow-50" },
    { key: "pending", label: `${counts.pending} Pending`, color: "text-blue-600 bg-blue-50" },
    { key: "review", label: `${counts.review} In Review`, color: "text-gray-600 bg-gray-50" },
    { key: "failed", label: `${counts.failed} Failed`, color: "text-red-600 bg-red-50" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1 rounded-md transition ${
              filter === tab.key
                ? `${tab.color} font-semibold ring-1 ring-offset-1 ring-indigo-500`
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductStatusSummary;
