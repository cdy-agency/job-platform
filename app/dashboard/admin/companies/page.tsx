"use client"

import { useState, useEffect } from "react"
import { Check, Eye, Trash2, X, Power, PowerOff, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// Import your API functions
import { 
  approveCompany, 
  rejectCompany, 
  disableCompany, 
  enableCompany, 
  deleteCompany 
} from "@/lib/api"
// You'll also need to import your api instance
import { api } from "@/lib/axiosInstance" // Adjust this import based on your api setup

interface Company {
  _id: string
  id?: string // Keep for backward compatibility
  companyName: string
  email: string
  registeredAt: string
  status: "pending" | "approved" | "rejected" | "disabled" | "deleted"
  isApproved?: boolean
  isActive?: boolean
  rejectionReason?: string
}

export default function ManageCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  // Dialog states
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; companyId: string | null; companyName: string }>({ open: false, companyId: null, companyName: '' })
  const [rejectionReason, setRejectionReason] = useState("")
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; companyId: string | null; companyName: string }>({ open: false, companyId: null, companyName: '' })
  const [disableDialog, setDisableDialog] = useState<{ open: boolean; companyId: string | null; companyName: string }>({ open: false, companyId: null, companyName: '' })

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      // Replace '/admin/companies' with your actual endpoint
      const response = await api.get('/admin/companies')
      
      // Log the response to debug the data structure
      console.log('API Response:', response.data)
      
      // Ensure we have an array - adjust based on your API response structure
      const companiesData = Array.isArray(response.data) 
        ? response.data 
        : response.data.companies || response.data.data || []
      
      setCompanies(companiesData)
    } catch (error) {
      console.error('Failed to fetch companies:', error)
      // Set empty array on error to prevent filter issues
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const filteredCompanies = Array.isArray(companies) ? companies.filter((comp) => {
    const companyName = comp.companyName || ''
    const email = comp.email || ''
    const status = comp.status || ''
    
    return companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           status.toLowerCase().includes(searchTerm.toLowerCase())
  }) : []

  // Helper function to get company ID
  const getCompanyId = (company: Company) => company._id || company.id || '';

  const handleApproveCompany = async (companyId: string) => {
    try {
      setActionLoading(companyId)
      await approveCompany(companyId)
      
      // Update the local state to reflect the approval
      setCompanies(prevCompanies =>
        prevCompanies.map(company =>
          getCompanyId(company) === companyId
            ? { ...company, status: "approved", isApproved: true, isActive: true }
            : company
        )
      )
      
      toast.success('Company approved successfully')
    } catch (error) {
      console.error('Failed to approve company:', error)
      toast.error('Failed to approve company')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectCompany = async (companyId: string) => {
    try {
      setActionLoading(companyId)
      await rejectCompany(companyId, rejectionReason)
      
      // Update the local state to reflect the rejection
      setCompanies(prevCompanies =>
        prevCompanies.map(company =>
          getCompanyId(company) === companyId
            ? { ...company, status: "rejected", isApproved: false, isActive: false, rejectionReason }
            : company
        )
      )
      
      setRejectDialog({ open: false, companyId: null, companyName: '' })
      setRejectionReason("")
      toast.success('Company rejected successfully')
    } catch (error) {
      console.error('Failed to reject company:', error)
      toast.error('Failed to reject company')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDisableCompany = async (companyId: string) => {
    try {
      setActionLoading(companyId)
      await disableCompany(companyId)
      
      // Update the local state to reflect the disable
      setCompanies(prevCompanies =>
        prevCompanies.map(company =>
          getCompanyId(company) === companyId
            ? { ...company, status: "disabled", isActive: false }
            : company
        )
      )
      
      setDisableDialog({ open: false, companyId: null, companyName: '' })
      toast.success('Company disabled successfully')
    } catch (error) {
      console.error('Failed to disable company:', error)
      toast.error('Failed to disable company')
    } finally {
      setActionLoading(null)
    }
  }

  const handleEnableCompany = async (companyId: string) => {
    try {
      setActionLoading(companyId)
      await enableCompany(companyId)
      
      // Update the local state to reflect the enable
      setCompanies(prevCompanies =>
        prevCompanies.map(company =>
          getCompanyId(company) === companyId
            ? { 
                ...company, 
                status: company.isApproved ? "approved" : "pending", 
                isActive: true 
              }
            : company
        )
      )
      
      toast.success('Company enabled successfully')
    } catch (error) {
      console.error('Failed to enable company:', error)
      toast.error('Failed to enable company')
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewCompany = (companyId: string) => {
    // TODO: Implement view company functionality
    console.log('View company:', companyId)
  }

  const handleDeleteCompany = async (companyId: string) => {
    try {
      setActionLoading(companyId)
      await deleteCompany(companyId)
      
      // Remove from local state
      setCompanies(prevCompanies =>
        prevCompanies.filter(company => getCompanyId(company) !== companyId)
      )
      
      setDeleteDialog({ open: false, companyId: null, companyName: '' })
      toast.success('Company deleted successfully')
    } catch (error) {
      console.error('Failed to delete company:', error)
      toast.error('Failed to delete company')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "disabled":
        return "bg-gray-100 text-gray-800"
      case "deleted":
        return "bg-red-200 text-red-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusDisplay = (company: Company) => {
    if (company.status === "deleted") return "Deleted"
    if (company.status === "disabled") return "Disabled"
    if (company.status === "rejected") return "Rejected"
    if (company.status === "approved") return "Approved"
    return "Pending"
  }

  if (loading) {
    return (
      <div className="container max-w-7xl p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading companies...</div>
        </div>
      </div>
    )
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
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">Registered On</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="whitespace-nowrap px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((comp, index) => (
                <tr key={comp._id || `company-${index}`} className="hover:bg-gray-50 text-black">
                  <td className="whitespace-nowrap px-4 py-3">{comp.companyName || 'N/A'}</td>
                  <td className="whitespace-nowrap px-4 py-3">{comp.email || 'N/A'}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {comp.registeredAt ? new Date(comp.registeredAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(comp.status || 'Unknown')}`}>
                      {getStatusDisplay(comp)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center space-x-2">
                    {/* Pending companies - Show Approve/Reject */}
                    {(comp.status === "pending") && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-100 bg-white"
                          aria-label={`Approve ${comp.companyName}`}
                          onClick={() => handleApproveCompany(getCompanyId(comp))}
                          disabled={actionLoading === getCompanyId(comp)}
                        >
                          {actionLoading === getCompanyId(comp) ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-100 bg-white"
                          aria-label={`Reject ${comp.companyName}`}
                          onClick={() => setRejectDialog({ open: true, companyId: getCompanyId(comp), companyName: comp.companyName || 'Unknown' })}
                          disabled={actionLoading === getCompanyId(comp)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {/* Approved companies - Show Disable */}
                    {(comp.status === "approved") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-yellow-600 border-yellow-600 hover:bg-yellow-100 bg-white"
                        aria-label={`Disable ${comp.companyName}`}
                        onClick={() => setDisableDialog({ open: true, companyId: getCompanyId(comp), companyName: comp.companyName || 'Unknown' })}
                        disabled={actionLoading === getCompanyId(comp)}
                      >
                        <PowerOff className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Disabled companies - Show Enable */}
                    {(comp.status === "disabled") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-100 bg-white"
                        aria-label={`Enable ${comp.companyName}`}
                        onClick={() => handleEnableCompany(getCompanyId(comp))}
                        disabled={actionLoading === getCompanyId(comp)}
                      >
                        {actionLoading === getCompanyId(comp) ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    {/* View button for all companies */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-indigo-600 border-indigo-600 hover:bg-indigo-100 bg-white"
                      aria-label={`View ${comp.companyName}`}
                      onClick={() => handleViewCompany(getCompanyId(comp))}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* Delete button for all companies except deleted ones */}
                    {comp.status !== "deleted" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-100 bg-white"
                        aria-label={`Delete ${comp.companyName}`}
                        onClick={() => setDeleteDialog({ open: true, companyId: getCompanyId(comp), companyName: comp.companyName || 'Unknown' })}
                        disabled={actionLoading === getCompanyId(comp)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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

      {/* Reject Company Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ ...rejectDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Reject Company
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to reject <strong>{rejectDialog.companyName}</strong>? 
              Please provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialog({ open: false, companyId: null, companyName: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => rejectDialog.companyId && handleRejectCompany(rejectDialog.companyId)}
              disabled={!rejectionReason.trim() || actionLoading === rejectDialog.companyId}
            >
              {actionLoading === rejectDialog.companyId ? 'Rejecting...' : 'Reject Company'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable Company Dialog */}
      <Dialog open={disableDialog.open} onOpenChange={(open) => setDisableDialog({ ...disableDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PowerOff className="h-5 w-5 text-yellow-500" />
              Disable Company
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to disable <strong>{disableDialog.companyName}</strong>? 
              They will not be able to access the platform until re-enabled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDisableDialog({ open: false, companyId: null, companyName: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => disableDialog.companyId && handleDisableCompany(disableDialog.companyId)}
              disabled={actionLoading === disableDialog.companyId}
            >
              {actionLoading === disableDialog.companyId ? 'Disabling...' : 'Disable Company'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Company Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Company
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete <strong>{deleteDialog.companyName}</strong>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, companyId: null, companyName: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog.companyId && handleDeleteCompany(deleteDialog.companyId)}
              disabled={actionLoading === deleteDialog.companyId}
            >
              {actionLoading === deleteDialog.companyId ? 'Deleting...' : 'Delete Company'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}