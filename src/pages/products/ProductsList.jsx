import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "../../api/product.api.js";

function ProductsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async function () {
      const response = await getProductsApi();
      return response.data.data;
    }
  });

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>

        <Link
          to="/products/add"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Shelf</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((product) => (
              <tr key={product._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3">{product.sku}</td>
                <td className="px-4 py-3">{product.stockQuantity}</td>
                <td className="px-4 py-3">{product.sellingPrice}</td>
                <td className="px-4 py-3">
                  {product.shelfNameSnapshot || "-"}
                </td>
              </tr>
            ))}

            {!data?.length && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsList;