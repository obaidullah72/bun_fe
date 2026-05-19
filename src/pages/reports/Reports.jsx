import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInventoryReportApi, getSalesReportApi, getLowStockReportApi, getPosDailyReportApi } from "../../api/report.api.js";
import Loader from "../../components/common/Loader.jsx";

const tabs = [
  { id: "inventory", label: "Inventory", fn: getInventoryReportApi },
  { id: "sales", label: "Sales", fn: getSalesReportApi },
  { id: "low-stock", label: "Low Stock", fn: getLowStockReportApi },
  { id: "pos-daily", label: "Daily POS", fn: getPosDailyReportApi }
];

function Reports() {
  const [tab, setTab] = useState("inventory");
  const current = tabs.find(function (t) { return t.id === tab; });
  const { data, isLoading } = useQuery({ queryKey: ["report", tab], queryFn: current.fn });
  const rows = data?.data?.data || [];

  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">Reports</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map(function (t) {
          return <button key={t.id} type="button" onClick={function () { setTab(t.id); }} className={`rounded-xl px-4 py-2 text-sm ${tab === t.id ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-900"}`}>{t.label}</button>;
        })}
      </div>
      {isLoading ? <Loader /> : (
        <pre className="mt-6 overflow-auto rounded-2xl bg-white p-4 text-xs dark:bg-slate-900">{JSON.stringify(rows, null, 2)}</pre>
      )}
    </div>
  );
}
export default Reports;
