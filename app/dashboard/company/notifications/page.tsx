"use client";

import React, { useMemo, useState } from "react";
import { Bell, UserPlus } from "lucide-react";

interface Notification {
  id: number;
  applicantName: string;
  position: string;
  date: string;
  read: boolean;
}

export default function CompanyApplicantNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      applicantName: "Sarah Johnson",
      position: "Frontend Developer",
      date: "2025-08-08",
      read: false,
    },
    {
      id: 2,
      applicantName: "Michael Smith",
      position: "UI/UX Designer",
      date: "2025-08-07",
      read: true,
    },
    {
      id: 3,
      applicantName: "Emily Rodriguez",
      position: "Backend Engineer",
      date: "2025-08-06",
      read: false,
    },
  ]);

  const unread = useMemo(() => notifications.filter(n => !n.read).length, [notifications])

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="w-6 h-6 text-[#834de3]" />
          <h1 className="text-lg font-semibold ml-2 text-gray-900">Notifications</h1>
        </div>
        <span className="rounded-full bg-[#f5f0ff] px-3 py-1 text-xs font-medium text-[#834de3]">{unread} unread</span>
      </div>

      <div className="space-y-3 max-w-2xl">
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => (!n.read ? markAsRead(n.id) : undefined)}
            className={`flex w-full items-start p-3 rounded-lg border transition-all text-left ${
              n.read
                ? "bg-white border-gray-200"
                : "bg-[#fbf8ff] border-[#eadbff]"
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#834de3] to-[#9260e7] text-white flex-shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>

            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h2
                  className={`text-sm font-medium ${
                    n.read ? "text-gray-900" : "text-gray-800"
                  }`}
                >
                  New Application from {n.applicantName}
                </h2>
                <span
                  className={`text-xs ${
                    n.read ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  {new Date(n.date).toLocaleDateString()}
                </span>
              </div>
              <p
                className={`mt-0.5 text-xs ${
                  n.read ? "text-gray-600" : "text-gray-700"
                }`}
              >
                Applied for: {n.position}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
