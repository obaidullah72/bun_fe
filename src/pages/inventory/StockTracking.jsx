import { useQuery } from "@tanstack/react-query";
import { Boxes, Package } from "lucide-react";
import { getStockApi } from "../../api/inventory.api.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { tableWrapClass, thClass, tdClass } from "../../components/ui/uiClasses.js";

function StockTracking() {
  const { data, isLoading } = useQuery({ queryKey: ["stock"], queryFn: getStockApi });
  const products = data?.data?.data || [];
  if (isLoading) return <Loader />;
  return (
    <div>
      <PageHeader title="Stock Tracking" subtitle="Current stock levels across all products" />
      {!products.length ? <EmptyState title="No stock data" icon={Boxes} /> : (
        <div className={tableWrapClass}>
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr><th className={thClass}>Product</th><th className={thClass}>SKU</th><th className={thClass}>Shelf</th><th className={thClass}>Stock</th><th className={thClass}>Min</th></tr>
            </thead>
            <tbody>{products.map(function (p) {
              return (
                <tr key={p._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className={`${tdClass} font-medium text-slate-900`}><span className="flex items-center gap-2"><Package size={15} className="text-slate-400" />{p.name}</span></td>
                  <td className={tdClass}>{p.sku}</td>
                  <td className={tdClass}>{p.shelfNameSnapshot || "—"}{p.shelfPointSnapshot && <span className="block text-xs text-slate-400">{p.shelfPointSnapshot}</span>}</td>
                  <td className={tdClass}>{p.stockQuantity}</td>
                  <td className={tdClass}>{p.minStockLevel}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default StockTracking;
