"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowUpDown, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchEmployeeApplications } from "@/lib/api"

function mapStatus(status: string): "pending" | "shortlisted" | "rejected" | "hired" {
  const s = (status || "").toLowerCase()
  if (s === "reviewed" || s === "interview") return "shortlisted"
  if (s === "pending") return "pending"
  if (s === "hired") return "hired"
  return "rejected"
}

export default function UserApplicationsPage() {
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(10)

  useEffect(() => {
    fetchEmployeeApplications()
      .then((list) => setApps(Array.isArray(list) ? list : []))
      .finally(() => setLoading(false))
  }, [])

  const visibleApps = useMemo(() => apps.slice(0, visible), [apps, visible])

  if (loading) {
    return (
      <div className="container space-y-6 p-6 pb-16">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">My Applications</h1>
          <p className="text-gray-600">Track and manage your job applications</p>
        </div>
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">All Applications</CardTitle>
            <CardDescription className="text-gray-600">Loading your applications...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg border border-gray-200 p-4">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="mt-2 h-3 w-64 bg-gray-100 rounded" />
                  <div className="mt-3 h-3 w-24 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container space-y-6 p-6 pb-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">My Applications</h1>
        <p className="text-gray-600">Track and manage your job applications</p>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-gray-800">All Applications</CardTitle>
              <CardDescription className="text-gray-600">
                You have applied to {apps.length} jobs
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-300 bg-transparent text-gray-800">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {apps.length > 0 ? (
            <div className="space-y-6">
              {visibleApps.map((app) => {
                const job = app.jobId
                if (!job) return null
                const status = mapStatus(app.status)
                return (
                  <div
                    key={app._id}
                    className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 overflow-hidden rounded">
                        <img
                          src={job.companyId?.logo || "/placeholder.svg"}
                          alt={job.companyId?.companyName || 'Company'}
                          className="h-full w-full object-cover"
                          width={48}
                          height={48}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.companyId?.companyName || 'Company'}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {job.location && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
                              {job.location}
                            </span>
                          )}
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">{job.employmentType}</span>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : status === "shortlisted"
                              ? "bg-purple-100 text-purple-800"
                              : status === "hired"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {status}
                      </span>
                      <div className="flex gap-2">
                        <Button className="text-gray-600 hover:text-gray-800">
                          <Download className="mr-1 h-4 w-4" />
                          Resume
                        </Button>
                        <Link href={`/jobs/${job._id}`}>
                          <Button className="text-gray-600 hover:text-gray-800">
                            <Eye className="mr-1 h-4 w-4" />
                            View Job
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
              {visible < apps.length && (
                <div className="flex justify-center">
                  <Button onClick={() => setVisible((v) => v + 10)} className="bg-[#834de3] text-white hover:bg-[#6b3ac2]">
                    Load more
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">No applications yet</h3>
              <p className="mb-6 text-sm text-gray-600">
                You haven't applied to any jobs yet. Start exploring opportunities!
              </p>
              <Link href="/jobs">
                <Button className="bg-[#834de3] text-white hover:bg-[#6b3ac2]">Browse Jobs</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
