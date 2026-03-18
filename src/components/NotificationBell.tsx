import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "เมื่อกี้";
    if (mins < 60) return `${mins} นาทีที่แล้ว`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ชม.ที่แล้ว`;
    const days = Math.floor(hours / 24);
    return `${days} วันที่แล้ว`;
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-xl hover:bg-white/50 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-[9px] text-white font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold font-thai text-sm">การแจ้งเตือน</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-purple-600 font-thai hover:underline"
              >
                อ่านทั้งหมด
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-72">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <span className="text-3xl">🔔</span>
                <p className="text-sm text-muted-foreground font-thai mt-2">
                  ยังไม่มีการแจ้งเตือน
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read) markAsRead(notif.id);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors",
                    !notif.read && "bg-purple-50/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {!notif.read ? (
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                      ) : (
                        <div className="w-2 h-2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold font-thai truncate">
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-thai mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-gray-400 font-thai mt-1">
                        {timeAgo(notif.created_at)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
