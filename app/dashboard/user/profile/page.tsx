"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Upload,
  Camera,
  FileText,
  Trash2,
  Save,
  User,
  Briefcase,
  GraduationCap,
  Shield,
  Check,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { JOB_CATEGORIES } from "@/app/dashboard/company/post-job/page";
import { fetchEmployeeProfile, updateEmployeeProfile, deactivateEmployeeAccount, activateEmployeeAccount, deleteEmployeeAccount } from "@/lib/api";
import {
  uploadEmployeeImage,
  updateEmployeeImage,
  uploadEmployeeDocuments,
  updateEmployeeDocuments,
  deleteEmployeeImage,
  deleteEmployeeDocument,
  resetEmployeePassword,
} from "@/lib/api/employee";

interface EmployeeProfile {
  name?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  profileImage?: string | { url: string; name: string; type: string };
  about?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  jobPreferences?: string[];
  documents?: Array<{
    id?: string;
    name: string;
    type: string;
    uploadedAt?: string;
    url?: string;
  }>;
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [documentsUploading, setDocumentsUploading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [confirmOpen, setConfirmOpen] = useState<null | 'deactivate' | 'activate' | 'delete'>(null);
  const [newPreference, setNewPreference] = useState("")

  useEffect(() => {
    fetchEmployeeProfile()
      .then((data) => setProfile(data || null))
      .catch(() => setProfile(null));
  }, []);

  const handleUpdate = async () => {
    if (!profile) return;
    
    // Debug logging
    console.log('Profile data to update:', profile);
    console.log('Token from localStorage:', localStorage.getItem('token'));
    console.log('User from localStorage:', localStorage.getItem('user'));
    
    setLoading(true);
    try {
      const result = await updateEmployeeProfile({
        name: profile.name || "",
        phoneNumber: profile.phoneNumber || "",
        location: profile.location || "",
        about: profile.about || "",
        experience: profile.experience || "",
        education: profile.education || "",
        skills: profile.skills || [],
        jobPreferences: profile.jobPreferences || [],
      });
      console.log('Update successful:', result);
      toast({ title: "Profile updated successfully", description: "Your changes have been saved." });
    } catch (err: any) {
      console.error('Update failed with error:', err);
      toast({
        title: "Update failed",
        description: err?.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password must match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      await resetEmployeePassword(passwordData.oldPassword, passwordData.newPassword);
      toast({ title: "Password updated successfully", description: "Your password has been changed." });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordReset(false);
    } catch (err: any) {
      toast({
        title: "Password reset failed",
        description: err?.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setImageUploading(true);

    try {
      const res = profile?.profileImage
        ? await updateEmployeeImage(file)
        : await uploadEmployeeImage(file);

      const imageUrl = res.url || res.profileImage?.url || res.profileImage;
      setProfile((prev) => ({
        ...prev!,
        profileImage: imageUrl,
      }));
      toast({ title: "Profile image updated successfully" });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err?.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await deleteEmployeeImage();
      setProfile((prev) => ({ ...prev!, profileImage: undefined }));
      setImagePreview(null);
      toast({ title: "Profile image deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setDocumentsUploading(true);
    const fileArray = Array.from(files);

    try {
      const res =
        profile?.documents?.length && profile.documents.length > 0
          ? await updateEmployeeDocuments(fileArray)
          : await uploadEmployeeDocuments(fileArray);

      const uploaded = res.documents || res.employee?.documents || [];
      setProfile((prev) => ({
        ...prev!,
        documents: uploaded,
      }));
      toast({ title: "Documents uploaded successfully" });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err?.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setDocumentsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveDocument = async (docIndex: number) => {
    try {
      await deleteEmployeeDocument(docIndex.toString());
      setProfile((prev) => ({
        ...prev!,
        documents: prev!.documents?.filter((_, index) => index !== docIndex),
      }));
      toast({ title: "Document deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim() || profile?.skills?.includes(newSkill.trim())) return;
    setProfile((prev) => ({
      ...prev!,
      skills: [...(prev?.skills || []), newSkill.trim()],
    }));
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev!,
      skills: prev!.skills?.filter((s) => s !== skill),
    }));
  };

  const getImageUrl = (profileImage: any) => {
    if (typeof profileImage === 'string') return profileImage;
    if (profileImage?.url) return profileImage.url;
    return null;
  };

  const getDocumentUrl = (document: any) => {
    if (typeof document === 'string') return document;
    if (document?.url) return document.url;
    return null;
  };

  const getDocumentName = (document: any) => {
    if (typeof document === 'string') return 'Document';
    if (document?.name) return document.name;
    return 'Document';
  };

  const tabItems = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your personal information and account settings</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setShowPasswordReset(true)}
              variant="outline"
              className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 w-full sm:w-auto"
            >
              <Shield className="mr-2 h-4 w-4" />
              Change Password
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg w-full sm:w-auto"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              onClick={() => setConfirmOpen((profile as any)?.isActive === false ? 'activate' : 'deactivate')}
              variant="outline"
              className={`w-full sm:w-auto ${
                (profile as any)?.isActive === false 
                  ? 'border-green-200 text-green-600 hover:bg-green-50' 
                  : 'border-red-200 text-red-600 hover:bg-red-50'
              }`}
            >
              {(profile as any)?.isActive === false ? 'Activate account' : 'Deactivate account'}
            </Button>
            <Button
              onClick={() => setConfirmOpen('delete')}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100 w-full sm:w-auto"
            >
              Delete account
            </Button>
          </div>
        </div>

        {/* Status Indicator */}
        {profile && (
          <div className="mb-6 p-3 rounded-md bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Account Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                (profile as any)?.isActive === false
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {(profile as any)?.isActive === false ? 'Deactivated' : 'Active'}
              </span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Profile Image */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full border-4 border-purple-200 overflow-hidden mx-auto bg-gradient-to-br from-purple-100 to-indigo-100">
                      <img
                        src={
                          imagePreview ||
                          getImageUrl(profile?.profileImage) ||
                          "/placeholder.svg"
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      {imageUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <div className="h-6 w-6 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageSelect}
                      />
                    </label>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-4">
                    {profile?.name || "Your Name"}
                  </h3>
                  <p className="text-gray-500 text-sm">{profile?.email || "your.email@example.com"}</p>
                  {profile?.profileImage && (
                    <Button
                      onClick={handleDeleteImage}
                      variant="ghost"
                      size="sm"
                      className="mt-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove Photo
                    </Button>
                  )}
                </div>

                {/* Skills Section */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-200"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:bg-purple-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add new skill"
                      className="text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button
                      onClick={handleAddSkill}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-0">
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-1 bg-gray-50 p-1 rounded-xl">
                  {tabItems.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                          activeTab === tab.id
                            ? "bg-white text-purple-700 shadow-sm border border-purple-200"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Personal Info Tab */}
                {activeTab === "personal" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <Input
                          value={profile?.name || ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev!,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <Input
                          value={profile?.email || ""}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <Input
                          value={profile?.phoneNumber || ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev!,
                              phoneNumber: e.target.value,
                            }))
                          }
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <Input
                          value={profile?.location || ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev!,
                              location: e.target.value,
                            }))
                          }
                          placeholder="Enter your location"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">About Me</label>
                      <textarea
                        value={profile?.about || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev!,
                            about: e.target.value,
                          }))
                        }
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Job Preferences</label>
                      <div className="bg-white border border-gray-300 rounded-md p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {JOB_CATEGORIES.map((category) => {
                            const checked = (profile?.jobPreferences || []).includes(category.value)
                            return (
                              <label key={category.value} className="flex items-center space-x-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(e) => {
                                    setProfile(prev => {
                                      const current = new Set(prev?.jobPreferences || [])
                                      if (e.target.checked) current.add(category.value)
                                      else current.delete(category.value)
                                      return { ...prev!, jobPreferences: Array.from(current) }
                                    })
                                  }}
                                  className="h-4 w-4 text-[#834de3] focus:ring-[#834de3] border-gray-300 rounded"
                                />
                                <span>{category.label}</span>
                              </label>
                            )
                          })}
                        </div>
                        {(profile?.jobPreferences || []).length > 0 && (
                          <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-600">
                            Selected: {(profile?.jobPreferences || []).map((v) => JOB_CATEGORIES.find(c => c.value === v)?.label || v).join(', ')}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Recommendations on your dashboard will use these preferences.</p>
                    </div>
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === "experience" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Professional Experience</label>
                      <textarea
                        value={profile?.experience || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev!,
                            experience: e.target.value,
                          }))
                        }
                        placeholder="Describe your work experience, achievements, and responsibilities..."
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === "education" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Educational Background</label>
                      <textarea
                        value={profile?.education || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev!,
                            education: e.target.value,
                          }))
                        }
                        placeholder="List your educational qualifications, certifications, and academic achievements..."
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === "documents" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Document Library</h3>
                        <p className="text-gray-500 text-sm">Upload and manage your important documents</p>
                      </div>
                      <div>
                        <input
                          type="file"
                          multiple
                          id="doc-upload"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                        />
                        <Button
                          onClick={() => document.getElementById("doc-upload")?.click()}
                          disabled={documentsUploading}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        >
                          {documentsUploading ? (
                            <div className="flex items-center">
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Uploading...
                            </div>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Documents
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {profile?.documents?.length ? (
                        profile.documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <FileText className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{getDocumentName(doc)}</p>
                                <p className="text-sm text-gray-500">
                                  Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Recently'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getDocumentUrl(doc) && (
                                <a
                                  href={getDocumentUrl(doc)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </a>
                              )}
                              <Button
                                onClick={() => handleRemoveDocument(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">No documents uploaded yet</p>
                          <p className="text-gray-400 text-sm">Upload your first document to get started</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Password Reset Modal */}
        {showPasswordReset && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                </div>
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                  />
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handlePasswordReset}
                    disabled={passwordLoading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    {passwordLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Updating...
                      </div>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowPasswordReset(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {confirmOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {confirmOpen === 'delete' ? 'Delete Account' : 
                     confirmOpen === 'deactivate' ? 'Deactivate Account' : 'Activate Account'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {confirmOpen === 'delete' ? 'This action will permanently delete your account and cannot be undone.' :
                     confirmOpen === 'deactivate' ? 'Your account will be deactivated and you won\'t be able to access the platform.' :
                     'Your account will be reactivated and you\'ll regain access to all features.'}
                  </p>
                </div>
                <div className="flex gap-3 mt-6 justify-end">
                  <Button variant="outline" onClick={() => setConfirmOpen(null)}>Cancel</Button>
                  <Button
                    className={confirmOpen === 'delete' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#834de3] text-white hover:bg-[#6b3ac2]'}
                    onClick={async () => {
                      try {
                        if (confirmOpen === 'deactivate') await deactivateEmployeeAccount();
                        if (confirmOpen === 'activate') await activateEmployeeAccount();
                        if (confirmOpen === 'delete') await deleteEmployeeAccount();
                        const refreshed = await fetchEmployeeProfile();
                        setProfile(refreshed);
                        toast({ 
                          title: "Success", 
                          description: `Account ${confirmOpen === 'delete' ? 'deleted' : confirmOpen === 'deactivate' ? 'deactivated' : 'activated'} successfully` 
                        });
                      } catch (err: any) {
                        toast({
                          title: "Error",
                          description: err?.response?.data?.message || "Failed to process request",
                          variant: "destructive"
                        });
                      }
                      setConfirmOpen(null);
                    }}
                  >
                    {confirmOpen === 'delete' ? 'Delete Account' : 
                     confirmOpen === 'deactivate' ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}