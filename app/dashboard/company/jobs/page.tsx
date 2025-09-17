"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCompanyJobs, deleteJob, toggleCompanyJobStatus } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface Job {
  _id: string;
  title: string;
  category?: string;
  employmentType?: string;
  createdAt?: string;
  applicationDeadline?: string;
  remainingDays?: number | null;
  isExpired?: boolean;
  isActive?: boolean;
}

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const list = await fetchCompanyJobs();
        setJobs(list || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, []);

  const handleDelete = (id: string) => {
    setJobToDelete(id);
    setConfirmOpen(true);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/company/jobs/${id}`);
  };

  const isJobInactive = (job: Job) => {
    if (job.isActive === false) return true;
    return Boolean(job.isExpired || (typeof job.remainingDays === 'number' && job.remainingDays <= 0));
  };

  const handleToggleStatus = async (job: Job) => {
    setTogglingId(job._id);
    try {
      const nextActive = isJobInactive(job);
      await toggleCompanyJobStatus(job._id, nextActive);
      setJobs(prev => prev.map(j => j._id === job._id ? { ...j, isActive: nextActive, isExpired: false, remainingDays: j.remainingDays } : j));
      toast({ title: nextActive ? 'Job activated' : 'Job deactivated' });
    } catch (e: any) {
      toast({ title: 'Failed to toggle status', description: e?.response?.data?.message || 'Please try again', variant: 'destructive' });
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Manage Posted Jobs
        </h1>

        {/* Delete Confirmation Dialog */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Job?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600">
              This will permanently delete the job and all its applications.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  if (!jobToDelete) return;
                  try {
                    await deleteJob(jobToDelete);
                    setJobs((prev) => prev.filter((j) => j._id !== jobToDelete));
                    toast({ title: "Job deleted", description: "The job has been removed." })
                  } catch (e: any) {
                    toast({ title: "Failed to delete job", description: e?.response?.data?.message || "Please try again.", variant: "destructive" })
                  } finally {
                    setConfirmOpen(false);
                    setJobToDelete(null);
                  }
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center">No jobs posted yet.</p>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => {
                  const inactive = isJobInactive(job);
                  return (
                    <TableRow key={job._id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.employmentType || "N/A"}</TableCell>
                      <TableCell>{job.category || "N/A"}</TableCell>
                      <TableCell>
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {job.applicationDeadline
                          ? new Date(job.applicationDeadline).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {inactive ? (
                          <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                            Inactive
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                            Active
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(job._id)}
                          className={`text-sm px-3 py-1 rounded-md border border-gray-300 text-[#834de3] hover:bg-[#834de3]/10`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(job)}
                          disabled={togglingId === job._id}
                          className={`text-sm px-3 py-1 rounded-md border ${inactive ? 'border-green-300 text-green-700 hover:bg-green-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                          {togglingId === job._id ? 'Saving...' : (inactive ? 'Activate' : 'Deactivate')}
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="text-sm px-3 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
