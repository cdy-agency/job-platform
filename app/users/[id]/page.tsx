"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { fetchUserById } from "@/lib/api";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import NavBar from "@/components/home/NavBar";

export default function UserProfile() {
  const params = useParams();
  const id = params?.id as string;
  const { token } = useAuth();
  const [user, setUser] = useState<any | null>(null);

  React.useEffect(() => {
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }
    fetchUserById(id)
      .then((u) => setUser(u || null))
      .catch(() => setUser(null));
  }, [id, token]);

  if (!user) return notFound();

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      <p className="text-gray-600 mb-12">
        Worker Information & Contact Details
      </p>

      {/* Main Layout */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* About Me */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            About me
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Dedicated and motivated worker with a proven track record of
            delivering high-quality work. Skilled in communication, teamwork,
            and adapting to fast-paced environments.
          </p>
        </div>

        {/* Center Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={user.profileImage || user.avatar || "/placeholder.svg"}
            alt={user.name}
            className="w-40 h-40 rounded-full border-4 border-transparent shadow-lg bg-gradient-to-r from-[#834de3] to-[#9260e7] p-1 object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>
              <strong>Name:</strong> {user.name}
            </li>
            <li>
              <strong>Email:</strong> {user.email}
            </li>
            <li>
              <strong>Phone:</strong> {user.phone || user.phoneNumber}
            </li>
            <li>
              <strong>Location:</strong> {user.location || user.address}
            </li>
            <li>
              <strong>Joined:</strong>{" "}
              {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </li>
            <li>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.status === "inactive"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {user.status === "inactive" ? "inactive" : "active"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
}
