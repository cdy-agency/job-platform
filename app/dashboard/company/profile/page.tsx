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
import { useToast } from "@/hooks/use-toast";

type DocumentItem = {
  id: string;
  file: File;
  url: string; 
  isExisting?: boolean;
  originalIndex?: number;
};

export default function CompanyProfilePage() {
  const { toast } = useToast()
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

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'activate' | 'deactivate' | 'delete' | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Document deletion confirmation state
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  // Profile completion state
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchCompanyProfile();
        setProfileData(data);

        // Check if profile is incomplete
        setIsProfileIncomplete(
          !data.about || 
          !data.logo?.url || 
          !data.documents?.length ||
          data.status === 'incomplete'
        );

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
        toast({
          title: `Failed to load profile data`,
          description: "Try Again!",
        });
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

  const removeDocument = async (id: string) => {
    const doc = documents.find(d => d.id === id);
    
    if (doc?.isExisting) {
      if (!Number.isInteger(doc.originalIndex)) return;
      setConfirmId(id);
      return;
    }

    // Remove new/uploaded document
    setDocuments((prev) => {
      const rem = prev.find((d) => d.id === id);
      if (rem && rem.url.startsWith("blob:")) URL.revokeObjectURL(rem.url);
      return prev.filter((d) => d.id !== id);
    });
  };

  const confirmDeleteDocument = async () => {
    if (!confirmId) return;
    
    const doc = documents.find(d => d.id === confirmId);
    if (!doc?.isExisting || !Number.isInteger(doc.originalIndex)) return;

    setDeletingDocId(confirmId);
    
    try {
      await deleteCompanyDocument(doc.originalIndex!);
      
      // Remove from local state
      setDocuments((prev) => prev.filter((d) => d.id !== confirmId));
      toast({
          title: `Document ${doc.url}`,
          description: "Deleted successfully",
        });
      
      // Refresh profile data to get updated document indices
      const updatedData = await fetchCompanyProfile();
      setProfileData(updatedData);
      
      // Update documents with new indices
      if (updatedData.documents && Array.isArray(updatedData.documents)) {
        const existingDocs = updatedData.documents.map(
          (doc: any, index: number) => ({
            id: `existing-${index}`,
            file: new File([], doc.name || `Document ${index + 1}`),
            url: doc.url,
            isExisting: true,
            originalIndex: index,
          })
        );
        // Keep new documents that aren't saved yet
        const newDocs = documents.filter(d => !d.isExisting);
        setDocuments([...newDocs, ...existingDocs]);
      }
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast({
          title: `Failed to delete ${doc.url}`,
          description: error.response?.data?.message || "Failed to delete document",
        });
    } finally {
      setDeletingDocId(null);
      setConfirmId(null);
    }
  };

  const handleModalAction = async () => {
    if (!modalAction) return;
    
    setModalLoading(true);
    try {
      if (modalAction === 'deactivate') {
        await deactivateCompanyAccount();
        toast({
          title: `Company deactivated`,
          description: "You can Activate Again",
        });
      } else if (modalAction === 'activate') {
        await activateCompanyAccount();
        toast({
          title: `Company Activated`,
          description: "You can Deactivate it Again",
        });
      } else if (modalAction === 'delete') {
        await deleteCompanyAccount();
        toast({
          title: `OOOPS`,
          description: "Your account deleted sucessfully!",
        });
      }
      
      // Reload profile data
      const updatedData = await fetchCompanyProfile();
      setProfileData(updatedData);
    } catch (e: any) {
      toast({
          title: `Failed to ${modalAction}`,
          description: e.response?.data?.message || "Failed to delete document",
        });
    } finally {
      setModalLoading(false);
      setShowModal(false);
      setModalAction(null);
    }
  };

  const openModal = (action: 'activate' | 'deactivate' | 'delete') => {
    setModalAction(action);
    setShowModal(true);
  };

  const handleCompleteProfile = async () => {
    if (!form.about.trim()) {
      toast({
          title: `Please provide company description`,
        });
      return;
    }

    if (!profileFile && !profileData?.logo?.url) {
      toast({
          title: `Please upload a company logo`,
        });
      return;
    }

    const newDocs = documents.filter((d) => !d.isExisting).map((d) => d.file);
    
    if (newDocs.length === 0 && (!profileData?.documents || profileData.documents.length === 0)) {
      toast({
          title: `Please upload at least one document`,
        });
      return;
    }

    setLoading(true);
    try {
      const completeData: { about?: string; logo?: File; documents?: File[] } = {};
      
      if (form.about.trim()) {
        completeData.about = form.about;
      }
      
      if (profileFile) {
        completeData.logo = profileFile;
      }
      
      if (newDocs.length > 0) {
        completeData.documents = newDocs;
      }

      await completeCompanyProfile(completeData);
      toast({
          title: `Profile completed successfully!`,
          description: "Awaiting admin approval.",
        });
      // Reload profile data
      const updatedData = await fetchCompanyProfile();
      setProfileData(updatedData);
      setIsProfileIncomplete(false);
      
    } catch (error: any) {
      console.error("Error completing profile:", error);
      toast({
          title: `Failed to complete profile`,
          description: error.response?.data?.message,
        });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Password validation logic
      if (form.oldPassword || form.newPassword || form.confirmPassword) {
        if (!form.oldPassword) {
          toast({
          title: `Please enter your current password.`,
          description: "Try Again",
        });
          setLoading(false);
          return;
        }
        if (!form.newPassword) {
          toast({
          title: `Please enter a new password.`,
        });
          setLoading(false);
          return;
        }
        if (form.newPassword !== form.confirmPassword) {
          toast({
          title: `New passwords do not match.`,
        });
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

      toast({
          title: `Goood`,
          description:"Profile updated successfully"
        });

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
      toast({
          title: `Failed to update profile`,
          description: error.response?.data?.message
        });
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
        
        {/* Profile Completion Banner */}
        {isProfileIncomplete && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-amber-600 mt-0.5">⚠️</div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-800 mb-1">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-amber-700 mb-3">
                  Your profile is incomplete. Please add a company description, logo, and at least one document to submit for approval.
                </p>
                <button
                  onClick={handleCompleteProfile}
                  disabled={loading}
                  className="text-sm px-3 py-1 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
                >
                  {loading ? "Completing..." : "Complete Profile"}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Status Indicator */}
        {profileData && (
          <div className="mb-4 p-3 rounded-md bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Account Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                profileData.status === 'approved' && profileData.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : profileData.status === 'disabled' || !profileData.isActive
                  ? 'bg-red-100 text-red-800'
                  : profileData.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : profileData.status === 'incomplete'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {profileData.status === 'approved' && profileData.isActive 
                  ? 'Active & Approved' 
                  : profileData.status === 'disabled' || !profileData.isActive
                  ? 'Disabled'
                  : profileData.status === 'pending'
                  ? 'Pending Approval'
                  : profileData.status === 'incomplete'
                  ? 'Profile Incomplete'
                  : profileData.status}
              </span>
            </div>
          </div>
        )}
        
        <div className="mb-4 flex gap-2">
          {profileData?.status === 'disabled' || !profileData?.isActive ? (
            <button
              type="button"
              onClick={() => openModal('activate')}
              className="text-xs px-3 py-1 rounded-md border border-green-200 text-green-700 hover:bg-green-50"
            >
              Activate Account
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openModal('deactivate')}
              className="text-xs px-3 py-1 rounded-md border border-red-200 text-red-700 hover:bg-red-50"
            >
              Deactivate Account
            </button>
          )}
          <button
            type="button"
            onClick={() => openModal('delete')}
            className="text-xs px-3 py-1 rounded-md border border-red-300 text-red-800 hover:bg-red-100"
          >
            Delete Account
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
                      disabled={deletingDocId === d.id}
                      className="text-xs text-gray-500 hover:text-red-600 disabled:opacity-50"
                    >
                      {deletingDocId === d.id ? 'Deleting...' : (d.isExisting ? 'Delete' : 'Remove')}
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

      {/* Account Action Modal */}
      {showModal && modalAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {modalAction === 'delete' ? 'Delete Company Account' : 
                modalAction === 'deactivate' ? 'Deactivate Company Account' : 'Activate Company Account'}
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              {modalAction === 'delete' ? 'This action will permanently delete your company account and cannot be undone. All data will be lost.' :
                modalAction === 'deactivate' ? 'Your company account will be deactivated. You won\'t be able to post jobs or access company features until reactivated.' :
                'Your company account will be reactivated. You\'ll regain access to all company features.'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleModalAction}
                disabled={modalLoading}
                className={`px-4 py-2 rounded-md text-white hover:opacity-90 disabled:opacity-50 ${
                  modalAction === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                  modalAction === 'deactivate' ? 'bg-orange-600 hover:bg-orange-700' :
                  'bg-green-600 hover:bg-green-700'
                }`}
              >
                {modalLoading ? "Processing..." : 
                  modalAction === 'delete' ? 'Delete Account' :
                  modalAction === 'deactivate' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Delete Confirmation Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Document
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100"
                disabled={deletingDocId === confirmId}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteDocument}
                disabled={deletingDocId === confirmId}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deletingDocId === confirmId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}