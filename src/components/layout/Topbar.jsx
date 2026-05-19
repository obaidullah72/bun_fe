import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";

function Topbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Inventory Management
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.role}</p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Topbar;