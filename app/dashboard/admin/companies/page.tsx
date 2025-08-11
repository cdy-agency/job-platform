"use client"

import { useEffect, useState } from "react"
import { Check, Eye, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminApproveCompany, adminListCompanies } from "@/lib/api"

export default function ManageCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [companies, setCompanies] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await adminListCompanies()
      setCompanies(data as any[])
    }
    load()
  }, [])

  const filteredCompanies = companies.filter((comp) => {
    return (
      (comp.companyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comp.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comp.isApproved ? "approved" : "pending").includes(searchTerm.toLowerCase())
    )
  })

  const getStatusClass = (approved: boolean) => {
    return approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  }

  const approve = async (id: string) => {
    const updated = await adminApproveCompany(id)
    setCompanies((prev) => prev.map((c) => (c._id === id ? updated : c)))
  }

  return (
    <div className="container max-w-7xl p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">Manage Companies</h1>

      {/* Search */}
      <div className="mb-6 max-w-sm">
        <label htmlFor="search" className="sr-only">Search Companies</label>
        <div className="relative text-gray-400 focus-within:text-gray-600">
          <input
            id="search"
            type="search"
            placeholder="Search companies..."
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Companies table */}
      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-black">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">Company Name</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">Email</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="whitespace-nowrap px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((comp) => (
                <tr key={comp._id} className="hover:bg-gray-50 text-black">
                  <td className="whitespace-nowrap px-4 py-3">{comp.companyName}</td>
                  <td className="whitespace-nowrap px-4 py-3">{comp.email}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(comp.isApproved)}`}>
                      {comp.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center space-x-2">
                    {!comp.isApproved && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-100 bg-white"
                          aria-label={`Approve ${comp.companyName}`}
                          onClick={() => approve(comp._id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-yellow-600 border-yellow-600 hover:bg-yellow-100 bg-white"
                          aria-label={`Reject ${comp.companyName}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-indigo-600 border-indigo-600 hover:bg-indigo-100 bg-white"
                      aria-label={`View ${comp.companyName}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-100 bg-white"
                      aria-label={`Delete ${comp.companyName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
