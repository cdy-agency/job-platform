"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchCompanyJobs,
  deleteJob,
  toggleCompanyJobStatus,
  fetchMatchedEmployeesForJob,
  sendWorkRequest,
} from "@/lib/api";
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
import {
  Pencil,
  Trash2,
  Power,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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

interface Employee {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: { url?: string };
  province?: string;
  district?: string;
  skills?: string[];
  about?: string;
  education?: string;
  experience?: string;
  documents?: { url: string; name: string; format: string }[];
  dateOfBirth?: string;
  gender?: string;
  jobPreferences?: string[];
  jobId?: string;
}

export default function ManageJobsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [matchedEmployees, setMatchedEmployees] = useState<Record<string, Employee[]>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await fetchCompanyJobs();
        setJobs(list || []);
        for (const job of list || []) {
          fetchMatchedEmployeesForJob(job._id).then((emps) => {
            setMatchedEmployees((prev) => ({ ...prev, [job._id]: emps }));
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (id: string) => {
    setJobToDelete(id);
    setConfirmOpen(true);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/company/post-job?edit=${id}`);
  };

  const isJobInactive = (job: Job) =>
    job.isActive === false || job.isExpired || (job.remainingDays ?? 1) <= 0;

  const handleToggleStatus = async (job: Job) => {
    setTogglingId(job._id);
    try {
      const nextActive = isJobInactive(job);
      await toggleCompanyJobStatus(job._id, nextActive);
      setJobs((prev) =>
        prev.map((j) =>
          j._id === job._id ? { ...j, isActive: nextActive, isExpired: false } : j
        )
      );
      toast({ title: nextActive ? "Job activated" : "Job deactivated" });
    } catch {
      toast({
        title: "Failed to toggle status",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleSendWorkRequest = async (employeeId: string, jobId: string) => {
    setSending(employeeId + jobId);
    try {
      await sendWorkRequest(employeeId);
      toast({ title: "Work request sent" });
    } catch {
      toast({ title: "Failed to send work request", variant: "destructive" });
    } finally {
      setSending(null);
    }
  };

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobs((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const renderMatchedEmployees = (jobId: string) => {
    const employees = matchedEmployees[jobId] || [];
    if (!employees.length)
      return <p className="text-sm text-gray-500">No matched employees found.</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
        {employees.map((emp) => (
          <div
            key={emp._id || emp.id}
            className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm hover:shadow-md cursor-pointer"
            onClick={() => setSelectedEmployee({ ...emp, jobId })}
          >
            <img
              src={emp.profileImage?.url || "/placeholder.svg"}
              alt={emp.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
            <div className="min-w-0">
              <p className="font-medium text-gray-800 truncate">{emp.name}</p>
              <p className="text-sm text-gray-600 truncate">{emp.email}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTable = (data: Job[]) => (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
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
            const expanded = expandedJobs[job._id];
            return (
              <React.Fragment key={job._id}>
                <TableRow
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleJobExpansion(job._id)}
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {job.title}
                  </TableCell>
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
                      <Badge variant="secondary">Draft</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700">
                        Published
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(job._id);
                      }}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(job);
                      }}
                      disabled={togglingId === job._id}
                    >
                      {togglingId === job._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Power size={14} />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(job._id);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>

                {expanded && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-gray-50">
                      {renderMatchedEmployees(job._id)}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  const publishedJobs = jobs.filter((job) => !isJobInactive(job));
  const draftJobs = jobs.filter((job) => isJobInactive(job));

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Job Dashboard</h1>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 bg-white shadow-sm rounded-lg">
            <TabsTrigger value="all">
              All <Badge variant="outline">{jobs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="published">
              Published <Badge variant="outline">{publishedJobs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft <Badge variant="outline">{draftJobs.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">{renderTable(jobs)}</TabsContent>
          <TabsContent value="published">{renderTable(publishedJobs)}</TabsContent>
          <TabsContent value="draft">{renderTable(draftJobs)}</TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            This will permanently delete the job and its related data.
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
                  toast({ title: "Job deleted successfully" });
                } catch {
                  toast({
                    title: "Failed to delete job",
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

      {/* Employee Details Modal */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmployee.profileImage?.url || "/placeholder.svg"}
                  alt={selectedEmployee.name}
                  className="w-16 h-16 rounded-full border object-cover"
                />
                <div>
                  <p className="font-semibold">{selectedEmployee.name}</p>
                  <p className="text-gray-500">{selectedEmployee.email}</p>
                </div>
              </div>
              <p><strong>Phone:</strong> {selectedEmployee.phoneNumber || "—"}</p>
              <p><strong>Location:</strong> {selectedEmployee.province}, {selectedEmployee.district}</p>
              <p><strong>Skills:</strong> {selectedEmployee.skills?.join(", ") || "—"}</p>
              <p><strong>About:</strong> {selectedEmployee.about || "—"}</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
                  Close
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    const empId = selectedEmployee._id || selectedEmployee.id || "";
                    const jobId = selectedEmployee.jobId || "";
                    handleSendWorkRequest(empId, jobId);
                  }}
                  disabled={
                    sending ===
                    (selectedEmployee._id || selectedEmployee.id) +
                      (selectedEmployee.jobId || "")
                  }
                >
                  {sending ===
                  (selectedEmployee._id || selectedEmployee.id) +
                    (selectedEmployee.jobId || "")
                    ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      "Send offer"
                    )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
