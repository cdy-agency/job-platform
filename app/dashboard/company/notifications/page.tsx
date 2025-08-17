"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { fetchCompanyNotifications, markCompanyNotificationRead } from "@/lib/api";

interface CompanyNotification {
  id: string;
  message: string;
  read: boolean;
  createdAt?: string;
}

export default function CompanyNotificationsPage() {
  const [notifications, setNotifications] = useState<CompanyNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchCompanyNotifications();
        if (res?.message?.toLowerCase?.().includes("access denied")) {
          setError("Access denied. Log in as a company user.");
          setNotifications([]);
          return;
        }
        const list = Array.isArray(res?.notifications) ? res.notifications : Array.isArray(res) ? res : [];
        const normalized: CompanyNotification[] = list.map((n: any) => ({
          id: String(n._id || n.id),
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

  const unread = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const markAsRead = async (id: string) => {
    try {
      await markCompanyNotificationRead(id);
    } catch {}
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="w-6 h-6 text-[#834de3]" />
          <h1 className="text-lg font-semibold ml-2 text-gray-900">Notifications</h1>
        </div>
        <span className="rounded-full bg-[#f5f0ff] px-3 py-1 text-xs font-medium text-[#834de3]">{unread} unread</span>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="space-y-3 max-w-2xl">
        {notifications.length === 0 && !error && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
            No notifications.
          </div>
        )}

        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => (!n.read ? markAsRead(n.id) : undefined)}
            className={`flex w-full items-start rounded-lg border p-3 text-left transition-all ${
              n.read ? "bg-white border-gray-200" : "bg-[#fbf8ff] border-[#eadbff]"
            }`}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#834de3] to-[#9260e7] text-white">
              <Bell className="h-5 w-5" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${n.read ? "text-gray-900" : "text-gray-800"}`}>{n.message}</p>
                <span className={`text-xs ${n.read ? "text-gray-500" : "text-gray-600"}`}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
