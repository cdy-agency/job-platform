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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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

  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (Array.isArray(job.applicants) ? job.applicants.length : 0),
    0
  )

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
      <div className="container mx-auto space-y-10 px-6 py-8 pb-16">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
            <p className="text-lg text-gray-600">
              Welcome back {profile?.companyName ? `, ${profile.companyName}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/company/notifications">
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 bg-white hover:border-purple-500 hover:text-purple-700">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard/company/post-job">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow">
                <PlusCircle className="mr-2 h-5 w-5" />
                Post New Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-sm hover:shadow-md transition bg-white">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-purple-700">{jobs.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-600" />
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition bg-white">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Applicants</p>
                <p className="text-3xl font-bold text-purple-700">{totalApplicants}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition bg-white">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-3xl font-bold text-purple-700">{employees.length}</p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </CardContent>
          </Card>
        </div>

        {/* Job Offer */}
        <div className="">
          {/* <div className="lg:col-span-1">
            <Card className="shadow-sm hover:shadow-md transition bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Send className="h-5 w-5 text-purple-600" /> Send Job Offer
                </CardTitle>
                <CardDescription className="text-gray-600">Invite an employee to apply</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Select Employee</label>
                  <Select onValueChange={setSelectedEmployeeId} value={selectedEmployeeId}>
                    <SelectTrigger className="w-full border-gray-300 bg-white">
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
                    className="min-h-[100px] border-gray-300 resize-none"
                  />
                </div>
                <Button
                  onClick={async () => {
                    if (!selectedEmployeeId) {
                      toast({ title: "Select an employee", description: "Please pick an employee first.", variant: "destructive" })
                      return
                    }
                    setSending(true)
                    try {
                      await sendWorkRequest(selectedEmployeeId, offerMessage || undefined)
                      setOfferMessage("")
                      setSelectedEmployeeId("")
                      toast({ title: "Offer sent", description: "Job offer sent successfully." })
                    } catch (e: any) {
                      toast({ title: "Failed", description: e?.response?.data?.message || "Unable to send job offer", variant: "destructive" })
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
          </div> */}
        <Card className="shadow-sm hover:shadow-md transition bg-white">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Applicants</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {applicants.length > 0 ? (
              <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-purple-50 text-purple-700">
                  <tr>
                    <th className="px-4 py-2">Applicant</th>
                    <th className="px-4 py-2">Applied For</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.slice(0, 5).map((app) => (
                    <tr key={app._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 flex items-center gap-3 text-black">
                        <Avatar className="h-8 w-8 border">
                          <AvatarImage src={getImageUrl(app.employeeId?.profileImage)} />
                          <AvatarFallback className="bg-gray-200 text-gray-600">
                            {(app.employeeId?.name || "A").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{app.employeeId?.name || "Applicant"}</span>
                      </td>
                      <td className="px-4 py-2">{app.jobId?.title || "—"}</td>
                      <td className="px-4 py-2">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Link href={`/dashboard/company/applicants`}>
                          <Button size="sm" variant="outline" className="hover:border-purple-500 hover:text-purple-700">
                            <Eye className="mr-1 h-4 w-4" /> Review
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-6 text-gray-600">No applications yet</p>
            )}
          </CardContent>
        </Card>

        </div>

      </div>
    </div>
  )
}
