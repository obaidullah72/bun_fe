import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FileDown, Printer } from "lucide-react";
import { getSalesOrderApi, downloadSalesOrderPdfApi } from "../../api/salesOrder.api.js";
import DetailLayout, { DetailCard, InfoGrid } from "../../components/common/DetailLayout.jsx";
import Button from "../../components/ui/Button.jsx";
import { tableWrapClass, thClass, tdClass } from "../../components/ui/uiClasses.js";
import toast from "react-hot-toast";

function SalesOrderDetails() {
  const { id } = useParams();
  const [pdfLoading, setPdfLoading] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ["sales-order", id],
    queryFn: function () { return getSalesOrderApi(id); }
  });
  const order = data?.data?.data;

  async function handlePdf() {
    setPdfLoading(true);
    try {
      await downloadSalesOrderPdfApi(id);
      toast.success("Invoice PDF downloaded");
    } catch {
      toast.error("PDF failed");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <DetailLayout
      backTo="/sales-orders"
      backLabel="Back to sales orders"
      title={order?.invoiceNumber || "Sales Order"}
      subtitle={order ? new Date(order.orderDate).toLocaleString() : ""}
      loading={isLoading}
      error={error ? "Sales order not found" : null}
      badge={
        order && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
            {order.status}
          </span>
        )
      }
      actions={
        <>
          <Button type="button" variant="secondary" icon={Printer} onClick={function () { window.print(); }}>Print</Button>
          <Button type="button" icon={FileDown} onClick={handlePdf} disabled={pdfLoading}>
            {pdfLoading ? "..." : "Download PDF"}
          </Button>
        </>
      }
    >
      <DetailCard title="Order information">
        <InfoGrid
          items={[
            { label: "Customer", value: order?.customerName || "Walk-in" },
            { label: "Email", value: order?.customerEmail },
            { label: "Phone", value: order?.customerPhone },
            { label: "Cashier", value: order?.createdBy?.name },
            { label: "Payment", value: order?.paymentMethod },
            { label: "Payment status", value: order?.paymentStatus }
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
                <th className={thClass}>Price</th>
                <th className={thClass}>Disc</th>
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
                    <td className={tdClass}>{item.discount}</td>
                    <td className={tdClass}>{item.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <p>Subtotal: {order?.subtotal}</p>
          <p>Tax: {order?.tax} · Discount: {order?.discount}</p>
          <p className="text-lg font-bold">Grand total: {order?.total}</p>
          <p>Paid: {order?.paidAmount} · Change: {order?.changeAmount}</p>
          {order?.notes && <p className="text-slate-500">Notes: {order.notes}</p>}
        </div>
      </DetailCard>
      {order && (
        <Link to={`/pos/receipt/${order._id}`} className="text-sm text-blue-600">View POS receipt →</Link>
      )}
    </DetailLayout>
  );
}

export default SalesOrderDetails;
