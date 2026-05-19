import { Search } from "lucide-react";
import { inputClass } from "../ui/uiClasses.js";

function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputClass} pl-10`}
      />
    </div>
  );
}

export default SearchInput;
