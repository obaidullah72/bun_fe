import { useNavigate, Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";
import ThemeToggle from "../common/ThemeToggle.jsx";

function Topbar() {
  const navigate = useNavigate();
  const user = useAuthStore(function (s) { return s.user; });
  const logout = useAuthStore(function (s) { return s.logout; });

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 lg:px-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Inventory Management</h2>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link to="/profile" className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
          <User size={16} />
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
        </Link>
        <button type="button" onClick={handleLogout} className="rounded-xl border border-slate-200 p-2 dark:border-slate-700">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
