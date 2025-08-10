"use client";

import React, { useState } from "react";
import { Bell, UserPlus, CheckCircle } from "lucide-react";

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

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Bell className="w-6 h-6 text-[#834de3]" />
        <h1 className="text-lg font-semibold ml-2 text-gray-900">
          Applicant Notifications
        </h1>
      </div>

      {/* List */}
      <div className="space-y-3 max-w-2xl">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start p-3 rounded-lg shadow-sm border transition-all ${
              n.read
                ? "bg-white border-gray-200"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#834de3] to-[#9260e7] text-white flex-shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>

            {/* Content */}
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

              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="mt-2 flex items-center text-xs font-medium bg-gradient-to-r from-[#834de3] to-[#9260e7] text-white px-2 py-0.5 rounded-full shadow-sm hover:opacity-90"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
