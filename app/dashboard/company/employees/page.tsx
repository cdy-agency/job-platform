"use client"

import { useState, useEffect } from "react"
import { fetchEmployeesDirectory, sendWorkRequest } from "@/lib/api"
import {
  X, MapPin, Phone, Mail, Briefcase, User, Calendar, GraduationCap,
  FileText, Award, Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

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
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showModal, setShowModal] = useState(false)

  const [showOfferBox, setShowOfferBox] = useState(false)
  const [offerMessage, setOfferMessage] = useState("")
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEmployeesDirectory()
        setEmployees(data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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
        title: "Error",
        description: error?.response?.data?.message || "Failed to send job offer",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Employee Directory</h1>
        <p className="text-lg text-gray-600 mb-8">Browse our talented team members</p>

        {/* Employee list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {employees.map((employee, idx) => (
            <div key={employee._id || employee.id || idx} className="bg-white rounded-lg shadow p-4 hover:shadow-md">
              <div className="flex items-center gap-4">
                <img
                  src={getImageUrl(employee.profileImage) || "/placeholder.svg"}
                  alt={employee.name}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-600">{employee.email}</p>
                </div>
                <button
                  onClick={() => openModal(employee)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh]">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h2 className="text-3xl font-extrabold">{selectedEmployee.name}</h2>
                <button onClick={closeModal}>
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-8">
                {/* Top section */}
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center md:w-1/3">
                    <img
                      src={getImageUrl(selectedEmployee.profileImage) || "/placeholder.svg"}
                      alt={selectedEmployee.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                    <p className="mt-3 text-xl font-semibold text-gray-800">{selectedEmployee.name}</p>
                    <p className="text-base text-gray-500">{selectedEmployee.email}</p>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-1">Personal Info</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base text-gray-700">
                      {selectedEmployee.phoneNumber && <p><Phone className="inline h-4 w-4 mr-1 text-purple-600" /> {selectedEmployee.phoneNumber}</p>}
                      {selectedEmployee.location && <p><MapPin className="inline h-4 w-4 mr-1 text-purple-600" /> {selectedEmployee.location}</p>}
                      {selectedEmployee.dateOfBirth && <p><Calendar className="inline h-4 w-4 mr-1 text-purple-600" /> {new Date(selectedEmployee.dateOfBirth).toLocaleDateString()}</p>}
                    </div>
                  </div>
                </div>

                {/* About */}
                {selectedEmployee.about && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-1 mb-2">About</h3>
                    <p className="text-base text-gray-700 leading-relaxed">{selectedEmployee.about}</p>
                  </div>
                )}

                {/* Experience / Education */}
                {(selectedEmployee.experience || selectedEmployee.education) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedEmployee.experience && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 border-b pb-1 mb-2">Experience</h3>
                        <p className="text-base text-gray-700">{selectedEmployee.experience}</p>
                      </div>
                    )}
                    {selectedEmployee.education && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 border-b pb-1 mb-2">Education</h3>
                        <p className="text-base text-gray-700">{selectedEmployee.education}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Skills */}
                {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-1 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {selectedEmployee.documents && selectedEmployee.documents.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-1 mb-2">Documents</h3>
                    <div className="space-y-2">
                      {selectedEmployee.documents.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                          <span className="text-base text-gray-700">{getDocumentName(doc)}</span>
                          {getDocumentUrl(doc) && (
                            <a
                              href={getDocumentUrl(doc)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:underline text-sm"
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
                <div className="border-t pt-6">
                  {!showOfferBox ? (
                    <div className="text-center">
                      <Button
                        onClick={() => setShowOfferBox(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Send className="mr-2 h-5 w-5" /> Send Offer
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Write a short message..."
                        value={offerMessage}
                        onChange={(e) => setOfferMessage(e.target.value)}
                        className="min-h-[100px] border-gray-300 resize-none text-base"
                      />
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => { setShowOfferBox(false); setOfferMessage("") }}
                          className="border-gray-300 text-base"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSendOffer}
                          disabled={sending}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-base"
                        >
                          {sending ? "Sending..." : "Send Offer"}
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
