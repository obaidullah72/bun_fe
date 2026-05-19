import { Inbox } from "lucide-react";

function EmptyState({ title = "No data found", description = "", icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
      <span className="rounded-full bg-slate-100 p-4 text-slate-400">
        <Icon size={28} strokeWidth={1.5} />
      </span>
      <p className="mt-4 text-lg font-semibold text-slate-800">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>}
    </div>
  );
}

export default EmptyState;
