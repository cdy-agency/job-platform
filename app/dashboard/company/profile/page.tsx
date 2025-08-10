"use client";

import React, { useEffect, useRef, useState } from "react";

type DocumentItem = {
  id: string;
  file: File;
  url: string; // object URL for preview / download
};

export default function CompanyProfilePage() {
  const [form, setForm] = useState({
    name: "TechWave Solutions",
    email: "contact@techwave.com",
    contact: "+250 786 664 545",
    location: "Kigali, Rwanda",
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  // Profile image state: file + preview url
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(
    "/placeholder-company.png"
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Documents (multiple)
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const docInputRef = useRef<HTMLInputElement | null>(null);

  // drag & drop state for styling
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    return () => {
      if (profilePreview && profilePreview.startsWith("blob:")) {
        URL.revokeObjectURL(profilePreview);
      }
      documents.forEach((d) => URL.revokeObjectURL(d.url));
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setProfilePreview("/placeholder-company.png");
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

  const removeDocument = (id: string) => {
    setDocuments((prev) => {
      const rem = prev.find((d) => d.id === id);
      if (rem && rem.url.startsWith("blob:")) URL.revokeObjectURL(rem.url);
      return prev.filter((d) => d.id !== id);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Password validation logic
    if (form.oldPassword || form.password || form.confirmPassword) {
      if (!form.oldPassword) {
        alert("Please enter your current password.");
        return;
      }
      if (!form.password) {
        alert("Please enter a new password.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        alert("New passwords do not match.");
        return;
      }
    }

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("email", form.email);
    payload.append("contact", form.contact);
    payload.append("location", form.location);

    if (form.oldPassword) payload.append("oldPassword", form.oldPassword);
    if (form.password) payload.append("password", form.password);

    if (profileFile) payload.append("profileImage", profileFile);

    documents.forEach((d, idx) => payload.append(`documents[${idx}]`, d.file));

    // TODO: POST to your API endpoint

    alert("Saved (demo). Hook payload to your backend API.");

    // Reset password fields
    setForm((p) => ({
      ...p,
      oldPassword: "",
      password: "",
      confirmPassword: "",
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-lg font-semibold text-gray-900 mb-6">
          Company Profile
        </h1>

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
                  dragActive ? "border-dashed border-gray-400" : "border-transparent"
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
                    <label className="text-xs text-gray-600">PNG, JPG, WEBP — max 4MB</label>

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
                        onClick={() => document.getElementById("profileUpload")?.click()}
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
                  name="name"
                  value={form.name}
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
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    name="contact"
                    value={form.contact}
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
                  />
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
          </div>

          {/* Documents manager (unchanged) */}
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

              <p className="text-xs text-gray-500">PDF, DOCX, PNG — max 6MB each</p>
            </div>

            <div className="mt-3 space-y-2">
              {documents.length === 0 && (
                <div className="text-xs text-gray-500">No documents uploaded yet.</div>
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
                        {(d.file.size / 1024 / 1024).toFixed(2)} MB
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
                      Remove
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
                className="flex-1 bg-gradient-to-r from-[#834de3] to-[#9260e7] text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm hover:opacity-95"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm({
                    name: "TechWave Solutions",
                    email: "contact@techwave.com",
                    contact: "+250 786 664 545",
                    location: "Kigali, Rwanda",
                    oldPassword: "",
                    password: "",
                    confirmPassword: "",
                  });
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm"
              >
                Reset
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tip: forms are demo-only — wire `handleSubmit` to your API to persist changes.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
