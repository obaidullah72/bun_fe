import { useQuery } from "@tanstack/react-query";
import { getUsersApi } from "../../api/user.api.js";
import Loader from "../../components/common/Loader.jsx";

function Users() {
  const { data, isLoading } = useQuery({ queryKey: ["users"], queryFn: getUsersApi });
  const users = data?.data?.data || [];
  if (isLoading) return <Loader />;
  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">User Management</h1>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
        <table className="w-full text-sm"><thead className="bg-slate-50 dark:bg-slate-800"><tr><th className="p-4 text-left">Name</th><th className="p-4 text-left">Email</th><th className="p-4 text-left">Role</th><th className="p-4 text-left">Status</th></tr></thead>
        <tbody>{users.map(function (u) {
          return <tr key={u._id} className="border-t dark:border-slate-800"><td className="p-4">{u.name}</td><td className="p-4">{u.email}</td><td className="p-4">{u.role}</td><td className="p-4">{u.isActive ? "Active" : "Inactive"}</td></tr>;
        })}</tbody></table>
      </div>
    </div>
  );
}
export default Users;
