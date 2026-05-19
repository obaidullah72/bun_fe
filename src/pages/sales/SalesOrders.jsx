import { useQuery } from "@tanstack/react-query";
import { Receipt } from "lucide-react";
import { getSalesOrdersApi } from "../../api/salesOrder.api.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { tableWrapClass, thClass, tdClass } from "../../components/ui/uiClasses.js";

function SalesOrders() {
  const { data, isLoading } = useQuery({ queryKey: ["sales-orders"], queryFn: getSalesOrdersApi });
  const orders = data?.data?.data || [];
  if (isLoading) return <Loader />;
  return (
    <div>
      <PageHeader title="Sales Orders" subtitle="All completed sales and invoices" />
      {!orders.length ? <EmptyState title="No sales orders" icon={Receipt} /> : (
        <div className={tableWrapClass}>
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr><th className={thClass}>Invoice</th><th className={thClass}>Customer</th><th className={thClass}>Total</th><th className={thClass}>Payment</th><th className={thClass}>Date</th></tr>
            </thead>
            <tbody>{orders.map(function (o) {
              return (
                <tr key={o._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className={`${tdClass} font-medium text-slate-900`}>{o.invoiceNumber}</td>
                  <td className={tdClass}>{o.customerName || "Walk-in"}</td>
                  <td className={tdClass}>{o.total}</td>
                  <td className={tdClass}><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">{o.paymentMethod}</span></td>
                  <td className={tdClass}>{new Date(o.orderDate).toLocaleDateString()}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default SalesOrders;
