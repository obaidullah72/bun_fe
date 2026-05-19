import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Pencil, Package, Tags, Truck, Warehouse, Hash, Barcode } from "lucide-react";
import { getProductApi } from "../../api/product.api.js";
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
  if (isLoading) return <Loader />;
  const p = data?.data?.data;
  const shelfLabel = p?.shelfNameSnapshot ? `${p.shelfNameSnapshot} - ${p.shelfPointSnapshot}` : "Not assigned";

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
        </div>
      </div>
    </div>
  );
}
export default ProductDetails;
