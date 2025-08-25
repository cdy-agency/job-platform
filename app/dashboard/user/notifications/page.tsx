"use client";

import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, Trash2 } from "lucide-react";
import { fetchEmployeeNotifications, markEmployeeNotificationRead, deleteEmployeeNotification } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface EmployeeNotification {
  id: string;
  message: string;
  read: boolean;
  createdAt?: string;
}

export default function EmployeeNotificationsPage() {
  const [notifications, setNotifications] = useState<EmployeeNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchEmployeeNotifications();
        if (res?.message?.toLowerCase?.().includes("access denied")) {
          setError("Access denied. Log in as an employee.");
          setNotifications([]);
          return;
        }
        const raw = Array.isArray(res?.notifications) ? res.notifications : Array.isArray(res) ? res : [];
        const normalized: EmployeeNotification[] = raw.map((n: any, idx: number) => ({
          // Generate unique ID if _id is not available
          id: String(n._id || n.id || n.notificationId || `notification-${Date.now()}-${idx}`),
          message: String(n.message || n.title || ""),
          read: Boolean(n.read),
          createdAt: n.createdAt || n.date || undefined,
        }));
        setNotifications(normalized);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await markEmployeeNotificationRead(id);
    } catch (e: any) {
      toast({ title: "Unable to mark as read", description: e?.response?.data?.message || "Permission issue", variant: "destructive" })
    }
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteEmployeeNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast({ title: "Notification deleted", description: "Notification has been removed" });
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast({ title: "Failed to delete", description: "Unable to delete notification", variant: "destructive" });
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-6 w-6 text-[#834de3]" />
          <h1 className="ml-2 text-lg font-semibold text-gray-900">Notifications</h1>
        </div>
        <span className="rounded-full bg-[#f5f0ff] px-3 py-1 text-xs font-medium text-[#834de3]">
          {unreadCount} unread
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="mx-auto max-w-2xl space-y-3">
        {notifications.length === 0 && !error && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
            No notifications yet.
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex w-full items-start rounded-lg border p-3 transition-all ${
              n.read ? "bg-white border-gray-200" : "bg-[#fbf8ff] border-[#eadbff]"
            }`}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#834de3] to-[#9260e7] text-white">
              <Bell className="h-5 w-5" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => (!n.read ? markAsRead(n.id) : undefined)}
                  className={`text-left flex-1 ${n.read ? "text-gray-900" : "text-gray-800"}`}
                >
                  <p className="text-sm font-medium">{n.message}</p>
                  <span className={`text-xs ${n.read ? "text-gray-500" : "text-gray-600"}`}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                  </span>
                </button>
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {!n.read && (
                <span className="mt-2 inline-flex items-center rounded-full bg-gradient-to-r from-[#834de3] to-[#9260e7] px-2 py-0.5 text-xs font-medium text-white">
                  <CheckCircle className="mr-1 h-3 w-3" /> Marked read on open
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
