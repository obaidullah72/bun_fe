function EmptyState({ title = "No data found", description = "" }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</p>
      {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
    </div>
  );
}

export default EmptyState;
