"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Building, Phone, Mail, MapPin, Calendar, Eye, Trash2 } from "lucide-react";
import { fetchAllEmployers, fetchAllHousekeepers, updateEmployerStatus, updateHousekeeperStatus, deleteEmployer, deleteHousekeeper } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
  };
  villageLeaderNumber: string;
  partnerNumber: string;
  churchName: string;
  salaryRangeMin: number;
  salaryRangeMax: number;
  profileImage?: { url: string };
  status: "pending" | "active" | "completed";
  selectedHousekeepers: string[];
  createdAt: string;
  updatedAt: string;
};

type Housekeeper = {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female";
  idNumber: string;
  phoneNumber: string;
  location: {
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
  };
  workPreferences: {
    workDistrict: string;
    workSector: string;
    willingToWorkWithChildren: boolean;
  };
  background: {
    hasParents: boolean;
    fatherName?: string;
    fatherPhone?: string;
    motherName?: string;
    motherPhone?: string;
    hasStudied: boolean;
    educationLevel?: string;
    church?: string;
  };
  passportImage?: { url: string };
  fullBodyImage?: { url: string };
  status: "available" | "hired" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export default function AdminDomesticWorkDashboard() {
  const [view, setView] = useState<"employers" | "housekeepers">("employers");
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [housekeepers, setHousekeepers] = useState<Housekeeper[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [view]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (view === "employers") {
        const response = await fetchAllEmployers();
        setEmployers(response.employers || []);
      } else {
        const response = await fetchAllHousekeepers();
        setHousekeepers(response.housekeepers || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string, type: "employer" | "housekeeper") => {
    try {
      setActionLoading(id);
      if (type === "employer") {
        await updateEmployerStatus(id, status as any);
        setEmployers(prev => prev.map(emp => emp._id === id ? { ...emp, status: status as any } : emp));
      } else {
        await updateHousekeeperStatus(id, status as any);
        setHousekeepers(prev => prev.map(hk => hk._id === id ? { ...hk, status: status as any } : hk));
      }
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      console.error("Error updating status:", error);
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
        setEmployers(prev => prev.filter(emp => emp._id !== id));
      } else {
        await deleteHousekeeper(id);
        setHousekeepers(prev => prev.filter(hk => hk._id !== id));
      }
      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting:", error);
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
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "active": case "available": return "bg-green-100 text-green-800";
      case "completed": case "hired": return "bg-blue-100 text-blue-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const data = view === "employers" ? employers : housekeepers;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Domestic Work Management</h1>
          <p className="text-gray-600">Manage employers and housekeepers in the domestic work platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Employers</p>
                  <p className="text-3xl font-bold text-gray-900">{employers.length}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Active: {employers.filter(e => e.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Housekeepers</p>
                  <p className="text-3xl font-bold text-gray-900">{housekeepers.length}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Available: {housekeepers.filter(h => h.status === 'available').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setView("employers")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                view === "employers"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Employers ({employers.length})
            </button>
            <button
              onClick={() => setView("housekeepers")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                view === "housekeepers"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Housekeepers ({housekeepers.length})
            </button>
          </div>
        </div>

        {/* Data Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((person: any) => (
              <Card key={person._id} className="bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {view === "employers" ? (
                        person.profileImage?.url ? (
                          <img
                            src={person.profileImage.url}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white bg-purple-500 w-full h-full flex items-center justify-center font-semibold">
                            {person.name?.charAt(0)}
                          </span>
                        )
                      ) : (
                        person.passportImage?.url ? (
                          <img
                            src={person.passportImage.url}
                            alt={person.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white bg-blue-500 w-full h-full flex items-center justify-center font-semibold">
                            {person.fullName?.charAt(0)}
                          </span>
                        )
                      )}
                    </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {view === "housekeepers" && 
                          <img src={person.profileImage?.url} alt={person.name} 
                          className="w-full h-full object-cover"
                          />
                        }
                        </h3>
                        <Badge className={`text-xs ${getStatusColor(person.status)}`}>
                          {person.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {person.location.village}, {person.location.sector}, {person.location.district}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{person.phoneNumber}</span>
                    </div>
                    {view === "employers" && person.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{person.email}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(person.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {view === "employers" ? (
                    <div className="text-sm text-gray-600 mb-4">
                      <p>Salary: {person.salaryRangeMin?.toLocaleString()} - {person.salaryRangeMax?.toLocaleString()} RWF</p>
                      {person.selectedHousekeepers?.length > 0 && (
                        <p>Selected: {person.selectedHousekeepers.length} housekeeper(s)</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 mb-4">
                      <p>Gender: {person.gender}</p>
                      <p>Age: {new Date().getFullYear() - new Date(person.dateOfBirth).getFullYear()}</p>
                      <p>Children: {person.workPreferences?.willingToWorkWithChildren ? "Yes" : "No"}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/admin/domestic-work/${person._id}?type=${view.slice(0, -1)}`}>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    
                    {/* Status Update Dropdown */}
                    <select
                      value={person.status}
                      onChange={(e) => handleStatusUpdate(person._id, e.target.value, view.slice(0, -1) as any)}
                      disabled={actionLoading === person._id}
                      className="px-2 py-1 text-xs border rounded"
                    >
                      {view === "employers" ? (
                        <>
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </>
                      ) : (
                        <>
                          <option value="available">Available</option>
                          <option value="hired">Hired</option>
                          <option value="inactive">Inactive</option>
                        </>
                      )}
                    </select>

                    <Button
                      size="sm"
                      onClick={() => handleDelete(person._id, view.slice(0, -1) as any)}
                      disabled={actionLoading === person._id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {view === "employers" ? (
                <Building className="h-12 w-12 text-gray-400" />
              ) : (
                <Users className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {view} found
            </h3>
            <p className="text-gray-600">
              No {view} have been registered yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}