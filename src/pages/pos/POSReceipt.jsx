import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getReceiptApi } from "../../api/pos.api.js";
import Loader from "../../components/common/Loader.jsx";

function POSReceipt() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["receipt", id],
    queryFn: function () { return getReceiptApi(id); }
  });

  if (isLoading) return <Loader />;
  const sale = data?.data?.data;

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-sm print:shadow-none dark:bg-slate-900" id="receipt">
        <h1 className="text-center text-xl font-bold">Receipt</h1>
        <p className="text-center text-sm text-slate-500">{sale?.invoiceNumber}</p>
        <p className="mt-2 text-center text-xs">{new Date(sale?.orderDate).toLocaleString()}</p>
        <hr className="my-4 dark:border-slate-700" />
        {sale?.items?.map(function (item) {
          return (
            <div key={item._id} className="flex justify-between text-sm py-1">
              <span>{item.product?.name} x{item.quantity}</span>
              <span>{item.total}</span>
            </div>
          );
        })}
        <hr className="my-4 dark:border-slate-700" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{sale?.subtotal}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>{sale?.tax}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>{sale?.discount}</span></div>
          <div className="flex justify-between font-bold"><span>Total</span><span>{sale?.total}</span></div>
          <div className="flex justify-between"><span>Paid</span><span>{sale?.paidAmount}</span></div>
          <div className="flex justify-between text-green-600"><span>Change</span><span>{sale?.changeAmount}</span></div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">Payment: {sale?.paymentMethod}</p>
      </div>
      <div className="mt-4 flex gap-3 print:hidden">
        <button type="button" onClick={function () { window.print(); }} className="flex-1 rounded-xl bg-blue-600 py-2 text-white">Print</button>
        <Link to="/pos" className="flex-1 rounded-xl border py-2 text-center">New Sale</Link>
      </div>
    </div>
  );
}

export default POSReceipt;
