import { useNavigate, Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import NotificationBell from "../notifications/NotificationBell.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { btnIcon } from "../ui/uiClasses.js";

function Topbar() {
  const navigate = useNavigate();
  const user = useAuthStore(function (s) { return s.user; });
  const logout = useAuthStore(function (s) { return s.logout; });

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md lg:px-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Welcome back</p>
        <h2 className="text-base font-semibold text-slate-900">{user?.name || "User"}</h2>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:bg-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <User size={16} />
          </span>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
        </Link>
        <button type="button" onClick={handleLogout} className={btnIcon} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
