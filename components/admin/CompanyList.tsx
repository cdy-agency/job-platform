"use client"

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { getCompanies, disableCompany, enableCompany, deleteCompany } from '@/lib/api/admin'

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

export default function CompanyList() {
  const [companies, setCompanies] = useState<AdminCompany[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await getCompanies()
      setCompanies(normalizeCompanies(res))
    } catch (e: any) {
      toast.error(e?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const pendingReview = useMemo(
    () => companies.filter((c) => c.profileCompletionStatus === 'pending_review' && c.status === 'pending'),
    [companies]
  )

  const incomplete = useMemo(
    () => companies.filter((c) => c.profileCompletionStatus === 'incomplete'),
    [companies]
  )

  const approved = useMemo(
    () => companies.filter((c) => c.profileCompletionStatus === 'approved'),
    [companies]
  )

  const handleDisable = async (id: string) => {
    try {
      setActionLoadingId(id)
      await disableCompany(id)
      toast.success('Company disabled')
      await load()
    } catch (e: any) {
      toast.error(e?.response?.data?.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleEnable = async (id: string) => {
    try {
      setActionLoadingId(id)
      await enableCompany(id)
      toast.success('Company enabled')
      await load()
    } catch (e: any) {
      toast.error(e?.response?.data?.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setActionLoadingId(id)
      await deleteCompany(id)
      toast.success('Company deleted')
      await load()
    } catch (e: any) {
      toast.error(e?.response?.data?.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-10">
        {["Pending Review", "Incomplete", "Completed / Approved"].map((section) => (
          <div key={section} className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4">
              <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
              <div className="mt-2 h-4 w-64 rounded bg-gray-100 animate-pulse" />
            </div>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-10 w-full rounded bg-gray-100 animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Pending Review</h2>
          <p className="text-sm text-gray-600">Profiles completed and awaiting admin review</p>
        </div>
        {pendingReview.length === 0 ? (
          <div className="text-sm text-gray-600">No companies pending review.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="px-4 py-3 text-left font-medium">Company Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Registration Date</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {pendingReview.map((company) => (
                  <tr key={company._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{company.companyName}</td>
                    <td className="px-4 py-3">{company.email}</td>
                    <td className="px-4 py-3">{new Date(company.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        {company.status || 'pending'}
                      </span>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Incomplete</h2>
          <p className="text-sm text-gray-600">Profiles missing required documents</p>
        </div>
        {incomplete.length === 0 ? (
          <div className="text-sm text-gray-600">No incomplete company profiles.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="px-4 py-3 text-left font-medium">Company Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Registration Date</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {incomplete.map((company) => (
                  <tr key={company._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{company.companyName}</td>
                    <td className="px-4 py-3">{company.email}</td>
                    <td className="px-4 py-3">{new Date(company.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        {company.profileCompletionStatus || 'incomplete'}
                      </span>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Completed / Approved</h2>
          <p className="text-sm text-gray-600">Companies with approved profiles. Manage availability or remove.</p>
        </div>
        {approved.length === 0 ? (
          <div className="text-sm text-gray-600">No approved companies.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="px-4 py-3 text-left font-medium">Company Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Registration Date</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {approved.map((company) => {
                  const isDisabled = company.status === 'disabled'
                  return (
                    <tr key={company._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{company.companyName}</td>
                      <td className="px-4 py-3">{company.email}</td>
                      <td className="px-4 py-3">{new Date(company.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          isDisabled ? 'bg-gray-200 text-gray-700' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {isDisabled ? 'Disabled' : 'Approved'}
                        </span>
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <Link
                          href={`/dashboard/admin/companies/${company._id}`}
                          className="inline-flex items-center rounded-md bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100"
                        >
                          View
                        </Link>
                        {isDisabled ? (
                          <button
                            onClick={() => handleEnable(company._id)}
                            disabled={actionLoadingId === company._id}
                            className="inline-flex items-center rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                          >
                            {actionLoadingId === company._id ? 'Enabling...' : 'Enable'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDisable(company._id)}
                            disabled={actionLoadingId === company._id}
                            className="inline-flex items-center rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                          >
                            {actionLoadingId === company._id ? 'Disabling...' : 'Disable'}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(company._id)}
                          disabled={actionLoadingId === company._id}
                          className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {actionLoadingId === company._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}