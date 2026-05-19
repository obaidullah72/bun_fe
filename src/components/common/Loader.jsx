function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="h-11 w-11 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600" />
      <p className="mt-4 text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
}

export default Loader;
