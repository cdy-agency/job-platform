"use client"

import { useEffect, useState } from "react"
import { Edit, Eye, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminListEmployees } from "@/lib/api"

export default function ManageEmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await adminListEmployees()
      setEmployees(data as any[])
    }
    load()
  }, [])

  const filteredEmployees = employees.filter((emp) =>
    (emp.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container max-w-7xl p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">Manage Employees</h1>

      {/* Search input */}
      <div className="mb-6 max-w-sm">
        <label htmlFor="search" className="sr-only">Search Employees</label>
        <div className="relative text-gray-400 focus-within:text-gray-600">
          <input
            id="search"
            type="search"
            placeholder="Search employees..."
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
        </div>
      </div>

      {/* Employees table */}
      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="w-full divide-y divide-gray-200 text-sm text-black">
          <thead className="bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">Name</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">Email</th>
              <th className="whitespace-nowrap px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id || emp._id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3">{emp.name}</td>
                  <td className="whitespace-nowrap px-4 py-3">{emp.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-indigo-600 border-indigo-600 hover:bg-indigo-100 bg-white"
                      aria-label={`View ${emp.name}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-100 bg-white"
                      aria-label={`Edit ${emp.name}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-100 bg-white"
                      aria-label={`Delete ${emp.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
