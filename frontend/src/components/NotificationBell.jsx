import { useEffect, useRef, useState } from "react";
import axios from "axios";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef(null);
  const token = localStorage.getItem("token");

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const markAsRead = async (notificationId) => {
    if (!token) return;

    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Unable to mark notification as read:",
        error.response?.data?.message || error.message
      );
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;

    try {
      await axios.put(
        "http://localhost:5000/api/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (error) {
      console.error(
        "Unable to mark all notifications as read:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      void markAsRead(notification.id);
    }
  };

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const notificationData =
          response.data.notifications || response.data || [];

        if (isMounted) {
          setNotifications(
            Array.isArray(notificationData) ? notificationData : []
          );
        }
      } catch (error) {
        console.error(
          "Unable to load notifications:",
          error.response?.data?.message || error.message
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const initialFetchId = window.setTimeout(() => {
      void fetchNotifications();
    }, 0);

    const intervalId = window.setInterval(() => {
      void fetchNotifications();
    }, 30000);

    return () => {
      isMounted = false;
      window.clearTimeout(initialFetchId);
      window.clearInterval(intervalId);
    };
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200"
        aria-label="Open notifications"
        aria-expanded={isOpen}
      >
        <span className="text-xl">🔔</span>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="font-semibold text-slate-800">
                Notifications
              </h2>

              <p className="text-xs text-slate-500">
                {unreadCount} unread notification
                {unreadCount === 1 ? "" : "s"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllAsRead()}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-sm text-slate-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mb-2 text-3xl">🔕</div>

                <p className="font-medium text-slate-700">
                  No notifications
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  New account activity will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                  className={`w-full border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                    notification.is_read
                      ? "bg-white"
                      : "bg-emerald-50"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">
                      <span
                        className={`block h-2.5 w-2.5 rounded-full ${
                          notification.is_read
                            ? "bg-slate-300"
                            : "bg-emerald-500"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {notification.title ||
                          "PrimeHarvest notification"}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {notification.message}
                      </p>

                      {notification.created_at && (
                        <p className="mt-2 text-xs text-slate-400">
                          {new Date(
                            notification.created_at
                          ).toLocaleString()}
                        </p>
                      )}
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
}

export default NotificationBell;