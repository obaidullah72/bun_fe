import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  FileText,
  Hash,
  Barcode,
  Package,
  DollarSign,
  Layers,
  Tags,
  Truck,
  Warehouse,
  Shield,
  ChevronDown,
  Eye,
  EyeOff,
  Search,
  Calendar,
  AlignLeft
} from "lucide-react";
import { useState } from "react";
import { inputClass, labelClass } from "./uiClasses.js";

const iconMap = {
  name: User,
  email: Mail,
  password: Lock,
  phone: Phone,
  address: MapPin,
  description: AlignLeft,
  notes: FileText,
  sku: Hash,
  barcode: Barcode,
  product: Package,
  price: DollarSign,
  stock: Layers,
  category: Tags,
  supplier: Truck,
  shelf: Warehouse,
  role: Shield,
  search: Search,
  date: Calendar,
  text: FileText,
  quantity: Layers
};

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  icon,
  options = [],
  rows = 3,
  className = ""
}) {
  const [showPassword, setShowPassword] = useState(false);
  const Icon =
    typeof icon === "function"
      ? icon
      : iconMap[icon] || iconMap[name] || iconMap[type] || FileText;
  const isPassword = type === "password" || name === "password" || name === "newPassword";
  const isTextarea = type === "textarea";
  const isSelect = type === "select";
  const inputType = isPassword && showPassword ? "text" : type;

  const fieldPadding = "pl-10 pr-10";

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className={labelClass}>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon size={17} strokeWidth={2} />
        </span>

        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`${inputClass} ${fieldPadding} resize-none py-3`}
          />
        ) : isSelect ? (
          <>
            <select
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              className={`${inputClass} ${fieldPadding} appearance-none`}
            >
              {options.map(function (opt) {
                if (typeof opt === "string") {
                  return <option key={opt} value={opt}>{opt}</option>;
                }
                return <option key={opt.value} value={opt.value}>{opt.label}</option>;
              })}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <ChevronDown size={17} />
            </span>
          </>
        ) : (
          <input
            id={name}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`${inputClass} ${fieldPadding} ${isPassword ? "" : "pr-4"}`}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={function () { setShowPassword(function (v) { return !v; }); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default FormField;
