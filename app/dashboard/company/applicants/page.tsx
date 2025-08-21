"use client";

import React, { useEffect, useState } from "react";
import { fetchCompanyJobs, fetchJobApplicants, updateApplicantStatus } from "@/lib/api";

type Applicant = {
  _id: string;
  employeeId: { name: string; email?: string; phoneNumber?: string } | string;
  jobId: { title: string } | string;
  status: "pending" | "reviewed" | "interview" | "hired" | "rejected";
  createdAt?: string;
};

export default function ManageApplicantsPage() {
  const [jobs, setJobs] = useState<Array<{ _id: string; title: string }>>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  useEffect(() => {
    fetchCompanyJobs()
      .then((res) => {
        const jobsList = Array.isArray(res?.jobs) ? res.jobs : Array.isArray(res) ? res : []
        const mapped = jobsList.map((j: any) => ({ _id: j._id, title: j.title }))
        setJobs(mapped)
        if (mapped[0]?._id) setSelectedJobId(mapped[0]._id)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedJobId) return
    setLoadingApplicants(true)
    fetchJobApplicants(selectedJobId)
      .then((list) => setApplicants(list || []))
      .finally(() => setLoadingApplicants(false))
  }, [selectedJobId])

  const updateStatus = async (id: string, status: Applicant["status"]) => {
    try {
      await updateApplicantStatus(id, status)
      setApplicants((prev) => prev.map((a) => a._id === id ? { ...a, status } as Applicant : a))
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to update status')
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Select Job</label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black"
          >
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>{j.title}</option>
            ))}
          </select>
        </div>

        {loadingApplicants ? (
          <p className="text-gray-500">Loading applicants...</p>
        ) : applicants.length === 0 ? (
          <p className="text-gray-500 text-center">No applicants found.</p>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-md font-semibold text-gray-900">{typeof app.employeeId === 'object' ? app.employeeId.name : 'Applicant'}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Applied for: <span className="font-medium">{typeof app.jobId === 'object' ? app.jobId.title : ''}</span>
                  </p>
                  {typeof app.employeeId === 'object' && (
                    <p className="text-xs text-gray-500">
                      Email: {app.employeeId.email || '—'} | Phone: {app.employeeId.phoneNumber || '—'}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Applied on: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                  </p>
                  {/* Application message & resume */}
                  {(app as any)?.message && (
                    <p className="text-xs text-gray-700 mt-2">Message: {(app as any).message}</p>
                  )}
                  {(app as any)?.resume && (
                    <a href={(app as any).resume} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline mt-1 inline-block">View Resume</a>
                  )}
                </div>

                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-center gap-2">
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      app.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "reviewed"
                        ? "bg-blue-100 text-blue-800"
                        : app.status === "interview"
                        ? "bg-purple-100 text-purple-800"
                        : app.status === "hired"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {app.status === 'reviewed' ? 'shortlisted' : app.status}
                  </span>

                  <div className="flex gap-2 flex-wrap justify-center">
                    {app.status !== "reviewed" && (
                      <button
                        onClick={() => updateStatus(app._id, "reviewed")}
                        className="text-xs px-2 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        Shortlist
                      </button>
                    )}

                    {app.status !== "interview" && (
                      <button
                        onClick={() => updateStatus(app._id, "interview")}
                        className="text-xs px-2 py-1 rounded border border-purple-300 text-purple-700 hover:bg-purple-100"
                      >
                        Call Interview
                      </button>
                    )}

                    {app.status !== "hired" && (
                      <button
                        onClick={() => updateStatus(app._id, "hired")}
                        className="text-xs px-2 py-1 rounded border border-green-300 text-green-700 hover:bg-green-100"
                      >
                        Mark Hired
                      </button>
                    )}

                    {app.status !== "rejected" && (
                      <button
                        onClick={() => updateStatus(app._id, "rejected")}
                        className="text-xs px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-100"
                      >
                        Reject
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
