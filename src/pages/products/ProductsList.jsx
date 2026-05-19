import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "../../api/product.api.js";
import { useAuthStore } from "../../store/authStore.js";
import { canManageInventory } from "../../utils/roles.js";
import Loader from "../../components/common/Loader.jsx";

function ProductsList() {
  const user = useAuthStore(function (s) { return s.user; });
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async function () {
      const response = await getProductsApi();
      return response.data.data;
    }
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Products</h1>
        {canManageInventory(user) && (
          <Link to="/products/add" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Add Product</Link>
        )}
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800"><tr>
            <th className="px-4 py-3">Name</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Price</th><th className="px-4 py-3">Shelf</th>
          </tr></thead>
          <tbody>
            {data?.map(function (product) {
              return (
                <tr key={product._id} className="border-t dark:border-slate-800">
                  <td className="px-4 py-3"><Link to={`/products/${product._id}`} className="font-medium text-blue-600">{product.name}</Link></td>
                  <td className="px-4 py-3">{product.sku}</td>
                  <td className="px-4 py-3">{product.stockQuantity}</td>
                  <td className="px-4 py-3">{product.sellingPrice}</td>
                  <td className="px-4 py-3">{product.shelfNameSnapshot}{product.shelfPointSnapshot ? ` · ${product.shelfPointSnapshot}` : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsList;
