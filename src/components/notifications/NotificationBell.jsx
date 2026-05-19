import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { getUnreadNotificationsCountApi } from "../../api/notification.api.js";
import { getAlertSummaryApi } from "../../api/alert.api.js";
import NotificationDropdown from "./NotificationDropdown.jsx";
import AlertBadge from "./AlertBadge.jsx";
import { btnIcon } from "../ui/uiClasses.js";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const { data: countData } = useQuery({
    queryKey: ["notification-count"],
    queryFn: getUnreadNotificationsCountApi,
    refetchInterval: 30000
  });

  const { data: alertData } = useQuery({
    queryKey: ["alert-summary"],
    queryFn: getAlertSummaryApi,
    refetchInterval: 30000
  });

  const unreadCount = countData?.data?.data?.unreadCount || 0;
  const criticalCount =
    countData?.data?.data?.criticalCount || alertData?.data?.data?.criticalCount || 0;

  useEffect(function () {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return function () { document.removeEventListener("mousedown", handleClick); };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={`${btnIcon} relative`}
        aria-label="Notifications"
        onClick={function () { setOpen(function (v) { return !v; }); }}
      >
        <Bell size={18} />
        <AlertBadge count={unreadCount} variant={criticalCount > 0 ? "critical" : "default"} />
        {criticalCount > 0 && (
          <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>
      {open && <NotificationDropdown onClose={function () { setOpen(false); }} />}
    </div>
  );
}

export default NotificationBell;
