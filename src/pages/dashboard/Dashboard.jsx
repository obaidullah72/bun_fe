import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios.js";
import StatCard from "../../components/common/StatCard.jsx";

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async function () {
      const response = await api.get("/dashboard/stats");
      return response.data.data;
    }
  });

  if (isLoading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Products" value={data?.totalProducts || 0} />
        <StatCard title="Categories" value={data?.totalCategories || 0} />
        <StatCard title="Suppliers" value={data?.totalSuppliers || 0} />
        <StatCard title="Low Stock" value={data?.lowStockProducts || 0} />
        <StatCard title="Out of Stock" value={data?.outOfStockProducts || 0} />
      </div>
    </div>
  );
}

export default Dashboard;