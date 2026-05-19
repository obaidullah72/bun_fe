import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Warehouse, Package } from "lucide-react";
import { getShelfApi, getShelfProductsApi } from "../../api/shelf.api.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Loader from "../../components/common/Loader.jsx";
import { tableWrapClass, thClass, tdClass, cardClass } from "../../components/ui/uiClasses.js";

function ShelfDetails() {
  const { id } = useParams();
  const shelfQuery = useQuery({ queryKey: ["shelf", id], queryFn: function () { return getShelfApi(id); } });
  const productsQuery = useQuery({ queryKey: ["shelf-products", id], queryFn: function () { return getShelfProductsApi(id); } });
  if (shelfQuery.isLoading) return <Loader />;
  const shelf = shelfQuery.data?.data?.data;
  const products = productsQuery.data?.data?.data || [];
  const location = [shelf?.rackNumber, shelf?.rowNumber, shelf?.pointName].filter(Boolean).join(" · ");

  return (
    <div>
      <Link to="/shelves" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600"><ArrowLeft size={16} /> Back to shelves</Link>
      <div className={`${cardClass} mt-4 flex items-center gap-4 p-5`}>
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Warehouse size={22} /></span>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{shelf?.shelfName}</h1>
          <p className="text-sm text-slate-500">{shelf?.shelfCode} · {shelf?.zone} · {location}</p>
        </div>
      </div>
      <PageHeader title={`Products on shelf (${products.length})`} subtitle="Items assigned to this location" />
      <div className={tableWrapClass}>
        <table className="w-full">
          <thead className="border-b border-slate-100 bg-slate-50"><tr><th className={thClass}>Name</th><th className={thClass}>SKU</th><th className={thClass}>Stock</th></tr></thead>
          <tbody>{products.map(function (p) {
            return <tr key={p._id} className="border-t border-slate-100 hover:bg-slate-50/50"><td className={`${tdClass} font-medium`}><span className="flex items-center gap-2"><Package size={14} className="text-slate-400" />{p.name}</span></td><td className={tdClass}>{p.sku}</td><td className={tdClass}>{p.stockQuantity}</td></tr>;
          })}</tbody>
        </table>
      </div>
    </div>
  );
}
export default ShelfDetails;
