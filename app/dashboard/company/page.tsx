"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Bell, PlusCircle, Users, Briefcase, Eye, Send, Calendar, MapPin, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchCompanyJobs, fetchCompanyProfile, fetchJobApplicants, fetchEmployeesDirectory, sendWorkRequest } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CompanyDashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [applicants, setApplicants] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("")
  const [offerMessage, setOfferMessage] = useState<string>("")
  const [sending, setSending] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const p = await fetchCompanyProfile()
        setProfile(p || null)
      } catch {
        setProfile(null)
      }
      try {
        const list = await fetchCompanyJobs()
        setJobs(list || [])
        if ((list || []).length > 0) {
          const firstJobId = list[0]._id
          try {
            const apps = await fetchJobApplicants(firstJobId)
            setApplicants(apps || [])
          } catch {
            setApplicants([])
          }
        }
      } catch {
        setJobs([])
      }
      try {
        const emps = await fetchEmployeesDirectory()
        setEmployees(Array.isArray(emps) ? emps : [])
      } catch {
        setEmployees([])
      }
      setLoading(false)
    }
    load()
  }, [])

  const getImageUrl = (profileImage: any) => {
  if (typeof profileImage === "string") return profileImage
  if (profileImage?.url) return profileImage.url
  return null
}


  const totalApplicants = jobs.reduce((sum, job) => sum + (Array.isArray(job.applicants) ? job.applicants.length : 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
          <span className="text-lg font-medium text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto space-y-8 px-6 py-8 pb-16">
        
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
            <p className="text-lg text-gray-600">
              Welcome back{profile?.companyName ? `, ${profile.companyName}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/company/notifications">
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:text-gray-900 bg-white">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard/company/post-job">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm">
                <PlusCircle className="mr-2 h-5 w-5" />
                Post New Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-sm bg-white text-black">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-600" />
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-white text-black">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Applicants</p>
                <p className="text-3xl font-bold text-gray-900">{totalApplicants}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-white text-black">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </CardContent>
          </Card>
        </div>

        {/* Job Offer */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="shadow-sm bg-white text-black">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                  <Send className="h-5 w-5 text-purple-600" /> Send Job Offer
                </CardTitle>
                <CardDescription className="text-gray-600">Invite an employee to consider a role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Select Employee</label>
                  <Select onValueChange={setSelectedEmployeeId} value={selectedEmployeeId}>
                    <SelectTrigger className="w-full border-gray-300 bg-white text-black">
                      <SelectValue placeholder="Choose an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e._id || e.id} value={String(e._id || e.id)}>
                          {e.name || e.fullName || e.email || "Employee"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Message (optional)</label>
                  <Textarea
                    placeholder="Write a personalized message..."
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    className="min-h-[100px] border-gray-300 resize-none bg-white text-black"
                  />
                </div>
                <Button
                  onClick={async () => {
                    if (!selectedEmployeeId) {
                      toast({ title: "Select an employee", description: "Please pick an employee to send the offer.", variant: 'destructive' })
                      return
                    }
                    setSending(true)
                    try {
                      await sendWorkRequest(selectedEmployeeId, offerMessage || undefined)
                      setOfferMessage("")
                      setSelectedEmployeeId("")
                      toast({ title: "Offer sent", description: "Your job offer was sent successfully." })
                    } catch (e: any) {
                      toast({ title: "Failed to send", description: e?.response?.data?.message || "Unable to send job offer", variant: 'destructive' })
                    } finally {
                      setSending(false)
                    }
                  }}
                  disabled={sending}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {sending ? "Sending..." : "Send Offer"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Jobs */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm bg-white text-black">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl text-gray-900">Recent Job Postings</CardTitle>
                  <CardDescription className="text-gray-600">Your recently posted jobs</CardDescription>
                </div>
                <Link href="/dashboard/company/jobs">
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:text-gray-900 bg-white">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 bg-slate-200">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job._id} className="border border-gray-200 p-4 rounded-md hover:bg-gray-50 bg-slate-400">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">{job.title}</h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">{job.employmentType}</Badge>
                            {job.location && (
                              <Badge variant="outline" className="border-gray-300 text-gray-600">
                                <MapPin className="mr-1 h-3 w-3" /> {job.location}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Link href={`/dashboard/company/jobs/${job._id}`}>
                          <Button size="sm" variant="outline" className="border-gray-300 text-black hover:text-gray-900 bg-white">
                            <Eye className="mr-1 h-4 w-4" /> View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {jobs.length === 0 && (
                    <div className="py-8 text-center text-gray-600">No jobs posted yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Applicants */}
        <Card className="shadow-sm bg-white text-black">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl text-gray-900">Recent Applicants</CardTitle>
              <CardDescription className="text-gray-600">Candidates who recently applied</CardDescription>
            </div>
            <Link href="/dashboard/company/applicants">
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:text-gray-900 bg-white">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicants.slice(0, 5).map((app) => (
                <div key={app._id} className="flex justify-between items-center border border-gray-200 p-4 rounded-md">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={getImageUrl(app.employeeId?.profileImage || "/placeholder.svg")} />
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {(app.employeeId?.name || "A").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900">{app.employeeId?.name || "Applicant"}</h4>
                      <p className="text-sm text-gray-600">Applied for {app.jobId?.title || "Unknown"}</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Calendar className="mr-1 h-3 w-3" /> {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  </div>
                  <Link href={`/dashboard/company/applicants`}>
                    <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 bg-white">
                      <Eye className="mr-1 h-4 w-4" /> Review
                    </Button>
                  </Link>
                </div>
              ))}
              {applicants.length === 0 && (
                <div className="py-8 text-center text-gray-600">No applications yet</div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
