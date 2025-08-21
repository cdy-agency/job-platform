"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchEmployeeApplications } from "@/lib/api"

export default function UserApplicationsPage() {
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployeeApplications()
      .then((res) => {
        const applications = Array.isArray(res?.applications) ? res.applications : Array.isArray(res) ? res : []
        setApps(applications)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>

  return (
    <div className="container space-y-6 p-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Applications</h1>
        <p className="text-gray-600">Track and manage all the jobs you applied for</p>
      </div>

      {/* Applications Card */}
      <Card className="border-gray-200 shadow-sm bg-white text-black">
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-gray-900">All Applications</CardTitle>
              <CardDescription className="text-gray-600">
                You have applied to {apps.length} jobs
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {apps.length > 0 ? (
            <div className="space-y-4">
              {apps.map((app) => {
                const job = app.jobId
                if (!job) return null

                return (
                  <div
                    key={app._id}
                    className="flex flex-col gap-4 rounded-xl border border-gray-300 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Job info */}
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 overflow-hidden rounded-lg border bg-gray-50">
                        <img
                          src={job.companyId?.logo || "/placeholder.svg"}
                          alt={job.companyId?.companyName || "Company"}
                          className="h-full w-full object-cover"
                          width={48}
                          height={48}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.companyId?.companyName || "Company"}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {job.location && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800">
                              {job.location}
                            </span>
                          )}
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800">
                            {job.employmentType}
                          </span>
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800">
                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status + Actions */}
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          app.status === "pending"
                            ? "bg-blue-100 text-blue-700"
                            : app.status === "interview"
                            ? "bg-purple-100 text-purple-700"
                            : app.status === "hired"
                            ? "bg-green-100 text-green-700"
                            : app.status === "reviewed"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {app.status}
                      </span>
                      <div className="flex gap-2">
                        <Link href={`/jobs/${job._id}`}>
                          <Button
                            size="sm"
                            className="rounded-lg bg-[#834de3] text-white hover:bg-[#6b3ac2]"
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            View Job
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No applications yet</h3>
              <p className="mb-6 text-sm text-gray-600">
                You haven’t applied to any jobs yet. Start exploring opportunities!
              </p>
              <Link href="/jobs">
                <Button className="rounded-lg bg-[#834de3] text-white hover:bg-[#6b3ac2]">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
