import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { getLowStockApi } from "../../api/inventory.api.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { cardClass } from "../../components/ui/uiClasses.js";

function LowStock() {
  const { data, isLoading } = useQuery({ queryKey: ["low-stock"], queryFn: getLowStockApi });
  const products = data?.data?.data || [];
  if (isLoading) return <Loader />;
  return (
    <div>
      <PageHeader title="Low Stock Alerts" subtitle="Products at or below minimum stock level" />
      {!products.length ? (
        <EmptyState title="All stock levels are healthy" icon={AlertTriangle} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map(function (p) {
            return (
              <div key={p._id} className={`${cardClass} border-amber-200 bg-amber-50/50 p-5`}>
                <div className="flex items-start gap-3">
                  <span className="rounded-xl bg-amber-100 p-2 text-amber-600"><AlertTriangle size={18} /></span>
                  <div>
                    <p className="font-semibold text-slate-900">{p.name}</p>
                    <p className="text-sm text-slate-500">{p.sku}</p>
                    <p className="mt-2 text-sm font-medium text-amber-700">Stock: {p.stockQuantity} / Min: {p.minStockLevel}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default LowStock;
