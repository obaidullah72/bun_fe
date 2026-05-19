import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { Receipt, Printer, Download, ArrowLeft, Store } from "lucide-react";
import { getReceiptApi } from "../../api/receipt.api.js";
import { downloadPdfFromApi } from "../../utils/downloadPdf.js";
import Loader from "../../components/common/Loader.jsx";
import Button from "../../components/ui/Button.jsx";
import toast from "react-hot-toast";

function POSReceipt() {
  const { id } = useParams();
  const [pdfLoading, setPdfLoading] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["receipt", id],
    queryFn: function () { return getReceiptApi(id); }
  });

  const sale = data?.data?.data;

  async function handlePdf() {
    setPdfLoading(true);
    try {
      await downloadPdfFromApi(`/pos/receipt/${id}/pdf`, `receipt-${sale?.invoiceNumber || id}.pdf`);
      toast.success("Receipt PDF downloaded");
    } catch {
      toast.error("PDF download failed");
    } finally {
      setPdfLoading(false);
    }
  }

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-[80vh] bg-slate-100/80 py-8 print:bg-white print:py-0">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-print, #receipt-print * { visibility: visible; }
          #receipt-print { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-lg px-4">
        <div className="mb-6 print:hidden">
          <Link to="/pos" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600">
            <ArrowLeft size={16} /> Back to POS
          </Link>
        </div>

        <div
          id="receipt-print"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg print:rounded-none print:border-0 print:shadow-none"
        >
          <div className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-8 py-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Store size={28} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Inventory Shop</h1>
            <p className="mt-1 text-xs text-slate-500">Point of Sale Receipt</p>
          </div>

          <div className="space-y-1 px-8 py-5 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Invoice</span>
              <span className="font-semibold text-slate-900">{sale?.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <span>{new Date(sale?.orderDate).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Cashier</span>
              <span>{sale?.createdBy?.name || "—"}</span>
            </div>
            {sale?.customerName && (
              <div className="flex justify-between">
                <span>Customer</span>
                <span>
                  {sale.customerName}
                  {sale.customerPhone ? ` · ${sale.customerPhone}` : ""}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Payment</span>
              <span>
                {sale?.paymentMethod} · <span className="capitalize">{sale?.paymentStatus}</span>
              </span>
            </div>
          </div>

          <div className="border-y border-slate-100 px-8 py-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-400">
                  <th className="pb-2">Item</th>
                  <th className="pb-2 text-right">Qty</th>
                  <th className="pb-2 text-right">Price</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale?.items?.map(function (item) {
                  return (
                    <tr key={item._id} className="border-t border-slate-50">
                      <td className="py-2 pr-2">
                        <p className="font-medium text-slate-900">{item.product?.name}</p>
                        <p className="text-xs text-slate-400">{item.product?.sku}</p>
                      </td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">{item.unitPrice}</td>
                      <td className="py-2 text-right font-medium">{item.total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 px-8 py-5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{sale?.subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Discount</span>
              <span>{sale?.discount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax</span>
              <span>{sale?.tax}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
              <span>Grand Total</span>
              <span>{sale?.total}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Paid</span>
              <span>{sale?.paidAmount}</span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-600">
              <span>Change</span>
              <span>{sale?.changeAmount}</span>
            </div>
          </div>

          <div className="flex flex-col items-center border-t border-slate-100 px-8 py-6">
            <QRCodeSVG value={sale?.invoiceNumber || id} size={96} level="M" />
            <p className="mt-3 text-center text-xs text-slate-500">Thank you for shopping with us</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 print:hidden">
          <Button type="button" onClick={function () { window.print(); }} icon={Printer} className="flex-1">
            Print
          </Button>
          <Button
            type="button"
            onClick={handlePdf}
            icon={Download}
            variant="secondary"
            className="flex-1"
            disabled={pdfLoading}
          >
            {pdfLoading ? "Downloading..." : "Download PDF"}
          </Button>
          <Link to="/pos" className="flex-1">
            <Button type="button" icon={Receipt} variant="secondary" className="w-full">
              New Sale
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default POSReceipt;
