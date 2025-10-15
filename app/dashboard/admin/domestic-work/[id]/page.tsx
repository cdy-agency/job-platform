"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, User, MapPin, Phone, Mail, Calendar, 
  Building, Users, Heart, GraduationCap, Church,
  DollarSign, Eye, Trash2
} from "lucide-react";
import { 
  fetchEmployerById, 
  fetchHousekeeperById, 
  updateEmployerStatus, 
  updateHousekeeperStatus,
  deleteEmployer,
  deleteHousekeeper
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

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
  salary: number;
  vocationDays: string;
  profileImage?: { url: string };
  status: "pending" | "active" | "completed";
  selectedHousekeepers: any[];
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
    language: string
    amountOfMoney: string
    workType: string
    vocationDays: string
    married: string
    numberChildren: string
    willingToWorkWithChildren: boolean
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
  idImage?: {url: string};
  status: "available" | "hired" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export default function DomesticWorkDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const type = searchParams.get("type") as "employer" | "housekeeper";
  
  const [data, setData] = useState<Employer | Housekeeper | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [openImage, setOpenImage] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [id, type]);

  const loadData = async () => {
    try {
      setLoading(true);
      let response;
      if (type === "employer") {
        response = await fetchEmployerById(id);
        setData(response.employer);
      } else {
        response = await fetchHousekeeperById(id);
        setData(response.housekeeper);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      setActionLoading(true);
      if (type === "employer") {
        await updateEmployerStatus(id, status as any);
      } else {
        await updateHousekeeperStatus(id, status as any);
      }
      setData(prev => prev ? { ...prev, status: status as any } : null);
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
      setActionLoading(false);
    }
  };

  const handleDeleteModal = async () => {
  try {
    setActionLoading(true);
    if (type === "employer") {
      await deleteEmployer(id);
    } else {
      await deleteHousekeeper(id);
    }
    toast({
      title: "Success",
      description: "Record deleted successfully",
    });
    window.location.href = "/dashboard/admin/domestic-work";
  } catch (error) {
    console.error("Error deleting:", error);
    toast({
      title: "Error",
      description: "Failed to delete record",
      variant: "destructive",
    });
  } finally {
    setActionLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Record not found</h3>
            <p className="text-gray-600 mb-4">The requested record could not be found.</p>
            <Link href="/dashboard/admin/domestic-work">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isEmployer = type === "employer";
  const employer = data as Employer;
  const housekeeper = data as Housekeeper;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard/admin/domestic-work">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {type === "employer" ? "Employers" : "Housekeepers"}
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEmployer ? employer.name : housekeeper.fullName}
              </h1>
              <p className="text-gray-600">
                {type === "employer" ? "Employer" : "Housekeeper"} Details
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(data.status)}`}>
                {data.status}
              </Badge>
              <select
                value={data.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={actionLoading}
                className="px-3 py-1 border rounded-md text-sm"
              >
                {isEmployer ? (
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
                variant="outline"
                className="text-red-500 flex items-center"
                onClick={() => setDeleteOpen(true)}
                disabled={actionLoading}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>

    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <DialogContent className="w-full p-2 rounded bg-slate shadow-lg mb-4">
        <DialogTitle className="text-lg font-medium text-gray-900 mb-4">
          Confirm Deletion
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this record? This action cannot be undone.
        </DialogDescription>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setDeleteOpen(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={async () => {
              setDeleteOpen(false)
              await handleDeleteModal()
            }}
            disabled={actionLoading}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900">{isEmployer ? employer.name : housekeeper.fullName}</p>
                  </div>
                  {isEmployer && employer.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{employer.email}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone Number</label>
                    <p className="text-gray-900">{data.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {isEmployer ? "National ID" : "ID Number"}
                    </label>
                    <p className="text-gray-900">{isEmployer ? employer.nationalId : housekeeper.idNumber}</p>
                  </div>
                  {!isEmployer && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Gender</label>
                        <p className="text-gray-900 capitalize">{housekeeper.gender}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Age</label>
                        <p className="text-gray-900">
                          {new Date().getFullYear() - new Date(housekeeper.dateOfBirth).getFullYear()} years
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Province</label>
                    <p className="text-gray-900 capitalize">{data.location.province}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">District</label>
                    <p className="text-gray-900">{data.location.district}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sector</label>
                    <p className="text-gray-900">{data.location.sector}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Cell</label>
                    <p className="text-gray-900">{data.location.cell}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Village</label>
                    <p className="text-gray-900">{data.location.village}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Type-specific Information */}
            {isEmployer ? (
              <>
                {/* Employer Specific Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Employment Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Salary Range</label>
                        <p className="text-gray-900">
                          {employer.salary.toLocaleString()} RWF
                        </p>
                      </div>
                      <div className="flex flex-col gap-5">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Church Name</label>
                          <p className="text-gray-900">{employer.churchName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Vocation Days</label>
                          <p className="text-gray-900">{employer.vocationDays}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Village Leader Number</label>
                        <p className="text-gray-900">{employer.villageLeaderNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Partner Number</label>
                        <p className="text-gray-900">{employer.partnerNumber}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Housekeepers */}
                {employer.selectedHousekeepers && employer.selectedHousekeepers.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Selected Housekeepers ({employer.selectedHousekeepers.length})</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {employer.selectedHousekeepers.map((hk: any, index: number) => (
                          <div key={hk._id || index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                                <img src={hk.passportImage?.url} alt={hk.fullName} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{hk.fullName || 'Housekeeper'}</p>
                                <p className="text-sm text-gray-600">{hk.phoneNumber}</p>
                                {hk.status && (
                                  <Badge className={`text-xs ${getStatusColor(hk.status)}`}>
                                    {hk.status}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {hk._id && (
                              <Link href={`/dashboard/admin/domestic-work/${hk._id}?type=housekeeper`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <>
                {/* Housekeeper Specific Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5" />
                      <span>Work Preferences</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Language</label>
                        <p className="text-gray-900">{housekeeper.workPreferences.language}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Money Range</label>
                        <p className="text-gray-900">{housekeeper.workPreferences.amountOfMoney}K</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Martial Status</label>
                        <p className="text-gray-900">{housekeeper.workPreferences.married}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Number of Children</label>
                        <p className="text-gray-900">{housekeeper.workPreferences.numberChildren || "none"}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-600">Willing to Work with Children</label>
                        <p className="text-gray-900">
                          {housekeeper.workPreferences.willingToWorkWithChildren ? "Yes" : "No"}
                        </p><label className="text-sm font-medium text-gray-600">Vocation Days</label>
                        <p className="text-gray-900">
                          {housekeeper.workPreferences.vocationDays}
                        </p>
                        
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5" />
                      <span>Background Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Has Parents</label>
                        <p className="text-gray-900">{housekeeper.background.hasParents ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Has Studied</label>
                        <p className="text-gray-900">{housekeeper.background.hasStudied ? "Yes" : "No"}</p>
                      </div>
                      {housekeeper.background.fatherName && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Father's Name</label>
                          <p className="text-gray-900">{housekeeper.background.fatherName}</p>
                        </div>
                      )}
                      {housekeeper.background.fatherPhone && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Father's Phone</label>
                          <p className="text-gray-900">{housekeeper.background.fatherPhone}</p>
                        </div>
                      )}
                      {housekeeper.background.motherName && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Mother's Name</label>
                          <p className="text-gray-900">{housekeeper.background.motherName}</p>
                        </div>
                      )}
                      {housekeeper.background.motherPhone && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Mother's Phone</label>
                          <p className="text-gray-900">{housekeeper.background.motherPhone}</p>
                        </div>
                      )}
                      {housekeeper.background.educationLevel && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Education Level</label>
                          <p className="text-gray-900 capitalize">{housekeeper.background.educationLevel}</p>
                        </div>
                      )}
                      {housekeeper.background.church && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Church/Religion</label>
                          <p className="text-gray-900 capitalize">{housekeeper.background.church}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Image */}
            <Card>
              <CardContent className="p-6 text-center">
                {type === "employer" &&
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-4 overflow-hidden">
                  <img src={employer.profileImage?.url} alt={employer.name} 
                  className="w-full h-full object-cover"
                  />
                </div>
                }

                {type === 'housekeeper' && 
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-4 overflow-hidden">
                  <img src={housekeeper.passportImage?.url} alt={housekeeper.fullName} 
                  className="w-full h-full object-cover"
                  />
                </div>
                }
  
  
                <h3 className="font-semibold text-gray-900 mb-1">
                  {isEmployer ? employer.name : housekeeper.fullName}
                </h3>
                <p className="text-sm text-gray-600 capitalize">{type}</p>
                <Badge className={`mt-2 ${getStatusColor(data.status)}`}>
                  {data.status}
                </Badge>
              </CardContent>
            </Card>

            {/* Images for Housekeeper */}
            {!isEmployer && (
              <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Passport Photo */}
          {housekeeper.passportImage?.url && (
            <div>
              <label className="text-xs font-medium text-gray-600">Passport Photo</label>
              <div className="mt-2 border rounded-lg overflow-hidden cursor-pointer"
                   onClick={() => housekeeper.passportImage?.url && setOpenImage(housekeeper.passportImage.url)}>
                <img 
                  src={housekeeper.passportImage.url} 
                  alt="Passport" 
                  className="w-full h-32 object-cover"
                />
              </div>
            </div>
          )}

          {/* National ID Image */}
          {housekeeper.idImage?.url && (
            <div>
              <label className="text-xs font-medium text-gray-600">National ID Image</label>
              <div className="mt-2 border rounded-lg overflow-hidden cursor-pointer"
                   onClick={() => housekeeper.idImage?.url && setOpenImage(housekeeper.idImage.url)}>
                <img 
                  src={housekeeper.idImage.url} 
                  alt="ID" 
                  className="w-full h-32 object-cover"
                />
              </div>
            </div>
          )}

          {/* Full Body Photo */}
          {housekeeper.fullBodyImage?.url && (
            <div>
              <label className="text-xs font-medium text-gray-600">Full Body Photo</label>
              <div className="mt-2 border rounded-lg overflow-hidden cursor-pointer"
                   onClick={() => housekeeper.fullBodyImage?.url && setOpenImage(housekeeper.fullBodyImage.url)}>
                <img 
                  src={housekeeper.fullBodyImage.url} 
                  alt="Full Body" 
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal / Dialog */}
      <Dialog open={!!openImage} onOpenChange={() => setOpenImage(null)}>
        <DialogContent className="max-w-3xl p-0 bg-transparent shadow-none">
          {openImage && (
            <img src={openImage} alt="Full View" className="w-full h-auto object-contain rounded-md" />
          )}
        </DialogContent>
      </Dialog>
    </>
            )}

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Timestamps</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Created</label>
                  <p className="text-sm text-gray-900">
                    {new Date(data.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Updated</label>
                  <p className="text-sm text-gray-900">
                    {new Date(data.updatedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}