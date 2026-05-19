import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Package, Tags, Truck, Warehouse, ShoppingCart,
  ClipboardList, BarChart3, Users, ScanLine, AlertTriangle, Activity,
  ArrowLeftRight, Boxes
} from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";
import { hasRole } from "../../utils/roles.js";

const allLinks = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Manager", "Staff", "Cashier"] },
  { label: "POS", path: "/pos", icon: ShoppingCart, roles: ["Admin", "Manager", "Cashier"] },
  { label: "Products", path: "/products", icon: Package, roles: ["Admin", "Manager", "Staff", "Cashier"] },
  { label: "Scanner", path: "/scanner", icon: ScanLine, roles: ["Admin", "Manager", "Staff", "Cashier"] },
  { label: "Categories", path: "/categories", icon: Tags, roles: ["Admin", "Manager", "Staff"] },
  { label: "Suppliers", path: "/suppliers", icon: Truck, roles: ["Admin", "Manager", "Staff"] },
  { label: "Shelves", path: "/shelves", icon: Warehouse, roles: ["Admin", "Manager", "Staff"] },
  { label: "Purchase Orders", path: "/purchase-orders", icon: ClipboardList, roles: ["Admin", "Manager"] },
  { label: "Sales Orders", path: "/sales-orders", icon: ClipboardList, roles: ["Admin", "Manager", "Cashier"] },
  { label: "Stock Tracking", path: "/stock", icon: Boxes, roles: ["Admin", "Manager", "Staff"] },
  { label: "Adjustments", path: "/adjustments", icon: ArrowLeftRight, roles: ["Admin", "Manager", "Staff"] },
  { label: "Low Stock", path: "/low-stock", icon: AlertTriangle, roles: ["Admin", "Manager", "Staff"] },
  { label: "Reports", path: "/reports", icon: BarChart3, roles: ["Admin", "Manager"] },
  { label: "Activity Logs", path: "/activity-logs", icon: Activity, roles: ["Admin", "Manager"] },
  { label: "Users", path: "/users", icon: Users, roles: ["Admin"] }
];

function Sidebar() {
  const user = useAuthStore(function (s) { return s.user; });
  const links = allLinks.filter(function (link) { return hasRole(user, link.roles); });

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Package size={20} />
          </span>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Inventory</h1>
            <p className="text-xs text-slate-500">Management System</p>
          </div>
        </div>
      </div>
      <nav className="space-y-0.5 overflow-y-auto p-3" style={{ maxHeight: "calc(100vh - 88px)" }}>
        {links.map(function (link) {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={function ({ isActive }) {
                return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`;
              }}
            >
              <Icon size={18} strokeWidth={2} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
