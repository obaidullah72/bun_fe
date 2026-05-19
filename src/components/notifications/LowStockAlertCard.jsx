import { Link } from "react-router-dom";
import { AlertTriangle, PackageX } from "lucide-react";
import { cardClass, btnSecondary } from "../ui/uiClasses.js";

function LowStockAlertCard({ type = "warning", count = 0, title, description }) {
  const isCritical = type === "critical";
  return (
    <div
      className={`${cardClass} p-6 ${
        isCritical ? "border-red-200 bg-red-50/60" : "border-orange-200 bg-orange-50/60"
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`rounded-2xl p-3 ${
            isCritical ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
          }`}
        >
          {isCritical ? <PackageX size={24} /> : <AlertTriangle size={24} />}
        </span>
        <div className="flex-1">
          <p className="text-3xl font-bold text-slate-900">{count}</p>
          <p className="mt-1 font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
          <Link to="/low-stock" className={`${btnSecondary} mt-4 inline-flex`}>
            View alerts
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LowStockAlertCard;
