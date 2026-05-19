import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  Warehouse,
  ShoppingCart
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    label: "POS",
    path: "/pos",
    icon: ShoppingCart
  },
  {
    label: "Products",
    path: "/products",
    icon: Package
  },
  {
    label: "Categories",
    path: "/categories",
    icon: Tags
  },
  {
    label: "Suppliers",
    path: "/suppliers",
    icon: Truck
  },
  {
    label: "Shelves",
    path: "/shelves",
    icon: Warehouse
  }
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
      <div className="border-b border-slate-200 p-5">
        <h1 className="text-xl font-bold text-slate-900">Inventory</h1>
        <p className="text-sm text-slate-500">Small Shop System</p>
      </div>

      <nav className="space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;