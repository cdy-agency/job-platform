"use client"

import { useEffect, useState } from "react"
import { Check, X, Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { approveCompany, fetchAdminCompanies } from "@/lib/api"

export default function ManageCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchAdminCompanies()
      .then((list) => setCompanies(Array.isArray(list) ? list : []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = companies.filter((c) => {
    const term = searchTerm.toLowerCase()
    return (
      (c.companyName || '').toLowerCase().includes(term) ||
      (c.email || '').toLowerCase().includes(term) ||
      (c.location || '').toLowerCase().includes(term)
    )
  })

  const handleApprove = async (id: string) => {
    try {
      await approveCompany(id)
      setCompanies((prev) => prev.map((c) => c._id === id ? { ...c, isApproved: true } : c))
      alert('Company approved')
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to approve')
    }
  }

  return (
    <div className="container max-w-7xl p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">Manage Companies</h1>

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
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="w-full divide-y divide-gray-200 text-sm text-black">
          <thead className="bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">Company</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">Email</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">Location</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="whitespace-nowrap px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={c.logo || '/placeholder.svg'} alt={c.companyName} className="h-6 w-6 rounded" />
                      <span>{c.companyName}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{c.email || '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3">{c.location || '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {c.isApproved ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Approved</span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">Pending</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-700 border-gray-300 hover:bg-gray-100 bg-white"
                      aria-label={`View ${c.companyName}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!c.isApproved && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-700 border-green-600 hover:bg-green-100 bg-white"
                        onClick={() => handleApprove(c._id)}
                      >
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                    )}
                    {/* Placeholder for reject if needed later */}
                    {/* <Button size="sm" variant="outline" className="text-red-700 border-red-600 hover:bg-red-100 bg-white"><X className="h-4 w-4" /> Reject</Button> */}
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
