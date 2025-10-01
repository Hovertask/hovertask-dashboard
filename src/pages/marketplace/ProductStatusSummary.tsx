import { CircleCheck, CircleDashed, Clock, LoaderCircle } from "lucide-react";

function ProductStatusSummary({ products }: { products: any[] }) {
  const statusCounts = {
    active: products.filter((p) => p.is_active).length,
    inactive: products.filter((p) => !p.is_active).length,
    pending: products.filter((p) => p.status === "pending").length,
    draft: products.filter((p) => p.status === "draft").length,
  };

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="flex items-center gap-3 bg-green-50 text-green-700 p-3 rounded-lg">
        <CircleCheck size={20} />
        <div>
          <p className="text-sm font-medium">{statusCounts.active} Active</p>
          <p className="text-xs text-green-600">Products live now</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-yellow-50 text-yellow-700 p-3 rounded-lg">
        <CircleDashed size={20} />
        <div>
          <p className="text-sm font-medium">{statusCounts.inactive} Inactive</p>
          <p className="text-xs text-yellow-600">Products not visible</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-blue-50 text-blue-700 p-3 rounded-lg">
        <Clock size={20} />
        <div>
          <p className="text-sm font-medium">{statusCounts.pending} Pending</p>
          <p className="text-xs text-blue-600">Awaiting approval</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-gray-50 text-gray-700 p-3 rounded-lg">
        <LoaderCircle size={20} />
        <div>
          <p className="text-sm font-medium">{statusCounts.draft} Draft</p>
          <p className="text-xs text-gray-600">Saved but not published</p>
        </div>
      </div>
    </div>
  );
}

export default ProductStatusSummary;
