import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

const fieldConfig = {
  name: { icon: User, placeholder: "Name", type: "text", autoComplete: "name" },
  email: { icon: Mail, placeholder: "Email", type: "email", autoComplete: "email" },
  password: { icon: Lock, placeholder: "Password", type: "password", autoComplete: "current-password" },
  newPassword: { icon: Lock, placeholder: "New password", type: "password", autoComplete: "new-password" }
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

function AuthField({
  field = "text",
  name,
  value,
  onChange,
  required = false,
  autoComplete
}) {
  const [showPassword, setShowPassword] = useState(false);
  const config = fieldConfig[field] || fieldConfig.name;
  const PrefixIcon = config.icon;
  const isPassword = field === "password" || field === "newPassword";
  const inputType = isPassword && showPassword ? "text" : config.type;

  const paddingLeft = "pl-11";
  const paddingRight = isPassword ? "pr-11" : "pr-4";

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
        <PrefixIcon size={18} strokeWidth={2} />
      </span>

      <input
        name={name}
        type={inputType}
        placeholder={config.placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete || config.autoComplete}
        className={`${inputClass} ${paddingLeft} ${paddingRight}`}
      />

      {isPassword && (
        <button
          type="button"
          onClick={function () { setShowPassword(function (v) { return !v; }); }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none focus:text-blue-600"
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
        </button>
      )}
    </div>
  );
}

export default AuthField;
