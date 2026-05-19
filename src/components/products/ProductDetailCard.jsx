import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Package, Tags, Truck, Warehouse, Hash, Barcode, ExternalLink, Pencil
} from "lucide-react";
import { canManageInventory } from "../../utils/roles.js";
import Button from "../ui/Button.jsx";
import { cardClass } from "../ui/uiClasses.js";

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

function ProductDetailCard({ product, user, showActions = true }) {
  if (!product) return null;

  const shelfLabel = product.shelfNameSnapshot
    ? `${product.shelfNameSnapshot}${product.shelfPointSnapshot ? ` · ${product.shelfPointSnapshot}` : ""}`
    : "Not assigned";

  const lowStock = product.stockQuantity <= product.minStockLevel;
  const stockText = `${product.stockQuantity} ${product.unit}${lowStock ? " (low stock)" : ""}`;

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Product found</p>
          <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
        </div>
        {showActions && (
          <div className="flex flex-wrap gap-2">
            <Link to={`/products/${product._id}`}>
              <Button variant="secondary" icon={ExternalLink}>Full page</Button>
            </Link>
            {canManageInventory(user) && (
              <Link to={`/products/${product._id}/edit`}>
                <Button icon={Pencil}>Edit</Button>
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${cardClass} space-y-3 p-6`}>
          <DetailRow icon={Hash} label="SKU" value={product.sku} />
          <DetailRow icon={Barcode} label="Barcode" value={product.barcode} />
          <DetailRow icon={Tags} label="Category" value={product.category?.name} />
          <DetailRow icon={Truck} label="Supplier" value={product.supplier?.name} />
          <DetailRow icon={Warehouse} label="Shelf" value={shelfLabel} />
          <DetailRow icon={Package} label="Stock" value={stockText} />
          <DetailRow icon={Package} label="Prices" value={`Purchase: ${product.purchasePrice} · Selling: ${product.sellingPrice}`} />
          {product.description ? <DetailRow icon={Package} label="Description" value={product.description} /> : null}
        </div>
        <div className={`${cardClass} flex flex-col items-center justify-center p-8 text-center`}>
          <h3 className="font-semibold text-slate-900">QR Code</h3>
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
            <QRCodeSVG value={product.qrCodeValue || product.sku || product._id} size={160} />
          </div>
          <p className="mt-3 text-sm text-slate-500">{product.qrCodeValue || product.sku}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailCard;
