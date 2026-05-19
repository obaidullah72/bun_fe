import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Users as UsersIcon, Mail, Shield, Eye } from "lucide-react";
import { getUsersApi } from "../../api/user.api.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Loader from "../../components/common/Loader.jsx";
import { tableWrapClass, thClass, tdClass } from "../../components/ui/uiClasses.js";

function Users() {
  const { data, isLoading } = useQuery({ queryKey: ["users"], queryFn: getUsersApi });
  const users = data?.data?.data || [];
  if (isLoading) return <Loader />;
  return (
    <div>
      <PageHeader title="User Management" subtitle="Manage system users and roles" />
      <div className={tableWrapClass}>
        <table className="w-full">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr><th className={thClass}>Name</th><th className={thClass}>Email</th><th className={thClass}>Role</th><th className={thClass}>Status</th><th className={thClass}>Action</th></tr>
          </thead>
          <tbody>{users.map(function (u) {
            return (
              <tr key={u._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                <td className={`${tdClass} font-medium text-slate-900`}><span className="flex items-center gap-2"><UsersIcon size={15} className="text-slate-400" />{u.name}</span></td>
                <td className={tdClass}><span className="flex items-center gap-2"><Mail size={15} className="text-slate-400" />{u.email}</span></td>
                <td className={tdClass}><span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"><Shield size={12} />{u.role}</span></td>
                <td className={tdClass}><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{u.isActive ? "Active" : "Inactive"}</span></td>
                <td className={tdClass}>
                  <Link to={`/users/${u._id}`} className="inline-flex items-center gap-1 text-sm text-blue-600"><Eye size={14} /> View</Link>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}
export default Users;
