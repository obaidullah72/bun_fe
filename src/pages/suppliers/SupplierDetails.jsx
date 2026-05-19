import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getSupplierApi,
  getSupplierProductsApi,
  getSupplierPurchaseOrdersApi
} from "../../api/supplier.api.js";
import DetailLayout, { DetailCard, InfoGrid } from "../../components/common/DetailLayout.jsx";
import { tableWrapClass, thClass, tdClass } from "../../components/ui/uiClasses.js";

function SupplierDetails() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ["supplier", id], queryFn: function () { return getSupplierApi(id); } });
  const { data: productsData } = useQuery({
    queryKey: ["supplier-products", id],
    queryFn: function () { return getSupplierProductsApi(id); }
  });
  const { data: poData } = useQuery({
    queryKey: ["supplier-pos", id],
    queryFn: function () { return getSupplierPurchaseOrdersApi(id); }
  });
  const supplier = data?.data?.data;
  const products = productsData?.data?.data || [];
  const poInfo = poData?.data?.data;

  return (
    <DetailLayout
      backTo="/suppliers"
      backLabel="Back to suppliers"
      title={supplier?.name}
      loading={isLoading}
    >
      <DetailCard title="Contact">
        <InfoGrid
          items={[
            { label: "Contact person", value: supplier?.contactPerson },
            { label: "Email", value: supplier?.email },
            { label: "Phone", value: supplier?.phone },
            { label: "Address", value: supplier?.address },
            { label: "Total purchase value", value: poInfo?.totalValue?.toFixed?.(2) || poInfo?.totalValue }
          ]}
        />
      </DetailCard>
      <DetailCard title="Products">
        <div className={tableWrapClass}>
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className={thClass}>Product</th>
                <th className={thClass}>SKU</th>
                <th className={thClass}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(function (p) {
                return (
                  <tr key={p._id} className="border-t border-slate-100">
                    <td className={tdClass}><Link to={`/products/${p._id}`} className="text-blue-600">{p.name}</Link></td>
                    <td className={tdClass}>{p.sku}</td>
                    <td className={tdClass}>{p.stockQuantity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DetailCard>
      <DetailCard title="Purchase orders">
        <div className={tableWrapClass}>
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className={thClass}>Ref</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Total</th>
              </tr>
            </thead>
            <tbody>
              {(poInfo?.orders || []).map(function (o) {
                return (
                  <tr key={o._id} className="border-t border-slate-100">
                    <td className={tdClass}>
                      <Link to={`/purchase-orders/${o._id}`} className="text-blue-600">
                        {String(o._id).slice(-8)}
                      </Link>
                    </td>
                    <td className={tdClass}>{o.status}</td>
                    <td className={tdClass}>{o.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DetailCard>
    </DetailLayout>
  );
}

export default SupplierDetails;
