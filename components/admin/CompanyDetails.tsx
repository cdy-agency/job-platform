"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  getCompanyById,
  approveCompanyProfile,
  rejectCompanyProfile,
  disableCompany,
  enableCompany,
  deleteCompany,
} from '@/lib/api/admin'

interface CompanyDoc {
  url: string
  name: string
  format?: string
}

interface CompanyDetailsData {
  _id: string
  companyName: string
  email: string
  createdAt: string
  about?: string
  status?: string
  profileCompletionStatus?: string
  documents?: CompanyDoc[]
}

const extractCompany = (payload: any): CompanyDetailsData | null => {
  if (!payload) return null
  if (payload?.company) return payload.company
  if (payload?.data?.company) return payload.data.company
  if (payload?._id || payload?.id) return payload
  return null
}

const getErrorMessage = (e: any): string => {
  const msg = e?.response?.data?.message || e?.message
  if (typeof e?.response?.data === 'string') return e.response.data
  return msg
}

export default function CompanyDetails({ companyId }: { companyId: string }) {
  const router = useRouter()
  const [company, setCompany] = useState<CompanyDetailsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false)
  const [rejectionReason, setRejectionReason] = useState<string>("")

  const load = async () => {
    try {
      setLoading(true)
      const res = await getCompanyById(companyId)
      setCompany(extractCompany(res))
    } catch (e: any) {
      toast.error(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  const statusBadge = useMemo(() => {
    const label = company?.status || company?.profileCompletionStatus || 'pending'
    return (
      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
        {label}
      </span>
    )
  }, [company])

  const onApprove = async () => {
    try {
      setActionLoading(true)
      await approveCompanyProfile(companyId)
      toast.success('Approved successfully')
      await load()
    } catch (e: any) {
      toast.error(getErrorMessage(e))
    } finally {
      setActionLoading(false)
    }
  }

  const onReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    try {
      setActionLoading(true)
      await rejectCompanyProfile(companyId, rejectionReason)
      toast.success('Rejected successfully')
      setRejectModalOpen(false)
      setRejectionReason('')
      await load()
    } catch (e: any) {
      toast.error(getErrorMessage(e))
    } finally {
      setActionLoading(false)
    }
  }

  const onDisable = async () => {
    try {
      setActionLoading(true)
      await disableCompany(companyId)
      toast.success('Company disabled')
      await load()
    } catch (e: any) {
      toast.error(getErrorMessage(e))
    } finally {
      setActionLoading(false)
    }
  }

  const onEnable = async () => {
    try {
      setActionLoading(true)
      await enableCompany(companyId)
      toast.success('Company enabled')
      await load()
    } catch (e: any) {
      toast.error(getErrorMessage(e))
    } finally {
      setActionLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setActionLoading(true)
      await deleteCompany(companyId)
      toast.success('Company deleted')
      router.push('/dashboard/admin/companies')
    } catch (e: any) {
      toast.error(getErrorMessage(e))
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!company) {
    return <div className="text-sm text-red-600">Unable to load company details.</div>
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{company.companyName}</h1>
            <p className="text-sm text-gray-600">{company.email}</p>
            <p className="text-xs text-gray-500 mt-1">Registered: {new Date(company.createdAt).toLocaleDateString()}</p>
          </div>
          <div>{statusBadge}</div>
        </div>

        {company.about && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">About</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{company.about}</p>
          </div>
        )}

        {Array.isArray(company.documents) && company.documents.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {company.documents.map((doc, idx) => (
                <a
                  key={idx}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 p-3 text-sm text-purple-700 hover:text-purple-800"
                >
                  <span className="truncate mr-2">{doc.name}</span>
                  <span className="text-xs">{(doc.format || '').toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onApprove}
            disabled={actionLoading}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => setRejectModalOpen(true)}
            disabled={actionLoading}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            Reject
          </button>
          <button
            onClick={onDisable}
            disabled={actionLoading}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            Disable
          </button>
          <button
            onClick={onEnable}
            disabled={actionLoading}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            Enable
          </button>
          <button
            onClick={onDelete}
            disabled={actionLoading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <h4 className="text-lg font-semibold text-gray-900">Reject Company Profile</h4>
            <p className="mt-1 text-sm text-gray-600">Please enter a reason for rejection.</p>
            <textarea
              className="mt-4 w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={onReject}
                disabled={actionLoading}
                className="flex-1 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                Submit
              </button>
              <button
                onClick={() => setRejectModalOpen(false)}
                disabled={actionLoading}
                className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}