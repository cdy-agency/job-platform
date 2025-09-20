"use client";
// @ts-nocheck

import React, { useEffect, useMemo, useState } from "react";
import { AppAvatar } from "@/components/ui/avatar";
import { fetchCompanyJobs, fetchJobApplicants, updateApplicantStatus, sendWorkRequest } from "@/lib/api";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Applicant = {
  _id: string;
  employeeId: { name: string; email?: string; phoneNumber?: string } | string;
  jobId: { title: string } | string;
  status: "pending" | "reviewed" | "interview" | "hired" | "rejected";
  createdAt?: string;
};

export default function ManageApplicantsPage() {
  const [jobs, setJobs] = useState<Array<{ _id: string; title: string }>>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<"hired" | "rejected" | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "hired" | "rejected">("all");
  const [showOfferBox, setShowOfferBox] = useState(false);
  const [offerMessage, setOfferMessage] = useState("");
  const [offerSending, setOfferSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanyJobs()
      .then((res) => {
        const jobsList = Array.isArray(res?.jobs) ? res.jobs : Array.isArray(res) ? res : []
        const mapped = jobsList.map((j: any) => ({ _id: j._id, title: j.title }))
        setJobs(mapped)
        if (mapped[0]?._id) setSelectedJobId(mapped[0]._id)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedJobId) return
    setLoadingApplicants(true)
    fetchJobApplicants(selectedJobId)
      .then((list) => setApplicants(list || []))
      .finally(() => setLoadingApplicants(false))
  }, [selectedJobId])

  const openStatusModal = (app: Applicant, action: "hired" | "rejected") => {
    setSelected(app)
    setStatusAction(action)
    setStatusMessage("")
    setStatusModalOpen(true)
  }

  const submitStatusChange = async () => {
    if (!selected || !statusAction) return
    if (!statusMessage.trim()) {
      toast({ title: "Message is required", description: "Please write a message to the applicant.", variant: "destructive" })
      return
    }
    setStatusSubmitting(true)
    try {
      await updateApplicantStatus(selected._id, statusAction, statusMessage.trim())
      setApplicants((prev) => prev.map((a) => a._id === selected._id ? { ...a, status: statusAction } as Applicant : a))
      toast({ title: "Status updated", description: `Application marked as ${statusAction}.` })
      setStatusModalOpen(false)
      setViewOpen(false)
    } catch (e: any) {
      toast({ title: "Failed to update status", description: e?.response?.data?.message || "Please try again", variant: "destructive" })
    } finally {
      setStatusSubmitting(false)
    }
  }

  const handleSendOffer = async () => {
    if (!selected) return
    const employeeId = typeof selected.employeeId === 'object' ? (selected.employeeId as any)?._id || (selected.employeeId as any)?.id : selected.employeeId
    if (!employeeId) return toast({ title: "Missing employee id", description: "Cannot send offer.", variant: "destructive" })
    setOfferSending(true)
    try {
      await sendWorkRequest(String(employeeId), offerMessage || undefined)
      toast({ title: "Offer Sent", description: "Job offer has been sent successfully." })
      setOfferMessage("")
      setShowOfferBox(false)
    } catch (e: any) {
      toast({ title: "Failed to send offer", description: e?.response?.data?.message || "Try again", variant: "destructive" })
    } finally {
      setOfferSending(false)
    }
  }

  const selectedEmployee: any = useMemo(() => (selected && typeof selected.employeeId === 'object') ? selected.employeeId : null, [selected])
  const selectedResume: string | undefined = useMemo(() => (selected && (selected as any)?.resume) ? (selected as any).resume : undefined, [selected])

  // if (loading) return <div className="p-6">Loading...</div>

  const filteredApplicants = useMemo(() => {
    if (statusFilter === 'all') return applicants
    return applicants.filter((a) => a.status === statusFilter)
  }, [applicants, statusFilter])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Select Job</label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black"
          >
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>{j.title}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Filter by status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black max-w-xs"
          >
            <option value="all">All</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loadingApplicants ? (
          <p className="text-gray-500">Loading applicants...</p>
        ) : applicants.length === 0 ? (
          <p className="text-gray-500 text-center">No applicants found.</p>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 flex gap-3 items-start">
                  <AppAvatar image={(app as any)?.employeeId?.profileImage} name={typeof app.employeeId === 'object' ? app.employeeId.name : 'Applicant'} size={40} />
                  <div>
                  <h3 className="text-md font-semibold text-gray-900">{typeof app.employeeId === 'object' ? app.employeeId.name : 'Applicant'}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Applied for: <span className="font-medium">{typeof app.jobId === 'object' ? app.jobId.title : ''}</span>
                  </p>
                  {typeof app.employeeId === 'object' && (
                    <p className="text-xs text-gray-500">
                      Email: {app.employeeId.email || '—'} | Phone: {app.employeeId.phoneNumber || '—'}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Applied on: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                  </p>
                  {/* Application message & resume */}
                  {(app as any)?.message && (
                    <p className="text-xs text-gray-700 mt-2">Message: {(app as any).message}</p>
                  )}
                  {(app as any)?.resume && (
                    <a href={(app as any).resume} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline mt-1 inline-block">View Resume</a>
                  )}
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={() => { setSelected(app); setViewOpen(true); }}
                    className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    View
                  </button>
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      app.status === "hired"
                        ? "bg-green-100 text-green-800"
                        : app.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {app.status === 'hired' ? 'hired' : app.status === 'rejected' ? 'rejected' : 'pending'}
                  </span>

                  <div className="flex gap-2 flex-wrap justify-center">
                    {app.status !== "hired" && (
                      <button
                        onClick={() => openStatusModal(app, "hired")}
                        className="text-xs px-2 py-1 rounded border border-green-300 text-green-700 hover:bg-green-100"
                      >
                        Hire
                      </button>
                    )}

                    {app.status !== "rejected" && (
                      <button
                        onClick={() => openStatusModal(app, "rejected")}
                        className="text-xs px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-100"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selected && (
              <div className="flex gap-4">
                <AppAvatar image={selectedEmployee?.profileImage} name={selectedEmployee?.name || 'Applicant'} size={64} />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{selectedEmployee?.name || 'Applicant'}</div>
                  <div className="text-sm text-gray-600">{selectedEmployee?.email || '—'}{selectedEmployee?.phoneNumber ? ` • ${selectedEmployee.phoneNumber}` : ''}</div>
                  {selectedEmployee?.location && <div className="text-sm text-gray-600">{selectedEmployee.location}</div>}
                  {selectedEmployee?.about && (
                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{selectedEmployee.about}</p>
                  )}
                </div>
              </div>
            )}

            {/* Documents */}
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-2">Documents</div>
              <div className="space-y-1">
                {Array.isArray(selectedEmployee?.documents) && selectedEmployee.documents.length > 0 ? (
                  selectedEmployee.documents.map((doc: any, idx: number) => {
                    const url = typeof doc === 'string' ? doc : doc?.url;
                    const name = typeof doc === 'string' ? `Document ${idx + 1}` : (doc?.name || `Document ${idx + 1}`);
                    return (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 truncate pr-2">{name}</span>
                        {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#834de3] hover:underline">View</a>}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-sm text-gray-500">No documents available</div>
                )}
                {selectedResume && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Resume</span>
                    <a href={selectedResume} target="_blank" rel="noopener noreferrer" className="text-[#834de3] hover:underline">View</a>
                  </div>
                )}
              </div>
            </div>

            {selected?.status === 'rejected' && (
              <div className="border-t pt-4">
                {!showOfferBox ? (
                  <div className="text-center">
                    <Button onClick={() => setShowOfferBox(true)} className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2">Send Offer</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Write a short message..."
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      className="min-h-[80px] text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => { setShowOfferBox(false); setOfferMessage("") }} className="text-xs">Cancel</Button>
                      <Button onClick={handleSendOffer} disabled={offerSending} className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                        {offerSending ? "Sending..." : "Send"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            {selected && (
              <div className="flex gap-2">
                {selected.status !== 'hired' && (
                  <Button variant="default" onClick={() => { setViewOpen(true); openStatusModal(selected, 'hired') }}>Hire</Button>
                )}
                {selected.status !== 'rejected' && (
                  <Button onClick={() => { setViewOpen(true); openStatusModal(selected, 'rejected') }}>Reject</Button>
                )}
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hire/Reject Message Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{statusAction === 'hired' ? 'Send hire message' : 'Send rejection message'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Write a custom message that will be sent to the employee.</p>
            <Textarea
              placeholder={statusAction === 'hired' ? 'Congratulations ...' : 'We are very sorry ...'}
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              className="min-h-[120px] text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
            <Button onClick={submitStatusChange} disabled={statusSubmitting} className={statusAction === 'rejected' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-300'}>
              {statusSubmitting ? 'Sending...' : 'Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
