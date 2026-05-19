import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Receipt, Printer, Plus } from "lucide-react";
import { getReceiptApi } from "../../api/pos.api.js";
import Loader from "../../components/common/Loader.jsx";
import Button from "../../components/ui/Button.jsx";
import { cardClass, btnSecondary } from "../../components/ui/uiClasses.js";

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
      <div className={`${cardClass} p-8`} id="receipt">
        <div className="mb-4 flex justify-center">
          <span className="rounded-full bg-blue-50 p-3 text-blue-600"><Receipt size={24} /></span>
        </div>
        <h1 className="text-center text-xl font-bold text-slate-900">Receipt</h1>
        <p className="text-center text-sm text-slate-500">{sale?.invoiceNumber}</p>
        <p className="mt-1 text-center text-xs text-slate-400">{new Date(sale?.orderDate).toLocaleString()}</p>
        <hr className="my-4 border-slate-200" />
        {sale?.items?.map(function (item) {
          return (
            <div key={item._id} className="flex justify-between py-1.5 text-sm text-slate-700">
              <span>{item.product?.name} ×{item.quantity}</span>
              <span className="font-medium">{item.total}</span>
            </div>
          );
        })}
        <hr className="my-4 border-slate-200" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{sale?.subtotal}</span></div>
          <div className="flex justify-between text-slate-600"><span>Tax</span><span>{sale?.tax}</span></div>
          <div className="flex justify-between text-slate-600"><span>Discount</span><span>{sale?.discount}</span></div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900"><span>Total</span><span>{sale?.total}</span></div>
          <div className="flex justify-between text-slate-600"><span>Paid</span><span>{sale?.paidAmount}</span></div>
          <div className="flex justify-between font-medium text-emerald-600"><span>Change</span><span>{sale?.changeAmount}</span></div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">Payment: {sale?.paymentMethod}</p>
      </div>
      <div className="mt-4 flex gap-3 print:hidden">
        <Button type="button" onClick={function () { window.print(); }} icon={Printer} className="flex-1">Print</Button>
        <Link to="/pos" className={`${btnSecondary} flex-1`}>New Sale</Link>
      </div>
    </div>
  );
}

export default POSReceipt;
