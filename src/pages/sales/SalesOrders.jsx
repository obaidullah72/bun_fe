import { useQuery } from "@tanstack/react-query";
import { getSalesOrdersApi } from "../../api/salesOrder.api.js";
import Loader from "../../components/common/Loader.jsx";

function SalesOrders() {
  const { data, isLoading } = useQuery({ queryKey: ["sales-orders"], queryFn: getSalesOrdersApi });
  const orders = data?.data?.data || [];
  if (isLoading) return <Loader />;
  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">Sales Orders</h1>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-sm"><thead className="bg-slate-50 dark:bg-slate-800"><tr><th className="p-4 text-left">Invoice</th><th className="p-4 text-left">Customer</th><th className="p-4 text-left">Total</th><th className="p-4 text-left">Payment</th><th className="p-4 text-left">Date</th></tr></thead>
        <tbody>{orders.map(function (o) {
          return <tr key={o._id} className="border-t dark:border-slate-800"><td className="p-4">{o.invoiceNumber}</td><td className="p-4">{o.customerName || "Walk-in"}</td><td className="p-4">{o.total}</td><td className="p-4">{o.paymentMethod}</td><td className="p-4">{new Date(o.orderDate).toLocaleDateString()}</td></tr>;
        })}</tbody></table>
      </div>
    </div>
  );
}
export default SalesOrders;
