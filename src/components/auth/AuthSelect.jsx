import { Shield, ChevronDown } from "lucide-react";

const selectClass =
  "w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-11 text-[15px] text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

function AuthSelect({ name, value, onChange, children }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
        <Shield size={18} strokeWidth={2} />
      </span>

      <select name={name} value={value} onChange={onChange} className={selectClass}>
        {children}
      </select>

      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
        <ChevronDown size={18} strokeWidth={2} />
      </span>
    </div>
  );
}

export default AuthSelect;
