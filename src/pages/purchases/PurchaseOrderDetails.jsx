import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileDown, PackageCheck } from "lucide-react";
import {
  getPurchaseOrderApi,
  receivePurchaseOrderApi,
  downloadPurchaseOrderPdfApi
} from "../../api/purchaseOrder.api.js";
import DetailLayout, { DetailCard, InfoGrid } from "../../components/common/DetailLayout.jsx";
import Button from "../../components/ui/Button.jsx";
import { tableWrapClass, thClass, tdClass } from "../../components/ui/uiClasses.js";
import toast from "react-hot-toast";

function PurchaseOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pdfLoading, setPdfLoading] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["purchase-order", id],
    queryFn: function () { return getPurchaseOrderApi(id); }
  });
  const order = data?.data?.data;

  async function handleReceive() {
    try {
      await receivePurchaseOrderApi(id);
      toast.success("Purchase order received");
      queryClient.invalidateQueries({ queryKey: ["purchase-order", id] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Receive failed");
    }
  }

  async function handlePdf() {
    setPdfLoading(true);
    try {
      await downloadPurchaseOrderPdfApi(id);
      toast.success("PDF downloaded");
    } catch {
      toast.error("PDF failed");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <DetailLayout
      backTo="/purchase-orders"
      backLabel="Back to purchase orders"
      title={`PO #${String(order?._id || "").slice(-8).toUpperCase()}`}
      subtitle={order?.supplier?.name}
      loading={isLoading}
      badge={
        order && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
            {order.status}
          </span>
        )
      }
      actions={
        <>
          {order?.status !== "received" && order?.status !== "cancelled" && (
            <Button type="button" icon={PackageCheck} onClick={handleReceive}>Receive</Button>
          )}
          <Button type="button" icon={FileDown} variant="secondary" onClick={handlePdf} disabled={pdfLoading}>
            PDF
          </Button>
          <Button type="button" variant="secondary" onClick={function () { navigate("/purchase-orders"); }}>
            Back
          </Button>
        </>
      }
    >
      <DetailCard title="Details">
        <InfoGrid
          items={[
            { label: "Supplier", value: order?.supplier?.name },
            { label: "Status", value: order?.status },
            { label: "Created by", value: order?.createdBy?.name },
            { label: "Expected", value: order?.expectedDate ? new Date(order.expectedDate).toLocaleDateString() : "—" },
            { label: "Received", value: order?.receivedDate ? new Date(order.receivedDate).toLocaleDateString() : "—" },
            { label: "Total", value: order?.total }
          ]}
        />
      </DetailCard>
      <DetailCard title="Items">
        <div className={tableWrapClass}>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className={thClass}>Product</th>
                <th className={thClass}>SKU</th>
                <th className={thClass}>Qty</th>
                <th className={thClass}>Unit price</th>
                <th className={thClass}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order?.items?.map(function (item) {
                return (
                  <tr key={item._id} className="border-t border-slate-100">
                    <td className={tdClass}>{item.product?.name}</td>
                    <td className={tdClass}>{item.product?.sku}</td>
                    <td className={tdClass}>{item.quantity}</td>
                    <td className={tdClass}>{item.unitPrice}</td>
                    <td className={tdClass}>{item.total}</td>
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

export default PurchaseOrderDetails;
