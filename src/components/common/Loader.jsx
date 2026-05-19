function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}

export default Loader;
