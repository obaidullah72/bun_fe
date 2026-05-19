import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserApi, getUserActivityLogsApi } from "../../api/user.api.js";
import DetailLayout, { DetailCard, InfoGrid } from "../../components/common/DetailLayout.jsx";
import Button from "../../components/ui/Button.jsx";

function UserDetails() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ["user", id], queryFn: function () { return getUserApi(id); } });
  const { data: logsData } = useQuery({
    queryKey: ["user-logs", id],
    queryFn: function () { return getUserActivityLogsApi(id); }
  });
  const user = data?.data?.data;
  const logs = logsData?.data?.data || [];

  return (
    <DetailLayout
      backTo="/users"
      backLabel="Back to users"
      title={user?.name}
      subtitle={user?.email}
      loading={isLoading}
      badge={
        user && (
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            {user.role}
          </span>
        )
      }
      actions={
        <Link to={`/users`}>
          <Button type="button" variant="secondary">Edit user</Button>
        </Link>
      }
    >
      <DetailCard title="Profile">
        <InfoGrid
          items={[
            { label: "Phone", value: user?.phone },
            { label: "Role", value: user?.role },
            { label: "Status", value: user?.isActive !== false ? "Active" : "Inactive" },
            { label: "Last login", value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "—" },
            { label: "Joined", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "" }
          ]}
        />
      </DetailCard>
      <DetailCard title="Recent activity">
        <ul className="space-y-2 text-sm">
          {logs.map(function (log) {
            return (
              <li key={log._id} className="rounded-lg border border-slate-100 p-3">
                <Link to={`/activity-logs/${log._id}`} className="font-medium text-blue-600">
                  {log.action} · {log.module}
                </Link>
                <p className="text-slate-500">{log.description}</p>
              </li>
            );
          })}
          {!logs.length && <p className="text-slate-500">No activity logs</p>}
        </ul>
      </DetailCard>
    </DetailLayout>
  );
}

export default UserDetails;
