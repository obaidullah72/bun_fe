import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Eye, FileDown, Printer, ShoppingCart } from "lucide-react";
import { getAlertSummaryApi } from "../../api/alert.api.js";
import { downloadLowStockPdfApi } from "../../api/report.api.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";
import StockBadge from "../../components/common/StockBadge.jsx";
import { tableWrapClass, thClass, tdClass } from "../../components/ui/uiClasses.js";
import toast from "react-hot-toast";

function LowStock() {
  const [pdfLoading, setPdfLoading] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["alert-summary"],
    queryFn: async function () {
      const res = await getAlertSummaryApi();
      return res.data.data;
    }
  });

  const products = [
    ...(data?.outOfStockProducts || []).map(function (p) { return { ...p, alertType: "out" }; }),
    ...(data?.lowStockProducts || []).map(function (p) { return { ...p, alertType: "low" }; })
  ];

  async function handlePdf() {
    setPdfLoading(true);
    try {
      await downloadLowStockPdfApi();
      toast.success("PDF downloaded");
    } catch {
      toast.error("PDF export failed");
    } finally {
      setPdfLoading(false);
    }
  }

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader
        title="Low Stock Alerts"
        subtitle={`${data?.criticalCount || 0} critical · ${data?.warningCount || 0} warnings`}
        action={
          <div className="flex gap-2">
            <Button type="button" variant="secondary" icon={Printer} onClick={function () { window.print(); }}>
              Print
            </Button>
            <Button type="button" icon={FileDown} onClick={handlePdf} disabled={pdfLoading}>
              {pdfLoading ? "Generating..." : "Export PDF"}
            </Button>
          </div>
        }
      />

      {!products.length ? (
        <EmptyState title="All stock levels are healthy" icon={AlertTriangle} />
      ) : (
        <div className={tableWrapClass}>
          <table className="w-full print:text-xs">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className={thClass}>Product</th>
                <th className={thClass}>SKU</th>
                <th className={thClass}>Stock</th>
                <th className={thClass}>Min</th>
                <th className={thClass}>Shelf</th>
                <th className={thClass}>Supplier</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(function (p) {
                const rowClass =
                  p.alertType === "out"
                    ? "bg-red-50/80 hover:bg-red-50"
                    : "bg-orange-50/50 hover:bg-orange-50";
                return (
                  <tr key={p._id} className={`border-t border-slate-100 ${rowClass}`}>
                    <td className={`${tdClass} font-medium text-slate-900`}>{p.name}</td>
                    <td className={tdClass}>{p.sku}</td>
                    <td className={tdClass}>{p.stockQuantity}</td>
                    <td className={tdClass}>{p.minStockLevel}</td>
                    <td className={tdClass}>{p.shelfNameSnapshot || p.shelf?.shelfName || "—"}</td>
                    <td className={tdClass}>{p.supplier?.name || "—"}</td>
                    <td className={tdClass}>
                      <StockBadge stock={p.stockQuantity} minStock={p.minStockLevel} />
                    </td>
                    <td className={tdClass}>
                      <div className="flex gap-2">
                        <Link to={`/products/${p._id}`} className="inline-flex items-center gap-1 text-sm text-blue-600">
                          <Eye size={14} /> View
                        </Link>
                        <Link to="/purchase-orders" className="inline-flex items-center gap-1 text-sm text-slate-600">
                          <ShoppingCart size={14} /> PO
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LowStock;
