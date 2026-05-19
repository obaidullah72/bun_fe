import { useQuery } from "@tanstack/react-query";
import { getStockApi } from "../../api/inventory.api.js";
import Loader from "../../components/common/Loader.jsx";

function StockTracking() {
  const { data, isLoading } = useQuery({ queryKey: ["stock"], queryFn: getStockApi });
  const products = data?.data?.data || [];
  if (isLoading) return <Loader />;
  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">Stock Tracking</h1>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800"><tr><th className="p-4 text-left">Product</th><th className="p-4 text-left">SKU</th><th className="p-4 text-left">Shelf</th><th className="p-4 text-left">Stock</th><th className="p-4 text-left">Min</th></tr></thead>
          <tbody>{products.map(function (p) {
            return <tr key={p._id} className="border-t dark:border-slate-800"><td className="p-4">{p.name}</td><td className="p-4">{p.sku}</td><td className="p-4">{p.shelfNameSnapshot} {p.shelfPointSnapshot && `- ${p.shelfPointSnapshot}`}</td><td className="p-4">{p.stockQuantity}</td><td className="p-4">{p.minStockLevel}</td></tr>;
          })}</tbody>
        </table>
      </div>
    </div>
  );
}
export default StockTracking;
