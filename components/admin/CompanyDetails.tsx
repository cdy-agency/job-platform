"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
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
  const { toast } = useToast()
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
      toast({ variant: 'destructive', description: getErrorMessage(e) })
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

  const isApproved = (company?.status === 'approved' || company?.isApproved === true)
  const isRejected = (company?.status === 'rejected')
  const isDisabled = (company?.status === 'disabled' || company?.isActive === false)
  const canApprove = !isApproved && !isRejected
  const canReject = !isApproved && !isRejected
  const canEnable = isApproved && isDisabled
  const canDisable = isApproved && !isDisabled
  const canDelete = true

  const onApprove = async () => {
    try {
      setActionLoading(true)
      await approveCompanyProfile(companyId)
      toast({ description: 'Approved successfully' })
      await load()
    } catch (e: any) {
      toast({ variant: 'destructive', description: getErrorMessage(e) })
    } finally {
      setActionLoading(false)
    }
  }

  const onReject = async () => {
    if (!rejectionReason.trim()) {
      toast({ variant: 'destructive', description: 'Please provide a rejection reason' })
      return
    }
    try {
      setActionLoading(true)
      await rejectCompanyProfile(companyId, rejectionReason)
      toast({ description: 'Rejected successfully' })
      setRejectModalOpen(false)
      setRejectionReason('')
      await load()
    } catch (e: any) {
      toast({ variant: 'destructive', description: getErrorMessage(e) })
    } finally {
      setActionLoading(false)
    }
  }

  const onDisable = async () => {
    try {
      setActionLoading(true)
      await disableCompany(companyId)
      toast({ description: 'Company disabled' })
      await load()
    } catch (e: any) {
      toast({ variant: 'destructive', description: getErrorMessage(e) })
    } finally {
      setActionLoading(false)
    }
  }

  const onEnable = async () => {
    try {
      setActionLoading(true)
      await enableCompany(companyId)
      toast({ description: 'Company enabled' })
      await load()
    } catch (e: any) {
      toast({ variant: 'destructive', description: getErrorMessage(e) })
    } finally {
      setActionLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setActionLoading(true)
      await deleteCompany(companyId)
      toast({ description: 'Company deleted' })
      router.push('/dashboard/admin/companies')
    } catch (e: any) {
      toast({ variant: 'destructive', description: getErrorMessage(e) })
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
            disabled={actionLoading || !canApprove}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 ${canApprove ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' : 'bg-gray-300 cursor-not-allowed'} disabled:opacity-50`}
            title={canApprove ? 'Approve this company' : 'Approval not available'}
          >
            Approve
          </button>
          <button
            onClick={() => setRejectModalOpen(true)}
            disabled={actionLoading || !canReject}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 ${canReject ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500' : 'bg-gray-300 cursor-not-allowed'} disabled:opacity-50`}
            title={canReject ? 'Reject this company' : 'Rejection not available'}
          >
            Reject
          </button>
          <button
            onClick={onDisable}
            disabled={actionLoading || !canDisable}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 ${canDisable ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' : 'bg-gray-300 cursor-not-allowed'} disabled:opacity-50`}
            title={canDisable ? 'Disable this company' : 'Disable only available on approved accounts'}
          >
            Disable
          </button>
          <button
            onClick={onEnable}
            disabled={actionLoading || !canEnable}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 ${canEnable ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' : 'bg-gray-300 cursor-not-allowed'} disabled:opacity-50`}
            title={canEnable ? 'Enable this company' : 'Enable only available when disabled'}
          >
            Enable
          </button>
          <button
            onClick={onDelete}
            disabled={actionLoading || !canDelete}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 ${canDelete ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-gray-300 cursor-not-allowed'} disabled:opacity-50`}
            title={'Delete this company'}
          >
            Delete
          </button>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          {isApproved && !isDisabled && (<p>Approved: you can Disable or Delete.</p>)}
          {isApproved && isDisabled && (<p>Disabled: you can Enable or Delete.</p>)}
          {isRejected && (<p>Rejected: you can Delete only.</p>)}
          {!isApproved && !isRejected && (<p>Pending: you can Approve or Reject.</p>)}
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