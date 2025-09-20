"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { getCompanies } from "@/lib/api/admin"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AdminCompany {
  _id: string
  companyName: string
  email: string
  createdAt: string
  status?: string
  profileCompletionStatus?: string
}

const normalizeCompanies = (payload: any): AdminCompany[] => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.companies)) return payload.companies
  if (Array.isArray(payload?.data?.companies)) return payload.data.companies
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const STATUSES = ["all", "pending", "approved", "rejected", "disabled"]

export default function CompanyList() {
  const { toast } = useToast()
  const [companies, setCompanies] = useState<AdminCompany[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await getCompanies()
        setCompanies(normalizeCompanies(res))
      } catch (e: any) {
        toast({
          variant: "destructive",
          description: e?.response?.data?.message || "Failed to load companies",
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredCompanies = useMemo(() => {
    if (selectedStatus === "all") return companies
    return companies.filter((c) => c.status === selectedStatus)
  }, [companies, selectedStatus])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Filter by status:</span>
          <Select
            value={selectedStatus}
            onValueChange={(val) => setSelectedStatus(val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Companies Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="px-4 py-3 text-left font-medium">Company Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Registration Date</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Profile</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {filteredCompanies.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No companies found for{" "}
                  <span className="font-medium">{selectedStatus}</span>.
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company) => (
                <tr key={company._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{company.companyName}</td>
                  <td className="px-4 py-3">{company.email}</td>
                  <td className="px-4 py-3">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        company.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : company.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : company.status === "disabled"
                          ? "bg-yellow-100 text-yellow-800"
                          : company.status === "deleted"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {company.status || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {company.profileCompletionStatus || "incomplete"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/admin/companies/${company._id}`}
                      className="inline-flex items-center rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
