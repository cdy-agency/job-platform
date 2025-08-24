"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Bell, Briefcase, Clock, Eye, FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchEmployeeApplications, fetchEmployeeProfile, fetchJobs, applyToJob, fetchJobSuggestions } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AppAvatar } from "@/components/ui/avatar"
import { getImage, formatDeadline } from "@/lib/utils"

export default function UserDashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [recommended, setRecommended] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [applyOpen, setApplyOpen] = useState(false)
  const [applyJobId, setApplyJobId] = useState<string>("")
  const [applyMessage, setApplyMessage] = useState<string>("")
  const [applyFile, setApplyFile] = useState<File | null>(null)
  const [applySubmitting, setApplySubmitting] = useState(false)
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    Promise.all([fetchEmployeeProfile(), fetchEmployeeApplications(), fetchJobSuggestions()])
      .then(([p, apps, suggestions]) => {
        setProfile(p || null)
        const appList = Array.isArray(apps) ? apps : []
        setApplications(appList)
        const appliedIds = new Set<string>(
          appList
            .map((a: any) => a?.jobId?._id || a?.jobId?.id || a?.jobId || a?.job?._id || a?.job?.id)
            .filter(Boolean)
        )
        setAppliedJobIds(appliedIds)
        const jobsArray = Array.isArray(suggestions) ? suggestions : []
        setRecommended(jobsArray.slice(0, 3))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="container space-y-8 p-6 pb-16">
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply to job</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-700">Cover Letter</label>
              <Textarea value={applyMessage} onChange={(e) => setApplyMessage(e.target.value)} placeholder="Tell us why you're a good fit..." className="min-h-[120px]" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Resume / Document</label>
              <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => setApplyFile(e.target.files?.[0] || null)} className="block w-full text-sm" />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                setApplySubmitting(true)
                try {
                  await applyToJob(applyJobId, { coverLetter: applyMessage || undefined, resumeFile: applyFile, appliedVia: 'normal' })
                  toast({ title: 'Application submitted', description: 'Your application has been sent.' })
                  setApplyOpen(false)
                  setApplyMessage("")
                  setApplyFile(null)
                  setAppliedJobIds(prev => {
                    const next = new Set(prev)
                    next.add(applyJobId)
                    return next
                  })
                } catch (e: any) {
                  const message = e?.response?.data?.message || 'Please log in as an employee.'
                  toast({ title: 'Failed to apply', description: message, variant: 'destructive' })
                  if (typeof message === 'string' && message.toLowerCase().includes('already applied')) {
                    setAppliedJobIds(prev => {
                      const next = new Set(prev)
                      next.add(applyJobId)
                      return next
                    })
                    setApplyOpen(false)
                  }
                } finally {
                  setApplySubmitting(false)
                }
              }}
              disabled={applySubmitting || !applyJobId}
              className="bg-[#834de3] text-white hover:bg-[#6b3ac2]"
            >
              {applySubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard</h1>
          <p className="text-black">Welcome back{profile?.name ? `, ${profile.name}` : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/user/notifications">
            <Button
              variant="outline"
              className="border-gray-300 bg-white text-black hover:bg-gray-50 hover:text-black"
            >
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
          </Link>
          <Link href="/jobs">
            <Button className="bg-[#834de3] text-white hover:bg-[#6b3ac2]">
              <Search className="mr-2 h-4 w-4" />
              Find Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Indicator */}
      {profile && (
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Account Status:</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              (profile as any)?.isActive === false
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {(profile as any)?.isActive === false ? 'Account Deactivated' : 'Active'}
            </span>
            {(profile as any)?.isActive === false ? (
              <Link href="/dashboard/user/profile">
                <Button size="sm" variant="outline" className="text-xs border-green-200 text-green-700 hover:bg-green-50">
                  Reactivate Account
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      )}

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
                        <AppAvatar image={job.companyId?.logo} name={job.companyId?.companyName} size={40} />
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
                  <Button className="bg-[#834de3] text-white hover:bg-[#6b3ac2]">Browse Jobs</Button>
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
                    <AppAvatar image={job.companyId?.logo} name={job.companyId?.companyName} size={40} />
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
                      <Button size="sm" className="bg-white text-[#834de3] border border-[#834de3] hover:bg-[#f5f0ff]">
                        View
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="bg-[#834de3] text-white hover:bg-[#6b3ac2]"
                      onClick={() => { setApplyOpen(true); setApplyJobId(job._id); }}
                      disabled={appliedJobIds.has(String(job._id))}
                    >
                      {appliedJobIds.has(String(job._id)) ? 'Already Applied' : 'Apply'}
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-2 text-center">
                <Link href="/jobs">
                  <Button className="bg-white text-[#834de3] border border-[#834de3] hover:bg-[#f5f0ff]">
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
    </div>
  )
}