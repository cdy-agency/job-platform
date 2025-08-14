"use client"

import { useEffect, useState } from "react"
import { Search, Eye, Mail, Phone, MapPin, Calendar, User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchAllEmployees } from "@/lib/api"
import { toast } from "sonner"

interface Employee {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  skills?: string[];
  jobPreferences?: string[];
  isActive: boolean;
  createdAt: string;
}

export default function ManageEmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const response = await fetchAllEmployees()
      setEmployees(response.employees || [])
    } catch (error: any) {
      console.error("Error loading employees:", error)
      toast.error(error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = employees.filter((e) => {
    const term = searchTerm.toLowerCase()
    return (
      (e.name || '').toLowerCase().includes(term) ||
      (e.email || '').toLowerCase().includes(term) ||
      (e.location || '').toLowerCase().includes(term) ||
      (e.skills || []).some(skill => skill.toLowerCase().includes(term))
    )
  })

  return (
    <div className="container max-w-7xl p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">Manage Employees</h1>

      <div className="mb-6 max-w-sm">
        <label htmlFor="search" className="sr-only">Search Employees</label>
        <div className="relative text-gray-400 focus-within:text-gray-600">
          <input
            id="search"
            type="search"
            placeholder="Search employees..."
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading employees...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No employees match your search.' : 'No employees have registered yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((employee) => (
            <div key={employee._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {employee.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.email}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="space-y-3">
                {employee.phoneNumber && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {employee.phoneNumber}
                  </div>
                )}
                
                {employee.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {employee.location}
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Joined {new Date(employee.createdAt).toLocaleDateString()}
                </div>

                {employee.skills && employee.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {employee.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {employee.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{employee.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {employee.jobPreferences && employee.jobPreferences.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Job Preferences</h4>
                    <div className="flex flex-wrap gap-1">
                      {employee.jobPreferences.slice(0, 2).map((pref, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {pref}
                        </span>
                      ))}
                      {employee.jobPreferences.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{employee.jobPreferences.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
