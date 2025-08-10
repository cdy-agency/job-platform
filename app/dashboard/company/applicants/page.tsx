"use client";

import React, { useState } from "react";

type Applicant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedJob: string;
  status: "Pending" | "Approved" | "Interview" | "Hired";
  appliedAt: string;
};

const mockApplicants: Applicant[] = [
  {
    id: "a1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+250 788 111 222",
    appliedJob: "Frontend Developer",
    status: "Pending",
    appliedAt: "2025-08-01T09:00:00Z",
  },
  {
    id: "a2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+250 788 333 444",
    appliedJob: "Backend Engineer",
    status: "Approved",
    appliedAt: "2025-07-28T14:20:00Z",
  },
  {
    id: "a3",
    name: "Clara Doe",
    email: "clara@example.com",
    phone: "+250 788 555 666",
    appliedJob: "Frontend Developer",
    status: "Interview",
    appliedAt: "2025-07-30T16:10:00Z",
  },
];

export default function ManageApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);

  const updateStatus = (id: string, newStatus: Applicant["status"]) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Manage Applicants</h1>

        {applicants.length === 0 ? (
          <p className="text-gray-500 text-center">No applicants found.</p>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-md font-semibold text-gray-900">{app.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Applied for: <span className="font-medium">{app.appliedJob}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Email: {app.email} | Phone: {app.phone}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-center gap-2">
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      app.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "Approved"
                        ? "bg-blue-100 text-blue-800"
                        : app.status === "Interview"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {app.status}
                  </span>

                  {/* Status buttons */}
                  <div className="flex gap-2 flex-wrap justify-center">
                    {app.status !== "Approved" && (
                      <button
                        onClick={() => updateStatus(app.id, "Approved")}
                        className="text-xs px-2 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        Approve
                      </button>
                    )}

                    {app.status !== "Interview" && (
                      <button
                        onClick={() => updateStatus(app.id, "Interview")}
                        className="text-xs px-2 py-1 rounded border border-purple-300 text-purple-700 hover:bg-purple-100"
                      >
                        Call Interview
                      </button>
                    )}

                    {app.status !== "Hired" && (
                      <button
                        onClick={() => updateStatus(app.id, "Hired")}
                        className="text-xs px-2 py-1 rounded border border-green-300 text-green-700 hover:bg-green-100"
                      >
                        Mark Hired
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
