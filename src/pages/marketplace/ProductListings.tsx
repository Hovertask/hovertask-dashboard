function ProductListings({ products, filter }: { products: any[]; filter: string }) {
  let filteredProducts = products;

  if (filter === "active") {
    filteredProducts = products.filter((p) => p.is_active);
  } else if (filter === "inactive") {
    filteredProducts = products.filter((p) => !p.is_active);
  } else if (filter === "pending") {
    filteredProducts = products.filter((p) => p.status === "pending");
  } else if (filter === "review") {
    filteredProducts = products.filter((p) => p.status === "review");
  } else if (filter === "failed") {
    filteredProducts = products.filter((p) => p.status === "failed");
  }

  if (!filteredProducts.length) {
    return <p className="text-sm text-gray-500">No products found for this filter.</p>;
  }

  return (
    <div className="space-y-4">
      {filteredProducts.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
        >
          {/* Left: Image + Details */}
          <div className="flex items-center gap-4">
  {p.product_images && p.product_images.length > 0 ? (
    p.product_images[0].video_path ? (
      <video
        src={p.product_images[0].video_path}
        className="w-16 h-16 rounded-md object-cover border"
        controls
      />
    ) : (
      <img
        src={p.product_images[0].file_path}
        alt={p.name}
        className="w-16 h-16 rounded-md object-cover border"
      />
    )
  ) : (
    <img
      src="/placeholder.png"
      alt="placeholder"
      className="w-16 h-16 rounded-md object-cover border"
    />
  )}
            <div>
              <h3 className="font-medium text-gray-900">{p.name}</h3>
              <p className="text-sm text-gray-600">${p.price}</p>

              <div className="flex items-center gap-2 mt-1">
                {p.stock ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                    In Stock
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-600 border border-red-200">
                    Out of Stock
                  </span>
                )}
                <button
                  onClick={() => console.log("Track performance for", p.id)}
                  className="px-3 py-1 text-xs rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Track Performance
                </button>
              </div>
            </div>
          </div>

          {/* Right: Status + Actions */}
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                p.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {p.is_active ? "Active" : "Inactive"}
            </span>

            <button className="px-3 py-1 text-sm border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50">
              Edit
            </button>
            <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg">
              Deactivate
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductListings;
