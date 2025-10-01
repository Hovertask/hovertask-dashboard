function ProductListings({ products }: { products: any[] }) {
  if (!products.length) {
    return <p className="text-sm text-gray-500">No products found.</p>;
  }

  return (
    <div className="space-y-4">
      {products.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
        >
          {/* ✅ Left Section: Image + Info */}
          <div className="flex items-center gap-4">
            <img
              src={p.image_url || "/placeholder.png"}
              alt={p.name}
              className="w-14 h-14 rounded-md object-cover"
            />

            <div>
              <h3 className="font-medium text-gray-900">{p.name}</h3>
              <p className="text-sm text-gray-500">${p.price}</p>

              <div className="flex items-center gap-2 mt-1">
                {/* Stock Badge */}
                {p.in_stock ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                    In Stock
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-600 border border-red-200">
                    Out of Stock
                  </span>
                )}

                {/* ✅ Track Performance button */}
                <button
                  onClick={() => console.log("Track performance for", p.id)}
                  className="px-3 py-1 text-xs rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Track Performance
                </button>
              </div>
            </div>
          </div>

          {/* ✅ Right Section: Status + Actions */}
          <div className="flex items-center gap-4">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                p.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {p.is_active ? "Active" : "Inactive"}
            </span>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                Edit
              </button>
              <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default ProductListings;