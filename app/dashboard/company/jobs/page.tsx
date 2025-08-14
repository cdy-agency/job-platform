"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCompanyJobs } from "@/lib/api";
import { toast } from "sonner";

type Job = {
  _id: string;
  title: string;
  category?: string;
  employmentType?: string;
  createdAt?: string;
};

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCompanyJobs()
      .then((list) => setJobs(list || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) => {
    // TODO: integrate delete job API when available
    setJobs((prev) => prev.filter((job) => job._id !== id));
    toast.success("Job removed from list")
  };

  const handleEdit = (id: string) => {
    router.push(`/jobs/edit/${id}`);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Manage Posted Jobs</h1>

        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center">No jobs posted yet.</p>
        ) : (Array.isArray(jobs) && jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4"
            >
              <div className="flex-1">
                <h3 className="text-md font-semibold text-gray-900">{job.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Type: {job.employmentType || 'N/A'} | Category: {job.category || 'N/A'} | Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'}
                </p>
              </div>

              <div className="mt-4 sm:mt-0 flex gap-2">
                <button
                  onClick={() => handleEdit(job._id)}
                  className="text-sm px-3 py-1 rounded-md border border-gray-300 text-[#834de3] hover:bg-[#834de3]/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
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
