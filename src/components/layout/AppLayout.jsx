import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar />

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;