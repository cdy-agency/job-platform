"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  fetchAdminProfile,
  updateAdminPassword,
  uploadAdminImage,
  updateAdminImage,
  deleteAdminImage,
  uploadAdminDocuments,
  updateAdminDocuments,
  deleteAdminDocument,
} from "@/lib/api";
import { toast } from "sonner";
import { AdminDashboardSidebar } from "@/components/admin-dashboard";

type DocumentItem = {
  id: string;
  file: File;
  url: string; // object URL for preview / download
  isExisting?: boolean;
};

export default function AdminProfilePage() {
  const [form, setForm] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  // Profile image state: file + preview url
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(
    "/placeholder-logo.png"
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Documents (multiple)
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const docInputRef = useRef<HTMLInputElement | null>(null);

  // drag & drop state for styling
  const [dragActive, setDragActive] = useState(false);

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchAdminProfile();
        const adminData = response.admin;
        setProfileData(adminData);

        // Pre-fill form with existing data
        setForm({
          email: adminData.email || "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Set existing profile image
        if (adminData.image?.url) {
          setProfilePreview(adminData.image.url);
        }

        // Set existing documents
        if (adminData.documents && Array.isArray(adminData.documents)) {
          const existingDocs = adminData.documents.map(
            (doc: any, index: number) => ({
              id: `existing-${index}`,
              file: new File([], doc.name || `Document ${index + 1}`),
              url: doc.url,
              isExisting: true,
            })
          );
          setDocuments(existingDocs);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (profilePreview && profilePreview.startsWith("blob:")) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleProfileFile = (file: File | null) => {
    setUploadError(null);
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image (png, jpg, webp).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("Image too large. Max size is 4 MB.");
      return;
    }

    if (profilePreview && profilePreview.startsWith("blob:")) {
      URL.revokeObjectURL(profilePreview);
    }

    const url = URL.createObjectURL(file);
    setProfileFile(file);
    setProfilePreview(url);
  };

  const onProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    handleProfileFile(f);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0] || null;
    handleProfileFile(f);
  };

  const removeProfileImage = () => {
    if (profilePreview && profilePreview.startsWith("blob:")) {
      URL.revokeObjectURL(profilePreview);
    }
    setProfileFile(null);
    setProfilePreview("/placeholder-logo.png");
    setUploadError(null);
  };

  const onDocumentsSelected = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const newDocs = fileArray.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      isExisting: false,
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const onDocInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDocumentsSelected(e.target.files);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => {
      const rem = prev.find((d) => d.id === id);
      if (rem && rem.url.startsWith("blob:")) URL.revokeObjectURL(rem.url);
      return prev.filter((d) => d.id !== id);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Password validation logic
      if (form.oldPassword || form.newPassword || form.confirmPassword) {
        if (!form.oldPassword) {
          toast.error("Please enter your current password.");
          setLoading(false);
          return;
        }
        if (!form.newPassword) {
          toast.error("Please enter a new password.");
          setLoading(false);
          return;
        }
        if (form.newPassword !== form.confirmPassword) {
          toast.error("New passwords do not match.");
          setLoading(false);
          return;
        }
      }

      // Update non-file fields/passwords via JSON endpoint first
      if (form.oldPassword && form.newPassword) {
        await updateAdminPassword({
          currentPassword: form.oldPassword,
          newPassword: form.newPassword,
        });
      }

      // Handle file uploads separately using dedicated endpoints
      const newDocs = documents.filter((d) => !d.isExisting).map((d) => d.file);

      if (profileFile) {
        await updateAdminImage(profileFile);
      }

      if (newDocs.length > 0) {
        await uploadAdminDocuments(newDocs);
      }

      toast.success("Profile updated successfully");

      // Reset password fields
      setForm((p) => ({
        ...p,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // Reload profile data
      // In a real implementation, you would fetch the updated profile
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardSidebar />
      <div className="md:ml-72 p-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg font-semibold text-gray-900 mb-6">
            Admin Profile
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {/* Profile image */}
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <div
                  className={`relative w-32 h-32 mx-auto border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                    dragActive
                      ? "border-[#834de3] bg-[#f5f0ff]"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={docInputRef}
                    onChange={onProfileInputChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {uploadError && (
                  <p className="mt-1 text-xs text-red-600">{uploadError}</p>
                )}

                <div className="mt-2 flex justify-center gap-2">
                  {profilePreview && profilePreview !== "/placeholder-logo.png" && (
                    <button
                      type="button"
                      onClick={removeProfileImage}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Form fields */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Old Password
                    </label>
                    <input
                      name="oldPassword"
                      type="password"
                      value={form.oldPassword}
                      onChange={handleChange}
                      placeholder="Enter your current password"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      name="newPassword"
                      type="password"
                      value={form.newPassword}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current password"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your new password"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
                  />
                </div>
              </div>
            </div>

            {/* Documents manager */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Related Documents
              </label>
              <div className="space-y-3">
                {/* Document upload area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    dragActive
                      ? "border-[#834de3] bg-[#f5f0ff]"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    onDocumentsSelected(e.dataTransfer.files);
                  }}
                >
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={docInputRef}
                    onChange={onDocInputChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* Document list */}
                {documents.length > 0 && (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                            <svg
                              className="h-4 w-4 text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">
                            {doc.isExisting ? doc.file.name : doc.file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(doc.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#834de3] text-white px-6 py-2 rounded-md hover:bg-[#6b3ac2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
