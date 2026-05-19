import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotificationApi, markNotificationReadApi } from "../../api/notification.api.js";
import DetailLayout, { DetailCard, InfoGrid } from "../../components/common/DetailLayout.jsx";
import Button from "../../components/ui/Button.jsx";
import { useNavigate } from "react-router-dom";

function NotificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notification", id],
    queryFn: function () { return getNotificationApi(id); }
  });
  const n = data?.data?.data;

  async function markRead() {
    await markNotificationReadApi(id);
    queryClient.invalidateQueries({ queryKey: ["notification", id] });
    queryClient.invalidateQueries({ queryKey: ["notification-count"] });
  }

  return (
    <DetailLayout
      backTo="/dashboard"
      backLabel="Back"
      title={n?.title}
      loading={isLoading}
      badge={
        n && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              n.isReadForUser ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-700"
            }`}
          >
            {n.isReadForUser ? "Read" : "Unread"}
          </span>
        )
      }
      actions={
        <>
          {!n?.isReadForUser && <Button type="button" onClick={markRead}>Mark as read</Button>}
          {n?.actionUrl && (
            <Button type="button" variant="secondary" onClick={function () { navigate(n.actionUrl); }}>
              Open related page
            </Button>
          )}
        </>
      }
    >
      <DetailCard>
        <p className="mb-4 text-slate-700">{n?.message}</p>
        <InfoGrid
          items={[
            { label: "Type", value: n?.type },
            { label: "Module", value: n?.module },
            { label: "Priority", value: n?.priority },
            { label: "Created", value: n ? new Date(n.createdAt).toLocaleString() : "" },
            { label: "Created by", value: n?.createdBy?.name }
          ]}
        />
        {n?.metadata && Object.keys(n.metadata).length > 0 && (
          <pre className="mt-4 overflow-auto rounded-xl bg-slate-50 p-4 text-xs">{JSON.stringify(n.metadata, null, 2)}</pre>
        )}
      </DetailCard>
    </DetailLayout>
  );
}

export default NotificationDetails;
