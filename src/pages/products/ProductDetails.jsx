import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Pencil, Package, Tags, Truck, Warehouse, Hash, Barcode, AlertTriangle } from "lucide-react";
import { getProductApi } from "../../api/product.api.js";
import { getMovementsApi } from "../../api/inventory.api.js";
import StockBadge from "../../components/common/StockBadge.jsx";
import { tableWrapClass, thClass, tdClass } from "../../components/ui/uiClasses.js";
import { useAuthStore } from "../../store/authStore.js";
import { canManageInventory } from "../../utils/roles.js";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import { cardClass } from "../../components/ui/uiClasses.js";

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
      <Icon size={16} className="mt-0.5 shrink-0 text-blue-600" />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-slate-900">{value || "—"}</p>
      </div>
    </div>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const user = useAuthStore(function (s) { return s.user; });
  const { data, isLoading } = useQuery({ queryKey: ["product", id], queryFn: function () { return getProductApi(id); } });
  const { data: movementsData } = useQuery({
    queryKey: ["movements", id],
    queryFn: function () { return getMovementsApi(id); }
  });
  if (isLoading) return <Loader />;
  const p = data?.data?.data;
  const movements = movementsData?.data?.data || [];
  const shelfLabel = p?.shelfNameSnapshot ? `${p.shelfNameSnapshot} - ${p.shelfPointSnapshot}` : "Not assigned";
  const isLow = p && p.stockQuantity > 0 && p.stockQuantity <= p.minStockLevel;
  const isOut = p && p.stockQuantity === 0;

  return (
    <div>
      <Link to="/products" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
        <ArrowLeft size={16} /> Back to products
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">{p?.name}</h1>
        {canManageInventory(user) && (
          <Link to={`/products/${id}/edit`}><Button icon={Pencil}>Edit Product</Button></Link>
        )}
      </div>
      {(isOut || isLow) && (
        <div
          className={`mt-4 flex items-center gap-3 rounded-2xl border p-4 ${
            isOut ? "border-red-200 bg-red-50 text-red-800" : "border-orange-200 bg-orange-50 text-orange-800"
          }`}
        >
          <AlertTriangle size={20} />
          <p className="text-sm font-medium">
            {isOut ? "This product is out of stock" : "This product is low on stock"}
          </p>
          <StockBadge stock={p.stockQuantity} minStock={p.minStockLevel} />
        </div>
      )}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className={`${cardClass} space-y-3 p-6`}>
          <DetailRow icon={Hash} label="SKU" value={p?.sku} />
          <DetailRow icon={Barcode} label="Barcode" value={p?.barcode} />
          <DetailRow icon={Tags} label="Category" value={p?.category?.name} />
          <DetailRow icon={Truck} label="Supplier" value={p?.supplier?.name} />
          <DetailRow icon={Warehouse} label="Shelf" value={shelfLabel} />
          <DetailRow icon={Package} label="Stock" value={`${p?.stockQuantity} ${p?.unit}`} />
          <DetailRow icon={Package} label="Prices" value={`Buy: ${p?.purchasePrice} · Sell: ${p?.sellingPrice}`} />
        </div>
        <div className={`${cardClass} flex flex-col items-center p-8 text-center`}>
          <h2 className="font-semibold text-slate-900">QR Code</h2>
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
            <QRCodeSVG value={p?.qrCodeValue || p?.sku || p?._id} size={180} />
          </div>
          <p className="mt-3 text-sm text-slate-500">{p?.qrCodeValue || p?.sku}</p>
          <button type="button" onClick={function () { window.print(); }} className="mt-4 text-sm text-blue-600">
            Print QR label
          </button>
        </div>
      </div>
      {movements.length > 0 && (
        <div className={`${cardClass} mt-6 p-6`}>
          <h2 className="mb-4 font-semibold text-slate-900">Stock movement history</h2>
          <div className={tableWrapClass}>
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className={thClass}>Type</th>
                  <th className={thClass}>Qty</th>
                  <th className={thClass}>Prev</th>
                  <th className={thClass}>New</th>
                  <th className={thClass}>By</th>
                  <th className={thClass}>Date</th>
                </tr>
              </thead>
              <tbody>
                {movements.map(function (m) {
                  return (
                    <tr key={m._id} className="border-t border-slate-100">
                      <td className={tdClass}>{m.type}</td>
                      <td className={tdClass}>{m.quantity}</td>
                      <td className={tdClass}>{m.previousStock}</td>
                      <td className={tdClass}>{m.newStock}</td>
                      <td className={tdClass}>{m.adjustedBy?.name}</td>
                      <td className={tdClass}>{new Date(m.createdAt).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export default ProductDetails;
