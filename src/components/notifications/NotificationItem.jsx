import { useNavigate } from "react-router-dom";
import { markNotificationReadApi } from "../../api/notification.api.js";

const typeStyles = {
  danger: "border-l-red-500 bg-red-50/80",
  warning: "border-l-orange-500 bg-orange-50/80",
  success: "border-l-emerald-500 bg-emerald-50/80",
  info: "border-l-blue-500 bg-blue-50/80"
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(date).toLocaleDateString();
}

function NotificationItem({ notification, onRead }) {
  const navigate = useNavigate();
  const unread = !notification.isReadForUser;
  const style = typeStyles[notification.type] || typeStyles.info;

  async function handleClick() {
    if (unread) {
      try {
        await markNotificationReadApi(notification._id);
        onRead?.();
      } catch {
        /* ignore */
      }
    }
    if (notification.actionUrl) navigate(notification.actionUrl);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full border-l-4 px-4 py-3 text-left transition hover:bg-slate-50 ${style} ${unread ? "ring-1 ring-inset ring-blue-100" : "opacity-80"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{notification.title}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{notification.message}</p>
          <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
            {notification.module} · {notification.priority}
          </p>
        </div>
        <span className="shrink-0 text-[10px] text-slate-400">{timeAgo(notification.createdAt)}</span>
      </div>
    </button>
  );
}

export default NotificationItem;
