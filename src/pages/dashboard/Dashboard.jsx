import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Package, Tags, Truck, AlertTriangle, PackageX, ShoppingCart, DollarSign, ClipboardList, Bell
} from "lucide-react";
import { getDashboardStatsApi } from "../../api/dashboard.api.js";
import StatCard from "../../components/common/StatCard.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Loader from "../../components/common/Loader.jsx";
import LowStockAlertCard from "../../components/notifications/LowStockAlertCard.jsx";
import NotificationItem from "../../components/notifications/NotificationItem.jsx";
import { cardClass } from "../../components/ui/uiClasses.js";

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async function () {
      const response = await getDashboardStatsApi();
      return response.data.data;
    }
  });

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your shop inventory and sales" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Products" value={data?.totalProducts || 0} icon={Package} color="blue" />
        <StatCard title="Categories" value={data?.totalCategories || 0} icon={Tags} color="violet" />
        <StatCard title="Suppliers" value={data?.totalSuppliers || 0} icon={Truck} color="green" />
        <StatCard title="Low Stock" value={data?.lowStock || 0} icon={AlertTriangle} color="amber" />
        <StatCard title="Out of Stock" value={data?.outOfStock || 0} icon={PackageX} color="red" />
        <StatCard title="Today's Sales" value={data?.todaySalesCount || 0} icon={ShoppingCart} color="blue" />
        <StatCard title="Today's Revenue" value={data?.todayRevenue || 0} icon={DollarSign} color="green" />
        <StatCard title="Total Sales" value={data?.totalSales || 0} icon={ClipboardList} color="violet" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <LowStockAlertCard
          type="critical"
          count={data?.outOfStock || 0}
          title="Out of Stock Products"
          description="Critical items need immediate restocking"
        />
        <LowStockAlertCard
          type="warning"
          count={data?.lowStock || 0}
          title="Low Stock Products"
          description="Products at or below minimum stock level"
        />
      </div>

      <div className={`${cardClass} mt-8 p-6`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <Bell size={18} className="text-blue-600" />
            Recent Notifications
            {data?.unreadNotificationCount > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                {data.unreadNotificationCount} unread
              </span>
            )}
          </h2>
          <Link to="/low-stock" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all alerts
          </Link>
        </div>
        {!data?.recentNotifications?.length ? (
          <p className="text-sm text-slate-500">No recent notifications</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-100">
            {data.recentNotifications.slice(0, 5).map(function (n) {
              return <NotificationItem key={n._id} notification={n} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
