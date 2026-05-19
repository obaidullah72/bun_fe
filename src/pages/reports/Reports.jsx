import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Package, ShoppingCart, AlertTriangle, Calendar, FileDown, Truck, Warehouse } from "lucide-react";
import {
  getInventoryReportApi,
  getSalesReportApi,
  getPurchasesReportApi,
  getLowStockReportApi,
  getShelfStockReportApi,
  getPosDailyReportApi,
  downloadInventoryPdfApi,
  downloadSalesPdfApi,
  downloadPurchasePdfApi,
  downloadLowStockPdfApi,
  downloadShelfStockPdfApi,
  downloadDailyPosPdfApi
} from "../../api/report.api.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Loader from "../../components/common/Loader.jsx";
import Button from "../../components/ui/Button.jsx";
import { cardClass, tableWrapClass, thClass, tdClass } from "../../components/ui/uiClasses.js";
import toast from "react-hot-toast";

const tabs = [
  { id: "inventory", label: "Inventory", icon: Package, fn: getInventoryReportApi, pdf: downloadInventoryPdfApi },
  { id: "sales", label: "Sales", icon: ShoppingCart, fn: getSalesReportApi, pdf: downloadSalesPdfApi },
  { id: "purchases", label: "Purchases", icon: Truck, fn: getPurchasesReportApi, pdf: downloadPurchasePdfApi },
  { id: "low-stock", label: "Low Stock", icon: AlertTriangle, fn: getLowStockReportApi, pdf: downloadLowStockPdfApi },
  { id: "shelf-stock", label: "Shelf Stock", icon: Warehouse, fn: getShelfStockReportApi, pdf: downloadShelfStockPdfApi },
  { id: "pos-daily", label: "Daily POS", icon: Calendar, fn: getPosDailyReportApi, pdf: downloadDailyPosPdfApi }
];

function Reports() {
  const [tab, setTab] = useState("inventory");
  const [pdfLoading, setPdfLoading] = useState(false);
  const current = tabs.find(function (t) { return t.id === tab; });
  const { data, isLoading } = useQuery({ queryKey: ["report", tab], queryFn: current.fn });

  const payload = data?.data?.data;
  const rows = Array.isArray(payload) ? payload : payload?.sales || [];

  async function handlePdf() {
    if (!current?.pdf) return;
    setPdfLoading(true);
    try {
      await current.pdf();
      toast.success("PDF downloaded");
    } catch {
      toast.error("PDF export failed");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Inventory, sales, and stock analytics"
        action={
          <Button type="button" icon={FileDown} onClick={handlePdf} disabled={pdfLoading}>
            {pdfLoading ? "Generating PDF..." : "Export PDF"}
          </Button>
        }
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map(function (t) {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={function () { setTab(t.id); }}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                active ? "bg-blue-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className={`${cardClass} overflow-auto`}>
          {tab === "pos-daily" && payload?.summary && (
            <div className="border-b border-slate-100 p-4 text-sm">
              <p>Date: {payload.summary.date}</p>
              <p>Sales: {payload.summary.count} · Revenue: {payload.summary.revenue}</p>
            </div>
          )}
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {rows[0] &&
                  Object.keys(rows[0])
                    .filter(function (k) { return k !== "_id" && typeof rows[0][k] !== "object"; })
                    .slice(0, 6)
                    .map(function (k) {
                      return <th key={k} className={thClass}>{k}</th>;
                    })}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map(function (row, i) {
                return (
                  <tr key={row._id || i} className="border-t border-slate-100">
                    {Object.keys(row)
                      .filter(function (k) { return k !== "_id" && typeof row[k] !== "object"; })
                      .slice(0, 6)
                      .map(function (k) {
                        return <td key={k} className={tdClass}>{String(row[k])}</td>;
                      })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!rows.length && (
            <p className="p-8 text-center text-sm text-slate-500">
              <BarChart3 className="mx-auto mb-2" size={24} />
              No data for this report
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Reports;
