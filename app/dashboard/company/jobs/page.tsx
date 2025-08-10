"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Job = {
  id: string;
  title: string;
  location: string;
  status: "Open" | "Closed";
  postedAt: string;
};

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    location: "Kigali, Rwanda",
    status: "Open",
    postedAt: "2025-07-25T12:00:00Z",
  },
  {
    id: "2",
    title: "Backend Engineer",
    location: "Remote",
    status: "Closed",
    postedAt: "2025-07-10T08:30:00Z",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    location: "Kigali, Rwanda",
    status: "Open",
    postedAt: "2025-08-01T15:45:00Z",
  },
];

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const router = useRouter();

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    setJobs((prev) => prev.filter((job) => job.id !== id));
    alert("Job deleted");
  };

  const handleEdit = (id: string) => {
    // Navigate to your existing post job form with job ID param for editing
    router.push(`/jobs/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Manage Posted Jobs</h1>

        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center">No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4"
            >
              <div className="flex-1">
                <h3 className="text-md font-semibold text-gray-900">{job.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Location: {job.location} | Status:{" "}
                  <span
                    className={`font-medium ${
                      job.status === "Open" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {job.status}
                  </span>{" "}
                  | Posted: {new Date(job.postedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4 sm:mt-0 flex gap-2">
                <button
                  onClick={() => handleEdit(job.id)}
                  className="text-sm px-3 py-1 rounded-md border border-gray-300 text-[#834de3] hover:bg-[#834de3]/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-sm px-3 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
