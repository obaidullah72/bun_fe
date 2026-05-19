import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Package, ShoppingCart, AlertTriangle, Calendar } from "lucide-react";
import {
  getInventoryReportApi, getSalesReportApi, getLowStockReportApi, getPosDailyReportApi
} from "../../api/report.api.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Loader from "../../components/common/Loader.jsx";
import { cardClass } from "../../components/ui/uiClasses.js";

const tabs = [
  { id: "inventory", label: "Inventory", icon: Package, fn: getInventoryReportApi },
  { id: "sales", label: "Sales", icon: ShoppingCart, fn: getSalesReportApi },
  { id: "low-stock", label: "Low Stock", icon: AlertTriangle, fn: getLowStockReportApi },
  { id: "pos-daily", label: "Daily POS", icon: Calendar, fn: getPosDailyReportApi }
];

function Reports() {
  const [tab, setTab] = useState("inventory");
  const current = tabs.find(function (t) { return t.id === tab; });
  const { data, isLoading } = useQuery({ queryKey: ["report", tab], queryFn: current.fn });
  const rows = data?.data?.data || [];

  return (
    <div>
      <PageHeader title="Reports" subtitle="Inventory, sales, and stock analytics" />
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map(function (t) {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} type="button" onClick={function () { setTab(t.id); }}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${active ? "bg-blue-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
              <Icon size={16} />{t.label}
            </button>
          );
        })}
      </div>
      {isLoading ? <Loader /> : (
        <div className={`${cardClass} overflow-auto p-4`}>
          <pre className="text-xs text-slate-700">{JSON.stringify(rows, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
export default Reports;
