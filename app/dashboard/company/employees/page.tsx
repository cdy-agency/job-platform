"use client"

import { useState, useEffect } from "react"
import { fetchEmployeesDirectory, sendWorkRequest } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JOB_CATEGORIES } from "@/lib/constantData"
import {
  X, MapPin, Phone, Calendar, Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppAvatar } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import PaginationControls from "@/components/pagination-controls"

const getImageUrl = (profileImage: any) => {
  if (typeof profileImage === "string") return profileImage
  if (profileImage?.url) return profileImage.url
  return null
}

const getDocumentUrl = (document: any) => {
  if (typeof document === "string") return document
  if (document?.url) return document.url
  return null
}

const getDocumentName = (document: any) => {
  if (typeof document === "string") return "Document"
  if (document?.name) return document.name
  return "Document"
}

interface Employee {
  id?: string
  _id?: string
  name: string
  email?: string
  dateOfBirth?: Date
  phoneNumber?: string
  jobPreferences?: string[]
  about?: string
  experience?: string
  education?: string
  skills?: string[]
  profileImage?: any
  documents?: any[]
  location?: string
  province?: string
  district?: string
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string>("all")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
    startIndex: 0,
    endIndex: 0,
  })

  const [showOfferBox, setShowOfferBox] = useState(false)
  const [offerMessage, setOfferMessage] = useState("")
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadEmployees(1)
  }, [category])

  const loadEmployees = async (page: number = 1) => {
    try {
      setLoading(true)
      const data = await fetchEmployeesDirectory(category === 'all' ? undefined : category, { page, limit: 10 })
      setEmployees(data.employees || [])
      if (data.pagination) {
        setPagination(data.pagination)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    loadEmployees(page)
  }

  const openModal = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowModal(true)
    setShowOfferBox(false)
    setOfferMessage("")
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedEmployee(null)
  }

  const handleSendOffer = async () => {
    if (!selectedEmployee?._id && !selectedEmployee?.id) return
    setSending(true)
    try {
      await sendWorkRequest(String(selectedEmployee._id || selectedEmployee.id), offerMessage || undefined)
      toast({ title: "Offer Sent", description: "Job offer has been sent successfully." })
      setOfferMessage("")
      setShowOfferBox(false)
    } catch (error: any) {
      toast({
          title: `Failed to load profile data`,
          description: "Try Again!",
        });
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Employee Directory</h1>
        <p className="text-sm text-gray-600 mb-4">Browse our talented team members</p>
        <div className="mb-6 max-w-sm">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Filter by preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {JOB_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-2 text-left">Profile</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Province</th>
                <th className="px-4 py-2 text-left">District</th>
                <th className="px-4 py-2 text-left">Skills</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
              {employees.map((employee, idx) => (
                <tr key={employee._id || employee.id || idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <AppAvatar image={employee.profileImage} name={employee.name} size={36} />
                  </td>
                  <td className="px-4 py-2 font-medium">{employee.name}</td>
                  <td className="px-4 py-2">{employee.email || "-"}</td>
                  <td className="px-4 py-2">{employee.phoneNumber || "-"}</td>
                  <td className="px-4 py-2">{employee.province || "-"}</td>
                  <td className="px-4 py-2">{employee.district || "-"}</td>
                  <td className="px-4 py-2">
                    {employee.skills && employee.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {employee.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{skill}</span>
                        ))}
                      </div>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button
                      onClick={() => openModal(employee)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!loading && employees.length > 0 && (
          <div className="mt-8">
            <PaginationControls 
              pagination={pagination} 
              onPageChange={handlePageChange}
              className="flex flex-col sm:flex-row items-center justify-between gap-4"
            />
          </div>
        )}

        {/* Modern Modal */}
        {showModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh]">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-5 py-3">
                <h2 className="text-lg font-semibold">{selectedEmployee.name}</h2>
                <button onClick={closeModal}>
                  <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-6 text-sm text-gray-700">
                {/* Top section */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center md:w-1/3">
                    <img
                      src={getImageUrl(selectedEmployee.profileImage) || "/placeholder.svg"}
                      alt={selectedEmployee.name}
                      className="w-24 h-24 rounded-full object-cover border"
                    />
                    <p className="mt-2 font-medium">{selectedEmployee.name}</p>
                    <p className="text-gray-500 text-xs">{selectedEmployee.email}</p>
                  </div>

                  <div className="flex-1 space-y-2">
                    <p className="flex items-center text-xs text-gray-600"><Phone className="h-3 w-3 mr-2 text-purple-600" /> {selectedEmployee.phoneNumber || "N/A"}</p>
                    <p className="flex items-center text-xs text-gray-600"><MapPin className="h-3 w-3 mr-2 text-purple-600" /> {selectedEmployee.location || "N/A"}</p>
                    {selectedEmployee.dateOfBirth && (
                      <p className="flex items-center text-xs text-gray-600"><Calendar className="h-3 w-3 mr-2 text-purple-600" /> {new Date(selectedEmployee.dateOfBirth).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                {/* About */}
                {selectedEmployee.about && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">About</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{selectedEmployee.about}</p>
                  </div>
                )}

                {/* Experience / Education */}
                {(selectedEmployee.experience || selectedEmployee.education) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedEmployee.experience && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Experience</h3>
                        <p className="text-xs text-gray-600">{selectedEmployee.experience}</p>
                      </div>
                    )}
                    {selectedEmployee.education && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Education</h3>
                        <p className="text-xs text-gray-600">{selectedEmployee.education}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Skills */}
                {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {selectedEmployee.documents && selectedEmployee.documents.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Documents</h3>
                    <div className="space-y-1">
                      {selectedEmployee.documents.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                          <span className="text-xs">{getDocumentName(doc)}</span>
                          {getDocumentUrl(doc) && (
                            <a
                              href={getDocumentUrl(doc)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:underline text-xs"
                            >
                              View
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Send Offer */}
                <div className="border-t pt-4">
                  {!showOfferBox ? (
                    <div className="text-center">
                      <Button
                        onClick={() => setShowOfferBox(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2"
                      >
                        <Send className="mr-1 h-4 w-4" /> Send Offer
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Write a short message..."
                        value={offerMessage}
                        onChange={(e) => setOfferMessage(e.target.value)}
                        className="min-h-[80px] text-xs"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => { setShowOfferBox(false); setOfferMessage("") }}
                          className="text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSendOffer}
                          disabled={sending}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                        >
                          {sending ? "Sending..." : "Send"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
