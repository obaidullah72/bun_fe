import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsApi } from "../../api/dashboard.api.js";
import StatCard from "../../components/common/StatCard.jsx";
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
      <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Products" value={data?.totalProducts || 0} />
        <StatCard title="Categories" value={data?.totalCategories || 0} />
        <StatCard title="Suppliers" value={data?.totalSuppliers || 0} />
        <StatCard title="Low Stock" value={data?.lowStock || 0} />
        <StatCard title="Out of Stock" value={data?.outOfStock || 0} />
        <StatCard title="Today's Sales" value={data?.todaySalesCount || 0} />
        <StatCard title="Today's Revenue" value={data?.todayRevenue || 0} />
        <StatCard title="Total Sales" value={data?.totalSales || 0} />
      </div>
    </div>
  );
}

export default Dashboard;
