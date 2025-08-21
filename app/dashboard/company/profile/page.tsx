"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  fetchCompanyProfile,
  updateCompanyProfile,
  completeCompanyProfile,
  updateCompanyLogo,
  uploadCompanyDocuments,
  deleteCompanyDocument,
  deactivateCompanyAccount,
  activateCompanyAccount,
  deleteCompanyAccount,
} from "@/lib/api";
import { toast } from "sonner";

type DocumentItem = {
  id: string;
  file: File;
  url: string; // object URL for preview / download
  isExisting?: boolean;
  originalIndex?: number; // index in server array for existing docs
};

export default function CompanyProfilePage() {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    phoneNumber: "",
    location: "",
    website: "",
    about: "",
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
        const data = await fetchCompanyProfile();
        setProfileData(data);

        // Pre-fill form with existing data
        setForm({
          companyName: data.companyName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          location: data.location || "",
          website: data.website || "",
          about: data.about || "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Set existing logo
        if (data.logo?.url) {
          setProfilePreview(data.logo.url);
        }

        // Set existing documents
        if (data.documents && Array.isArray(data.documents)) {
          // Convert existing documents to DocumentItem format for display
          const existingDocs = data.documents.map(
            (doc: any, index: number) => ({
              id: `existing-${index}`,
              file: new File([], doc.name || `Document ${index + 1}`),
              url: doc.url,
              isExisting: true,
              originalIndex: index,
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
      documents.forEach((d) => {
        if (d.url.startsWith("blob:")) {
          URL.revokeObjectURL(d.url);
        }
      });
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    if (!files || files.length === 0) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    const maxSize = 6 * 1024 * 1024;

    const newDocs: DocumentItem[] = [];
    Array.from(files).forEach((f) => {
      if (!allowed.includes(f.type)) return;
      if (f.size > maxSize) return;
      const url = URL.createObjectURL(f);
      newDocs.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file: f,
        url,
      });
    });

    if (newDocs.length === 0) return;

    setDocuments((prev) => [...newDocs, ...prev]);
    if (docInputRef.current) docInputRef.current.value = "";
  };

  const onDocInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDocumentsSelected(e.target.files);
  };

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const removeDocument = async (id: string) => {
    const doc = documents.find(d => d.id === id)
    if (doc?.isExisting) {
      if (!Number.isInteger(doc.originalIndex)) return;
      setConfirmId(id)
      return
    }
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

      // Prepare update data
      const updateData: any = {
        companyName: form.companyName,
        phoneNumber: form.phoneNumber,
        location: form.location,
        website: form.website,
        about: form.about,
      };

      // Add password fields if provided
      if (form.oldPassword && form.newPassword) {
        updateData.oldPassword = form.oldPassword;
        updateData.newPassword = form.newPassword;
      }

      // Update non-file fields/passwords via JSON endpoint first
      await updateCompanyProfile(updateData);

      // Handle file uploads separately using dedicated endpoints
      const newDocs = documents.filter((d) => !d.isExisting).map((d) => d.file);

      if (profileFile) {
        await updateCompanyLogo(profileFile);
      }

      if (newDocs.length > 0) {
        await uploadCompanyDocuments(newDocs);
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
      const updatedData = await fetchCompanyProfile();
      setProfileData(updatedData);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-lg font-semibold text-gray-900 mb-6">
          Company Profile
        </h1>
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={async () => {
              try {
                await deactivateCompanyAccount();
                toast.success('Company deactivated');
              } catch (e: any) {
                toast.error(e?.response?.data?.message || 'Failed to deactivate');
              }
            }}
            className="text-xs px-3 py-1 rounded-md border border-red-200 text-red-700 hover:bg-red-50"
          >
            Deactivate
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await activateCompanyAccount();
                toast.success('Company activated');
              } catch (e: any) {
                toast.error(e?.response?.data?.message || 'Failed to activate');
              }
            }}
            className="text-xs px-3 py-1 rounded-md border border-green-200 text-green-700 hover:bg-green-50"
          >
            Activate
          </button>
          <button
            type="button"
            onClick={async () => {
              const ok = window.confirm('Permanently delete company account?');
              if (!ok) return;
              try {
                await deleteCompanyAccount();
                toast.success('Company account deleted');
              } catch (e: any) {
                toast.error(e?.response?.data?.message || 'Failed to delete');
              }
            }}
            className="text-xs px-3 py-1 rounded-md border border-red-300 text-red-800 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {/* Profile image */}
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Company Logo
              </label>
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative rounded-lg border-2 ${
                  dragActive
                    ? "border-dashed border-gray-400"
                    : "border-transparent"
                } overflow-hidden bg-white p-2`}
                aria-label="Upload company logo"
              >
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-lg overflow-hidden bg-gradient-to-r from-[#834de3] to-[#9260e7] p-0.5 flex items-center justify-center">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="company logo"
                        className="w-full h-full object-cover rounded-md bg-white"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        Logo
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col gap-2 w-full">
                    <label className="text-xs text-gray-600">
                      PNG, JPG, WEBP — max 4MB
                    </label>

                    <input
                      id="profileUpload"
                      type="file"
                      accept="image/*"
                      onChange={onProfileInputChange}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("profileUpload")?.click()
                        }
                        className="flex-1 text-sm px-3 py-1 rounded-md border border-gray-200 bg-white text-gray-700 hover:shadow-sm"
                      >
                        Change
                      </button>

                      <button
                        type="button"
                        onClick={removeProfileImage}
                        className="text-sm px-3 py-1 rounded-md border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                      >
                        Remove
                      </button>
                    </div>

                    {uploadError && (
                      <p className="text-xs text-red-600 mt-1">{uploadError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Company info + passwords */}
            <div className="md:col-span-2 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    disabled
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  About Company
                </label>
                <textarea
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your company, mission, values, and what makes you unique..."
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

            <div className="flex items-center gap-3">
              <input
                ref={docInputRef}
                type="file"
                multiple
                accept=".pdf, .doc, .docx, image/png, image/jpeg, image/webp"
                onChange={onDocInputChange}
                className="hidden"
                id="docsInput"
              />
              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                className="text-sm px-3 py-1 rounded-md bg-gradient-to-r from-[#834de3] to-[#9260e7] text-white shadow-sm hover:opacity-90"
              >
                Upload Documents
              </button>

              <p className="text-xs text-gray-500">
                PDF, DOCX, PNG — max 6MB each
              </p>
            </div>

            <div className="mt-3 space-y-2">
              {documents.length === 0 && (
                <div className="text-xs text-gray-500">
                  No documents uploaded yet.
                </div>
              )}

              {documents.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-md bg-gray-50 border border-gray-100 text-sm"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-gray-600 border">
                      {d.file.type.startsWith("image/") ? "🖼️" : "📄"}
                    </div>
                    <div className="truncate">
                      <div className="font-medium text-gray-800 truncate">
                        {d.file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {d.file.size
                          ? (d.file.size / 1024 / 1024).toFixed(2) + " MB"
                          : "Existing file"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={d.url}
                      download={d.file.name}
                      className="text-xs text-[#834de3] hover:underline"
                    >
                      Download
                    </a>
                    <button
                      type="button"
                      onClick={() => removeDocument(d.id)}
                      className="text-xs text-gray-500 hover:text-red-600"
                    >
                      {d.isExisting ? 'Delete' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="pt-2">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#834de3] to-[#9260e7] text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm hover:opacity-95 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm({
                    companyName: profileData?.companyName || "",
                    email: profileData?.email || "",
                    phoneNumber: profileData?.phoneNumber || "",
                    location: profileData?.location || "",
                    website: profileData?.website || "",
                    about: profileData?.about || "",
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Confirm delete modal overlay
// We render this conditionally inside the same component block above when confirmId is set
