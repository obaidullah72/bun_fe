import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { getProductApi } from "../../api/product.api.js";
import { useAuthStore } from "../../store/authStore.js";
import { canManageInventory } from "../../utils/roles.js";
import Loader from "../../components/common/Loader.jsx";

function ProductDetails() {
  const { id } = useParams();
  const user = useAuthStore(function (s) { return s.user; });
  const { data, isLoading } = useQuery({ queryKey: ["product", id], queryFn: function () { return getProductApi(id); } });
  if (isLoading) return <Loader />;
  const p = data?.data?.data;
  const shelfLabel = p?.shelf ? `${p.shelfNameSnapshot} - ${p.shelfPointSnapshot}` : "Not assigned";

  return (
    <div>
      <Link to="/products" className="text-sm text-blue-600">← Back</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <h1 className="text-2xl font-bold">{p?.name}</h1>
          <p className="text-slate-500">SKU: {p?.sku} · Barcode: {p?.barcode}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-slate-500">Category</dt><dd>{p?.category?.name}</dd></div>
            <div><dt className="text-slate-500">Supplier</dt><dd>{p?.supplier?.name}</dd></div>
            <div><dt className="text-slate-500">Shelf</dt><dd>{shelfLabel}</dd></div>
            <div><dt className="text-slate-500">Stock</dt><dd>{p?.stockQuantity} {p?.unit}</dd></div>
            <div><dt className="text-slate-500">Purchase Price</dt><dd>{p?.purchasePrice}</dd></div>
            <div><dt className="text-slate-500">Selling Price</dt><dd>{p?.sellingPrice}</dd></div>
          </dl>
          {canManageInventory(user) && <Link to={`/products/${id}/edit`} className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-white">Edit</Link>}
        </div>
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm dark:bg-slate-900">
          <h2 className="font-semibold">QR Code</h2>
          <div className="mt-4 flex justify-center"><QRCodeSVG value={p?.qrCodeValue || p?.sku || p?._id} size={180} /></div>
          <p className="mt-2 text-sm text-slate-500">{p?.qrCodeValue || p?.sku}</p>
        </div>
      </div>
    </div>
  );
}
export default ProductDetails;
