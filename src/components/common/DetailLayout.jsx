import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Loader from "./Loader.jsx";
import { cardClass } from "../ui/uiClasses.js";

function DetailLayout({ backTo, backLabel, title, subtitle, badge, actions, loading, error, children }) {
  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      <Link to={backTo} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
        <ArrowLeft size={16} /> {backLabel}
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}

export function DetailCard({ title, children, className = "" }) {
  return (
    <div className={`${cardClass} p-6 ${className}`}>
      {title && <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>}
      {children}
    </div>
  );
}

export function InfoGrid({ items }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(function (item) {
        return (
          <div key={item.label} className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{item.value ?? "—"}</p>
          </div>
        );
      })}
    </div>
  );
}

export default DetailLayout;
