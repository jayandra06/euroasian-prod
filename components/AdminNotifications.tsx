"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FaBell } from "react-icons/fa";

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminNotifications() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchNotifications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_role")
        .eq("id", user.id)
        .single();

      if (profile?.user_role === "admin") {
        setIsAdmin(true);

        const { data: notifs } = await supabase
          .from("notifications")
          .select("*")
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        setNotifications(notifs || []);

        // Realtime listener for new notifications
        const channel = supabase
          .channel("notifications-channel")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
              filter: `profile_id=eq.${user.id}`,
            },
            (payload) => {
              const newNotification = payload.new as Notification;
              setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    };

    fetchNotifications();
  }, []);

  const handleClickNotification = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  if (!isAdmin) return null;

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setShowDropdown(!showDropdown)}>
        <div className="relative">
          <FaBell className="w-6 h-6 text-gray-700" />
          {notifications.some((n) => !n.is_read) && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 min-w-[300px] bg-white border border-gray-200 rounded-lg shadow-md z-50">
          <div className="p-2 font-semibold border-b">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No notifications</div>
          ) : (
            <ul className="max-h-64 overflow-auto">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  onClick={() => handleClickNotification(notif.id)}
                  className={`cursor-pointer px-4 py-2 border-b rounded-md mb-1 hover:bg-gray-100 ${
                    !notif.is_read ? "bg-blue-100 border-l-4 border-blue-500" : ""
                  }`}
                >
                  <p className="font-medium flex items-center gap-2">
                    {notif.title}
                    {!notif.is_read && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">{notif.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
