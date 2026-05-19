import { useQuery } from "@tanstack/react-query";
import { getLowStockApi } from "../../api/inventory.api.js";
import Loader from "../../components/common/Loader.jsx";

function LowStock() {
  const { data, isLoading } = useQuery({ queryKey: ["low-stock"], queryFn: getLowStockApi });
  const products = data?.data?.data || [];
  if (isLoading) return <Loader />;
  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">Low Stock Alerts</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {products.map(function (p) {
          return (
            <div key={p._id} className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-amber-700">Stock: {p.stockQuantity} / Min: {p.minStockLevel}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default LowStock;
