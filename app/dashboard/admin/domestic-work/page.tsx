"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  Eye,
  Trash2,
} from "lucide-react";
import {
  fetchAllEmployers,
  fetchAllHousekeepers,
  updateEmployerStatus,
  updateHousekeeperStatus,
  deleteEmployer,
  deleteHousekeeper,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "@radix-ui/react-dialog";

type Employer = {
  _id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  nationalId: string;
  location: {
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
  }
  salary: number;
  profileImage?: { url: string };
  status: "pending" | "active" | "completed";
};

type Housekeeper = {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female";
  idNumber: string;
  phoneNumber: string;
  salary: string;
  location: {
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
  };
  passportImage?: { url: string };
  status: "available" | "hired" | "inactive";
};

export default function AdminDomesticWorkDashboardTable() {
  const [view, setView] = useState<"employers" | "housekeepers">("employers");
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [housekeepers, setHousekeepers] = useState<Housekeeper[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { toast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "employer" | "housekeeper" } | null>(null);

  useEffect(() => {
    loadData();
  }, [view]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (view === "employers") {
        const res = await fetchAllEmployers();
        setEmployers(res.employers || []);
      } else {
        const res = await fetchAllHousekeepers();
        setHousekeepers(res.housekeepers || []);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    status: string,
    type: "employer" | "housekeeper"
  ) => {
    try {
      setActionLoading(id);
      if (type === "employer") {
        await updateEmployerStatus(id, status as any);
        setEmployers((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: status as any } : p))
        );
      } else {
        await updateHousekeeperStatus(id, status as any);
        setHousekeepers((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: status as any } : p))
        );
      }
      toast({ title: "Success", description: "Status updated successfully" });
    } catch (err) {
      console.error("Status update error:", err);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, type: "employer" | "housekeeper") => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      setActionLoading(id);
      if (type === "employer") {
        await deleteEmployer(id);
        setEmployers((prev) => prev.filter((p) => p._id !== id));
      } else {
        await deleteHousekeeper(id);
        setHousekeepers((prev) => prev.filter((p) => p._id !== id));
      }
      toast({ title: "Deleted", description: "Record deleted successfully" });
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
      case "available":
        return "bg-green-100 text-green-800";
      case "completed":
      case "hired":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Domestic Work Dashboard
          </h1>
          <p className="text-gray-600 text-sm">
            Manage employers and housekeepers in a clean table view.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={view} onValueChange={(v: any) => setView(v)} className="mb-4">
          <TabsList className="grid grid-cols-2 bg-gray-100 rounded-lg p-1">
            <TabsTrigger
              value="employers"
              className="flex items-center justify-center gap-2"
            >
              <Building className="h-4 w-4" /> Employers ({employers.length})
            </TabsTrigger>
            <TabsTrigger
              value="housekeepers"
              className="flex items-center justify-center gap-2"
            >
              <Users className="h-4 w-4" /> Housekeepers ({housekeepers.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Profile
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Contact / Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Extra Info
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {loading
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-2 w-48">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Skeleton className="h-4 w-40" />
                        </td>
                        <td className="px-4 py-4">
                          <Skeleton className="h-4 w-28" />
                        </td>
                        <td className="px-4 py-4">
                          <Skeleton className="h-6 w-20 rounded" />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Skeleton className="h-8 w-20 rounded" />
                        </td>
                      </tr>
                    ))
                  : view === "employers"
                  ? employers.map((emp) => (
                      <tr key={emp._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 align-top">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                              {emp.profileImage?.url ? (
                                <img
                                  src={emp.profileImage.url}
                                  alt={emp.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-semibold text-white bg-purple-500">
                                  {emp.name?.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {emp.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {emp.nationalId}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{emp.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {emp.location.village}, {emp.location.district}
                            </span>
                          </div>
                          {emp.email && (
                            <div className="flex items-center gap-2 mt-1">
                              <Mail className="h-4 w-4" />
                              <span className="truncate max-w-[12rem]">
                                {emp.email}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          <div>
                            Salary: {emp.salary} RWF
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <Badge
                            className={`text-xs ${getStatusColor(emp.status)}`}
                          >
                            {emp.status}
                          </Badge>
                        </td>

                        <td className="py-4 text-right space-x-2">

                          <div className="flex gap-2 items-center">
                            <Link
                            href={`/dashboard/admin/domestic-work/${emp._id}?type=employer`}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="inline-flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </Link>

                            <select
                            value={emp.status}
                            onChange={(e) =>
                              handleStatusUpdate(emp._id, e.target.value, "employer")
                            }
                            disabled={actionLoading === emp._id}
                            className="px-2 py-1 text-xs border rounded"
                          >
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                          </select>

                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 flex items-center"
                            onClick={() => setDeleteTarget({ id: emp._id, type: "employer" })}
                            disabled={actionLoading === emp._id}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                          </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : housekeepers.map((hk) => (
                      <tr key={hk._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 align-top">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                              {hk.passportImage?.url ? (
                                <img
                                  src={hk.passportImage.url}
                                  alt={hk.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-semibold text-white bg-blue-500">
                                  {hk.fullName?.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {hk.fullName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {hk.idNumber}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{hk.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {hk.location.village}, {hk.location.district}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          Gender: {hk.gender}
                        </td>

                        <td className="px-4 py-4">
                          <Badge
                            className={`text-xs ${getStatusColor(hk.status)}`}
                          >
                            {hk.status}
                          </Badge>
                        </td>

                        <td className="px-4 py-4 text-right space-x-2 items-center">
                          <div className="flex items-center gap-3">
                            <Link
                            href={`/dashboard/admin/domestic-work/${hk._id}?type=housekeeper`}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="inline-flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </Link>

                          <select
                            value={hk.status}
                            onChange={(e) =>
                              handleStatusUpdate(hk._id, e.target.value, "housekeeper")
                            }
                            disabled={actionLoading === hk._id}
                            className="px-2 py-1 text-xs border rounded"
                          >
                            <option value="available">Available</option>
                            <option value="hired">Hired</option>
                            <option value="inactive">Inactive</option>
                          </select>

                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 flex items-center"
                            onClick={() => setDeleteTarget({ id: hk._id, type: "housekeeper" })}
                            disabled={actionLoading === hk._id}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                          </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Empty state */}
        {!loading && view === "employers" && employers.length === 0 && (
          <div className="text-center py-10 text-gray-500">No employers found.</div>
        )}
        {!loading && view === "housekeepers" && housekeepers.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No housekeepers found.
          </div>
        )}
      </div>
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/30" />
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-6 rounded-lg bg-white shadow-lg">
            <DialogTitle className="text-lg font-medium text-gray-900">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this record? This action cannot be undone.
            </DialogDescription>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={!!actionLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={async () => {
                  if (!deleteTarget) return;
                  const { id, type } = deleteTarget;
                  setDeleteTarget(null);
                  setActionLoading(id);
                  try {
                    if (type === "employer") {
                      await deleteEmployer(id);
                      setEmployers((prev) => prev.filter((p) => p._id !== id));
                    } else {
                      await deleteHousekeeper(id);
                      setHousekeepers((prev) => prev.filter((p) => p._id !== id));
                    }
                    toast({ title: "Deleted", description: "Record deleted successfully" });
                  } catch (err) {
                    console.error("Delete error:", err);
                    toast({
                      title: "Error",
                      description: "Failed to delete record",
                      variant: "destructive",
                    });
                  } finally {
                    setActionLoading(null);
                  }
                }}
                disabled={!!actionLoading}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
              
    </div>
  );
}
