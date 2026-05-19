import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BellOff, CheckCheck } from "lucide-react";
import {
  getNotificationsApi,
  markAllNotificationsReadApi
} from "../../api/notification.api.js";
import NotificationItem from "./NotificationItem.jsx";
import { btnSecondary } from "../ui/uiClasses.js";

function NotificationDropdown({ onClose }) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", filter],
    queryFn: function () {
      const params = { limit: 20 };
      if (filter === "unread") params.unread = "true";
      if (filter === "critical") params.priority = "critical";
      return getNotificationsApi(params);
    }
  });

  const notifications = data?.data?.data || [];
  const filtered =
    filter === "critical"
      ? notifications.filter(function (n) { return n.priority === "critical"; })
      : notifications;

  async function handleMarkAll() {
    await markAllNotificationsReadApi();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notification-count"] });
  }

  function handleRead() {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notification-count"] });
  }

  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "critical", label: "Critical" }
  ];

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,24rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="font-semibold text-slate-900">Notifications</h3>
        <button
          type="button"
          onClick={handleMarkAll}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          <CheckCheck size={14} /> Mark all read
        </button>
      </div>
      <div className="flex gap-1 border-b border-slate-100 px-2 py-2">
        {tabs.map(function (t) {
          return (
            <button
              key={t.id}
              type="button"
              onClick={function () { setFilter(t.id); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                filter === t.id ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <p className="p-6 text-center text-sm text-slate-500">Loading...</p>
        ) : !filtered.length ? (
          <div className="flex flex-col items-center gap-2 p-8 text-slate-400">
            <BellOff size={28} />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          filtered.map(function (n) {
            return <NotificationItem key={n._id} notification={n} onRead={handleRead} />;
          })
        )}
      </div>
      <div className="border-t border-slate-100 p-2">
        <button type="button" className={`${btnSecondary} w-full text-sm`} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default NotificationDropdown;
