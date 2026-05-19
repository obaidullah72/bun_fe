import { X } from "lucide-react";
import { cardClass } from "../ui/uiClasses.js";

function Modal({ open, title, children, onClose, size = "md" }) {
  if (!open) return null;

  const sizes = {
    md: "max-w-lg",
    lg: "max-w-2xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className={`w-full ${sizes[size]} ${cardClass} p-6 shadow-xl`}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
