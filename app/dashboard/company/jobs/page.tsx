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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Power, Loader2 } from "lucide-react";

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
    return Boolean(
      job.isExpired || (typeof job.remainingDays === "number" && job.remainingDays <= 0)
    );
  };

  const handleToggleStatus = async (job: Job) => {
    setTogglingId(job._id);
    try {
      const nextActive = isJobInactive(job);
      await toggleCompanyJobStatus(job._id, nextActive);
      setJobs((prev) =>
        prev.map((j) =>
          j._id === job._id
            ? { ...j, isActive: nextActive, isExpired: false, remainingDays: j.remainingDays }
            : j
        )
      );
      toast({ title: nextActive ? "Job activated" : "Job deactivated" });
    } catch (e: any) {
      toast({
        title: "Failed to toggle status",
        description: e?.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const renderTable = (data: Job[]) => {
    if (data.length === 0) {
      return (
        <div className="text-gray-500 text-center p-8">
          No jobs found in this category.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
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
            {data.map((job) => {
              const inactive = isJobInactive(job);
              return (
                <TableRow key={job._id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.employmentType || "N/A"}</TableCell>
                  <TableCell>{job.category || "N/A"}</TableCell>
                  <TableCell>
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    {job.applicationDeadline
                      ? new Date(job.applicationDeadline).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {inactive ? (
                      <Badge variant="secondary">Draft</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700">Published</Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(job._id)}
                      className="flex items-center gap-1"
                    >
                      <Pencil size={14} />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(job)}
                      disabled={togglingId === job._id}
                      className="flex items-center gap-1"
                    >
                      {togglingId === job._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Power size={14} />
                      )}
                      {inactive ? "Activate" : "Deactivate"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(job._id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (loading) return <div className="p-6">Loading...</div>;

  const publishedJobs = jobs.filter((job) => !isJobInactive(job));
  const draftJobs = jobs.filter((job) => isJobInactive(job));

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Posted Jobs</h1>

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
                    toast({ title: "Job deleted", description: "The job has been removed." });
                  } catch (e: any) {
                    toast({
                      title: "Failed to delete job",
                      description: e?.response?.data?.message || "Please try again.",
                      variant: "destructive",
                    });
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

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 bg-white shadow-sm p-1 rounded-lg">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All
              <Badge variant="outline">{jobs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="published" className="flex items-center gap-2">
              Published
              <Badge variant="outline">{publishedJobs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="draft" className="flex items-center gap-2">
              Draft
              <Badge variant="outline">{draftJobs.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">{renderTable(jobs)}</TabsContent>
          <TabsContent value="published">{renderTable(publishedJobs)}</TabsContent>
          <TabsContent value="draft">{renderTable(draftJobs)}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
