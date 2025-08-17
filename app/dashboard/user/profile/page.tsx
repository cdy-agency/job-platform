"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Plus,
  X,
  Upload,
  Camera,
  FileText,
  Trash2,
  Save,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { fetchEmployeeProfile, updateEmployeeProfile } from "@/lib/api";
import {
  uploadEmployeeImage,
  updateEmployeeImage,
  uploadEmployeeDocuments,
  updateEmployeeDocuments,
  deleteEmployeeImage,
  deleteEmployeeDocument,
} from "@/lib/api/employee";

interface EmployeeProfile {
  name?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  profileImage?: string;
  about?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
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

  useEffect(() => {
    fetchEmployeeProfile()
      .then((data) => setProfile(data || null))
      .catch(() => setProfile(null));
  }, []);

  /** 🔹 Save Profile Info */
  const handleUpdate = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      await updateEmployeeProfile({
        name: profile.name || "",
        phoneNumber: profile.phoneNumber || "",
        location: profile.location || "",
        about: profile.about || "",
        experience: profile.experience || "",
        education: profile.education || "",
        skills: profile.skills || [],
      });
      toast({ title: "Profile updated", description: "Changes saved." });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.response?.data?.message || "Try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Image Upload */
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setImageUploading(true);

    try {
      const res = profile?.profileImage
        ? await updateEmployeeImage(file)
        : await uploadEmployeeImage(file);

      setProfile((prev) => ({
        ...prev!,
        profileImage: res.url || res.imageUrl,
      }));
      toast({ title: "Profile image updated" });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err?.response?.data?.message || "Try again",
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
      toast({ title: "Profile image deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  /** 🔹 Documents */
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

      const uploaded = res.documents || [];
      setProfile((prev) => ({
        ...prev!,
        documents: [...(prev?.documents || []), ...uploaded],
      }));
      toast({ title: "Documents uploaded" });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err?.response?.data?.message || "Try again",
        variant: "destructive",
      });
    } finally {
      setDocumentsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveDocument = async (docId: string) => {
    try {
      await deleteEmployeeDocument(docId);
      setProfile((prev) => ({
        ...prev!,
        documents: prev!.documents?.filter((d) => d.id !== docId),
      }));
      toast({ title: "Document deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  /** 🔹 Skills */
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-700">My Profile</h1>
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Profile Image */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-purple-200">
                  <img
                    src={
                      imagePreview ||
                      profile?.profileImage ||
                      "/placeholder.svg"
                    }
                    className="h-full w-full object-cover"
                  />
                  {imageUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="h-6 w-6 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    </div>
                  )}
                </div>
                <div className="mt-3 flex justify-center gap-2">
                  <label className="cursor-pointer bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 flex items-center gap-1 text-sm">
                    <Camera className="h-4 w-4" /> Change
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </label>
                  {profile?.profileImage && (
                    <Button
                      size="sm"
                      onClick={handleDeleteImage}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-800">
                  {profile?.name || "—"}
                </h2>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-700">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="h-4 w-4" />
                  <span>{profile?.email || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-purple-600" />
                  <Input
                    value={profile?.phoneNumber || ""}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev!,
                        phoneNumber: e.target.value,
                      }))
                    }
                    placeholder="Phone number"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  <Input
                    value={profile?.location || ""}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev!,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Location"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-700">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile?.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill"
                  />
                  <Button
                    onClick={handleAddSkill}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-purple-700">Documents</CardTitle>
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
                    size="sm"
                    onClick={() =>
                      document.getElementById("doc-upload")?.click()
                    }
                    disabled={documentsUploading}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {documentsUploading ? (
                      "Uploading..."
                    ) : (
                      <>
                        <Upload className="mr-1 h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile?.documents?.length ? (
                    profile.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex justify-between items-center border rounded-md p-2"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="text-purple-600" />
                          <span>{doc.name}</span>
                        </div>
                        <div className="flex gap-2">
                          {doc.url && (
                            <a
                              href={doc.url}
                              target="_blank"
                              className="text-sm text-purple-600 underline"
                            >
                              View
                            </a>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleRemoveDocument(doc.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">
                      No documents uploaded
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <Card>
            <Tabs defaultValue="about">
              <CardHeader>
                <TabsList className="grid grid-cols-3 w-full bg-purple-50">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="about">
                  <textarea
                    value={profile?.about || ""}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev!,
                        about: e.target.value,
                      }))
                    }
                    className="w-full min-h-[100px] border rounded-md p-2 focus:ring-purple-500"
                  />
                </TabsContent>
                <TabsContent value="experience">
                  <textarea
                    value={profile?.experience || ""}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev!,
                        experience: e.target.value,
                      }))
                    }
                    className="w-full min-h-[150px] border rounded-md p-2 focus:ring-purple-500"
                  />
                </TabsContent>
                <TabsContent value="education">
                  <textarea
                    value={profile?.education || ""}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev!,
                        education: e.target.value,
                      }))
                    }
                    className="w-full min-h-[150px] border rounded-md p-2 focus:ring-purple-500"
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
