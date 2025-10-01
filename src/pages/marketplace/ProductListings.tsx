function ProductListings({ products }: { products: any[] }) {
  if (!products.length) {
    return <p className="text-sm text-gray-500">No products found.</p>;
  }

  return (
    <table className="w-full border border-gray-200 rounded-lg text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2">Price</th>
          <th className="p-2">Status</th>
          <th className="p-2">Created</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-t">
            <td className="p-2">{p.name}</td>
            <td className="p-2">${p.price}</td>
            <td className="p-2">
              {p.is_active ? "Active" : p.status === "pending" ? "Pending" : p.status}
            </td>
            <td className="p-2">{new Date(p.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductListings;
