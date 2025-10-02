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
import { Pencil, Trash2, Power, Loader2 } from "lucide-react";
import router from "next/router";

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [matchedEmployees, setMatchedEmployees] = useState<Record<string, Employee[]>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const list = await fetchCompanyJobs();
        setJobs(list || []);
        for (const job of list || []) {
          fetchMatchedEmployeesForJob(job._id).then((emps) => {
            setMatchedEmployees((prev) => ({ ...prev, [job._id]: emps }));
          });
        }
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
    router.push(`/dashboard/company/post-job?edit=${id}`);
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

  const handleSendWorkRequest = async (employeeId: string, jobId: string) => {
    setSending(employeeId + jobId);
    try {
      await sendWorkRequest(employeeId);
      toast({ title: "Work request sent" });
    } catch (e) {
      toast({ title: "Failed to send work request", variant: "destructive" });
    } finally {
      setSending(null);
    }
  };

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const renderMatchedEmployees = (jobId: string) => {
    const employees = matchedEmployees[jobId] || [];
    
    if (!employees.length) {
      return (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">No matched employees for this job.</div>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="mb-3">
          <span className="font-medium text-purple-700">
            Matched Employees ({employees.length})
          </span>
        </div>

        <div className="flex flex-wrap gap-4">
          {employees.map((emp) => (
            <div
              key={emp._id || emp.id}
              className="border rounded-lg p-3 bg-white shadow-sm min-w-[200px] max-w-[220px] cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedEmployee({ ...emp, jobId })}
            >
              {/* Only Image, Name, Email */}
              <div className="flex items-center gap-3">
                <img
                  src={emp.profileImage?.url || "/placeholder.svg"}
                  alt={emp.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">{emp.name}</div>
                  <div className="text-xs text-gray-600 truncate">{emp.email}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTable = (data: Job[]) => {
    if (data.length === 0) {
      return <div className="text-gray-500 text-center p-8">No jobs found in this category.</div>;
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
                <React.Fragment key={job._id}>
                  <TableRow>
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
                        className="flex items-center gap-1 text-red-600"
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                  <tr>
                    <td colSpan={7} className="px-6 py-3">
                      {renderMatchedEmployees(job._id)}
                    </td>
                  </tr>
                </React.Fragment>
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
                    toast({
                      title: "Job deleted",
                      description: "The job has been removed.",
                    });
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
              All <Badge variant="outline">{jobs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="published" className="flex items-center gap-2">
              Published <Badge variant="outline">{publishedJobs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="draft" className="flex items-center gap-2">
              Draft <Badge variant="outline">{draftJobs.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">{renderTable(jobs)}</TabsContent>
          <TabsContent value="published">{renderTable(publishedJobs)}</TabsContent>
          <TabsContent value="draft">{renderTable(draftJobs)}</TabsContent>
        </Tabs>
      </div>

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
              <p>
                <strong>Phone:</strong> {selectedEmployee.phoneNumber || "—"}
              </p>
              <p>
                <strong>Location:</strong> {selectedEmployee.province}, {selectedEmployee.district}
              </p>
              <p>
                <strong>Gender:</strong> {selectedEmployee.gender || "—"}
              </p>
              <p>
                <strong>Date of Birth:</strong> {selectedEmployee.dateOfBirth ? new Date(selectedEmployee.dateOfBirth).toLocaleDateString() : "—"}
              </p>
              <p>
                <strong>Skills:</strong>{" "}
                {selectedEmployee.skills?.join(", ") || "—"}
              </p>
              {selectedEmployee.jobPreferences && selectedEmployee.jobPreferences.length > 0 && (
                <p>
                  <strong>Job Preferences:</strong>{" "}
                  {selectedEmployee.jobPreferences.map(pref => pref.replace('-', ' ')).join(", ")}
                </p>
              )}
              <p>
                <strong>About:</strong>{" "}
                {selectedEmployee.about || "—"}
              </p>
              <p>
                <strong>Education:</strong>{" "}
                {selectedEmployee.education || "—"}
              </p>
              <p>
                <strong>Experience:</strong>{" "}
                {selectedEmployee.experience || "—"}
              </p>
              {selectedEmployee.documents?.length ? (
                <div>
                  <strong>Documents:</strong>
                  <ul className="list-disc ml-5">
                    {selectedEmployee.documents.map((doc, i) => (
                      <li key={i}>
                        <a
                          href={doc.url}
                          target="_blank"
                          className="text-purple-600 underline"
                        >
                          {doc.name}.{doc.format}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
              Close
            </Button>
            {selectedEmployee && (
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => {
                  const empId = selectedEmployee._id || selectedEmployee.id || "";
                  const jobId = selectedEmployee.jobId || "";
                  handleSendWorkRequest(empId, jobId);
                }}
                disabled={sending === (selectedEmployee._id || selectedEmployee.id) + (selectedEmployee.jobId || "")}
              >
                {sending === (selectedEmployee._id || selectedEmployee.id) + (selectedEmployee.jobId || "") ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send Work Request"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}