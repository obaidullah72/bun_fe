import { useQuery } from "@tanstack/react-query";
import {
  Package, Tags, Truck, AlertTriangle, PackageX, ShoppingCart, DollarSign, ClipboardList
} from "lucide-react";
import { getDashboardStatsApi } from "../../api/dashboard.api.js";
import StatCard from "../../components/common/StatCard.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Loader from "../../components/common/Loader.jsx";

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
    </div>
  );
}

export default Dashboard;
