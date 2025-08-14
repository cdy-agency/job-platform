"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import ApplyJobModal from "@/components/employee/ApplyJobModal"
import { Bell, Briefcase, Clock, Eye, FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchEmployeeApplications, fetchEmployeeProfile, fetchJobs, applyToJob, fetchJobSuggestions, fetchEmployeeNotifications } from "@/lib/api"

export default function UserDashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [recommended, setRecommended] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [applyJobId, setApplyJobId] = useState<string | null>(null)
  const [applyMeta, setApplyMeta] = useState<{ title?: string; company?: string } | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    Promise.all([fetchEmployeeProfile(), fetchEmployeeApplications(), fetchJobSuggestions(), fetchEmployeeNotifications()])
      .then(([p, apps, suggestions, notifs]) => {
        setProfile(p || null)
        setApplications(apps || [])
        const jobsArray = Array.isArray(suggestions) ? suggestions : []
        setRecommended(jobsArray.slice(0, 3))
        setNotifications(Array.isArray(notifs) ? notifs : (notifs?.notifications || []))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Loading...</div>

  const openApply = (job: any) => {
    setApplyJobId(job._id || job.id)
    setApplyMeta({ title: job.title, company: job.companyId?.companyName || job.company?.name })
  }

  return (
    <div className="container space-y-8 p-6 pb-16">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard</h1>
          <p className="text-black">Welcome back{profile?.name ? `, ${profile.name}` : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-gray-300 bg-white text-black hover:bg-gray-50 hover:text-black"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Link href="/jobs">
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              <Search className="mr-2 h-4 w-4" />
              Find Jobs
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-black">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-black">{applications.length}</div>
              <Briefcase className="h-5 w-5 text-black" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-black">Saved Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-black">0</div>
              <FileText className="h-5 w-5 text-black" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-black">Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-black">24</div>
              <Eye className="h-5 w-5 text-black" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-black">Days Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-black">45</div>
              <Clock className="h-5 w-5 text-black" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-black">Recent Applications</CardTitle>
            <CardDescription className="text-black">Your recently submitted job applications</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => {
                  const job = app.jobId
                  if (!job) return null

                  return (
                    <div key={app._id} className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded">
                          <img
                            src={job.companyId?.logo || "/placeholder.svg"}
                            alt={job.companyId?.companyName || 'Company'}
                            className="h-full w-full object-cover"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-black">{job.title}</h4>
                          <p className="text-sm text-black">{job.companyId?.companyName || 'Company'}</p>
                          <p className="text-xs text-black">
                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          app.status === "pending"
                            ? "bg-blue-100 text-blue-800"
                            : app.status === "interview"
                              ? "bg-green-100 text-green-800"
                              : app.status === "hired"
                                ? "bg-green-100 text-green-800"
                                : app.status === "reviewed"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  )
                })}
                <div className="pt-2 text-center">
                  <Link href="/dashboard/user/applications">
                    <Button className="text-blue-500">
                      View all applications
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
                <h3 className="mb-2 text-lg font-semibold text-black">No applications yet</h3>
                <p className="mb-6 text-sm text-black">Start applying to jobs to see your applications here</p>
                <Link href="/jobs">
                  <Button className="bg-blue-500 text-white hover:bg-blue-600">Browse Jobs</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-black">Recommended Jobs</CardTitle>
            <CardDescription className="text-black">Jobs that match your skills and experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommended.map((job: any) => (
                <div key={job._id} className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded">
                      <img
                        src={job.companyId?.logo || "/placeholder.svg"}
                        alt={job.companyId?.companyName || 'Company'}
                        className="h-full w-full object-cover"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-black">{job.title}</h4>
                      <p className="text-sm text-black">{job.companyId?.companyName || 'Company'}</p>
                      <div className="mt-1 flex gap-2">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-black">{job.employmentType}</span>
                        {job.location && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-black">
                            {job.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/jobs/${job._id}`}>
                      <Button size="sm" className="text-black hover:bg-gray-100">
                        View
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => openApply(job)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-2 text-center">
                <Link href="/jobs">
                  <Button className="text-blue-500">
                    View more jobs
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-black">Notifications</CardTitle>
          <CardDescription className="text-black">Updates from your applications</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-sm text-black">No notifications yet.</p>
          ) : (
            <ul className="space-y-2">
              {notifications.slice(0, 5).map((n: any, idx: number) => (
                <li key={idx} className="text-sm text-black">
                  {n.message || n.text || n.title || 'Update'}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-black">Complete Your Profile</CardTitle>
          <CardDescription className="text-black">
            A complete profile helps you stand out to employers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-black">Upload your resume</h4>
                  <p className="text-sm text-black">Add your latest resume to apply for jobs faster</p>
                </div>
              </div>
              <Link href="/dashboard/user/profile">
                <Button variant="outline" className="border-gray-300 bg-white text-black hover:bg-gray-50">
                  Upload
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-black">Add work experience</h4>
                  <p className="text-sm text-black">Showcase your professional background</p>
                </div>
              </div>
              <Link href="/dashboard/user/profile">
                <Button variant="outline" className="border-gray-300 bg-white text-black hover:bg-gray-50">
                  Add
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-black">Set job preferences</h4>
                  <p className="text-sm text-black">Tell us what you're looking for in your next role</p>
                </div>
              </div>
              <Link href="/dashboard/user/settings">
                <Button variant="outline" className="border-gray-300 bg-white text-black hover:bg-gray-50">
                  Set
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <ApplyJobModal
        jobId={applyJobId || ''}
        open={!!applyJobId}
        onOpenChange={(open) => { if (!open) setApplyJobId(null) }}
        jobTitle={applyMeta?.title}
        companyName={applyMeta?.company}
      />
    </div>
  )
}