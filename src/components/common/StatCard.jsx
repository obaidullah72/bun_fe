function StatCard({ title, value, icon: Icon, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    violet: "bg-violet-50 text-violet-600"
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        {Icon && (
          <span className={`rounded-xl p-2.5 ${colors[color] || colors.blue}`}>
            <Icon size={20} strokeWidth={2} />
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
