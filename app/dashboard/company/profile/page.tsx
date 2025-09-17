"use client";

import React from "react";
import { useCompanyProfile, DocumentItem, FormData, TeamMember } from "@/hooks/useCompanyProfile";
// Status Badge Component
const StatusBadge = ({ profileData }: { profileData: any }) => {
  if (!profileData) return null;

  const getStatusConfig = () => {
    if (profileData.status === 'approved' && profileData.isActive) {
      return {
        className: 'bg-green-100 text-green-800',
        text: 'Active & Approved'
      };
    } else if (profileData.status === 'disabled' || !profileData.isActive) {
      return {
        className: 'bg-red-100 text-red-800',
        text: 'Disabled'
      };
    } else if (profileData.status === 'pending') {
      return {
        className: 'bg-yellow-100 text-yellow-800',
        text: 'Pending Approval'
      };
    } else if (profileData.status === 'incomplete') {
      return {
        className: 'bg-orange-100 text-orange-800',
        text: 'Profile Incomplete'
      };
    } else {
      return {
        className: 'bg-gray-100 text-gray-800',
        text: profileData.status
      };
    }
  };

  const { className, text } = getStatusConfig();

  return (
    <div className="mb-4 p-3 rounded-md bg-gray-50 border border-gray-200">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Account Status:</span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
          {text}
        </span>
      </div>
    </div>
  );
};

// Profile Completion Banner Component
const ProfileCompletionBanner = ({ 
  isProfileIncomplete, 
  loading, 
  onComplete 
}: { 
  isProfileIncomplete: boolean;
  loading: boolean;
  onComplete: () => void;
}) => {
  if (!isProfileIncomplete) return null;

  return (
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
            onClick={onComplete}
            disabled={loading}
            className="text-sm px-3 py-1 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
          >
            {loading ? "Completing..." : "Complete Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Account Action Buttons Component
const AccountActionButtons = ({ 
  profileData, 
  onOpenModal 
}: { 
  profileData: any;
  onOpenModal: (action: 'activate' | 'deactivate' | 'delete') => void;
}) => {
  if (!profileData) return null;

  const isDisabled = profileData.status === 'disabled' || !profileData.isActive;

  return (
    <div className="mb-4 flex gap-2">
      {isDisabled ? (
        <button
          type="button"
          onClick={() => onOpenModal('activate')}
          className="text-xs px-3 py-1 rounded-md border border-green-200 text-green-700 hover:bg-green-50"
        >
          Activate Account
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onOpenModal('deactivate')}
          className="text-xs px-3 py-1 rounded-md border border-red-200 text-red-700 hover:bg-red-50"
        >
          Deactivate Account
        </button>
      )}
      <button
        type="button"
        onClick={() => onOpenModal('delete')}
        className="text-xs px-3 py-1 rounded-md border border-red-300 text-red-800 hover:bg-red-100"
      >
        Delete Account
      </button>
    </div>
  );
};

// Logo Upload Component
const LogoUpload = ({
  profilePreview,
  dragActive,
  uploadError,
  onDragOver,
  onDragLeave,
  onDrop,
  onProfileInputChange,
  onRemove
}: {
  profilePreview: string | null;
  dragActive: boolean;
  uploadError: string | null;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onProfileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) => {
  return (
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
                onClick={() => document.getElementById("profileUpload")?.click()}
                className="flex-1 text-sm px-3 py-1 rounded-md border border-gray-200 bg-white text-gray-700 hover:shadow-sm"
              >
                Change
              </button>
              <button
                type="button"
                onClick={onRemove}
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
  );
};

// Company Info Form Component
const CompanyInfoForm = ({ 
  form, 
  onChange,
  provincesWithDistricts,
  availableDistricts
}: { 
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  provincesWithDistricts: Record<string, string[]>;
  availableDistricts: string[];
}) => {
  return (
    <div className="md:col-span-2 space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700">
          Company Name
        </label>
        <input
          name="companyName"
          value={form.companyName}
          onChange={onChange}
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
            onChange={onChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Province
          </label>
          <select
            name="province"
            value={form.province}
            onChange={onChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
          >
            <option value="">Select Province</option>
            {Object.keys(provincesWithDistricts).map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">
            District
          </label>
          <select
            name="district"
            value={form.district}
            onChange={onChange}
            disabled={!form.province}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30 disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="">Select District</option>
            {availableDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700">
          Website
        </label>
        <input
          name="website"
          value={form.website}
          onChange={onChange}
          placeholder="https://example.com"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700">
          About Company
        </label>
        <textarea
          name="about"
          value={form.about}
          onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
          onChange={onChange}
          placeholder="Re-enter your new password"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#834de3] focus:ring-[#834de3]/30"
        />
      </div>
    </div>
  );
};

// Team Members Manager Component
const TeamMembersManager = ({
  teamMembers,
  onAddMember,
  onUpdateMember,
  onRemoveMember
}: {
  teamMembers: TeamMember[];
  onAddMember: () => void;
  onUpdateMember: (id: string, field: 'position' | 'phoneNumber', value: string) => void;
  onRemoveMember: (id: string) => void;
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-xs font-medium text-gray-700">
          Team Members
        </label>
        <button
          type="button"
          onClick={onAddMember}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gradient-to-r from-[#834de3] to-[#9260e7] text-white hover:opacity-90"
        >
          <span className="text-sm">+</span>
          Add Member
        </button>
      </div>

      <div className="space-y-3">
        {teamMembers.length === 0 && (
          <div className="text-xs text-gray-500 p-3 border border-dashed border-gray-200 rounded-md text-center">
            No team members added yet. Click "Add Member" to add team member contact information.
          </div>
        )}

        {teamMembers.map((member, index) => (
          <div
            key={member.id}
            className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">
                Team Member #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => onRemoveMember(member.id)}
                className="text-xs text-red-600 hover:text-red-700 p-1"
                title="Remove member"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Position/Role
                </label>
                <input
                  type="text"
                  value={member.position}
                  onChange={(e) => onUpdateMember(member.id, 'position', e.target.value)}
                  placeholder="e.g. HR Manager, CEO, Developer"
                  className="w-full text-xs px-2 py-1 border border-gray-300 rounded-md focus:border-[#834de3] focus:ring-[#834de3]/30"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={member.phoneNumber}
                  onChange={(e) => onUpdateMember(member.id, 'phoneNumber', e.target.value)}
                  placeholder="+250 7XX XXX XXX"
                  className="w-full text-xs px-2 py-1 border border-gray-300 rounded-md focus:border-[#834de3] focus:ring-[#834de3]/30"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {teamMembers.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Only team members with both position and phone number filled will be saved.
        </div>
      )}
    </div>
  );
};

// Documents Manager Component
const DocumentsManager = ({
  documents,
  docInputRef,
  deletingDocId,
  onDocInputChange,
  onRemoveDocument
}: {
  documents: DocumentItem[];
  docInputRef: React.RefObject<HTMLInputElement | null>;
  deletingDocId: string | null;
  onDocInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveDocument: (id: string) => void;
}) => {
  return (
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
                onClick={() => onRemoveDocument(d.id)}
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
  );
};

// Form Action Buttons Component
const FormActionButtons = ({
  loading,
  onReset
}: {
  loading: boolean;
  onReset: () => void;
}) => {
  return (
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
          onClick={onReset}
          className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// Account Action Modal Component
const AccountActionModal = ({
  showModal,
  modalAction,
  modalLoading,
  onConfirm,
  onCancel
}: {
  showModal: boolean;
  modalAction: 'activate' | 'deactivate' | 'delete' | null;
  modalLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!showModal || !modalAction) return null;

  const getModalConfig = () => {
    switch (modalAction) {
      case 'delete':
        return {
          title: 'Delete Company Account',
          description: 'This action will permanently delete your company account and cannot be undone. All data will be lost.',
          buttonClass: 'bg-red-600 hover:bg-red-700',
          buttonText: 'Delete Account'
        };
      case 'deactivate':
        return {
          title: 'Deactivate Company Account',
          description: 'Your company account will be deactivated. You won\'t be able to post jobs or access company features until reactivated.',
          buttonClass: 'bg-orange-600 hover:bg-orange-700',
          buttonText: 'Deactivate'
        };
      case 'activate':
        return {
          title: 'Activate Company Account',
          description: 'Your company account will be reactivated. You\'ll regain access to all company features.',
          buttonClass: 'bg-green-600 hover:bg-green-700',
          buttonText: 'Activate'
        };
    }
  };

  const { title, description, buttonClass, buttonText } = getModalConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-700 mb-4">
          {description}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={modalLoading}
            className={`px-4 py-2 rounded-md text-white hover:opacity-90 disabled:opacity-50 ${buttonClass}`}
          >
            {modalLoading ? "Processing..." : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Document Delete Confirmation Modal Component
const DocumentDeleteModal = ({
  confirmId,
  deletingDocId,
  onConfirm,
  onCancel
}: {
  confirmId: string | null;
  deletingDocId: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!confirmId) return null;

  return (
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
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100"
            disabled={deletingDocId === confirmId}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deletingDocId === confirmId}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deletingDocId === confirmId ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Company Profile Page Component
export default function CompanyProfilePage() {
  const hook = useCompanyProfile();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-lg font-semibold text-gray-900 mb-6">
          Company Profile
        </h1>
        
        <ProfileCompletionBanner
          isProfileIncomplete={hook.isProfileIncomplete}
          loading={hook.loading}
          onComplete={hook.handleCompleteProfile}
        />
        
        <StatusBadge profileData={hook.profileData} />
        
        <AccountActionButtons
          profileData={hook.profileData}
          onOpenModal={hook.openModal}
        />
        
        <form
          onSubmit={hook.handleSubmit}
          className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <LogoUpload
              profilePreview={hook.profilePreview}
              dragActive={hook.dragActive}
              uploadError={hook.uploadError}
              onDragOver={hook.onDragOver}
              onDragLeave={hook.onDragLeave}
              onDrop={hook.onDrop}
              onProfileInputChange={hook.onProfileInputChange}
              onRemove={hook.removeProfileImage}
            />

            <CompanyInfoForm
              form={hook.form}
              onChange={hook.handleChange}
              provincesWithDistricts={hook.provincesWithDistricts}
              availableDistricts={hook.getAvailableDistricts()}
            />
          </div>

          <TeamMembersManager
            teamMembers={hook.teamMembers}
            onAddMember={hook.addTeamMember}
            onUpdateMember={hook.updateTeamMember}
            onRemoveMember={hook.removeTeamMember}
          />

          <DocumentsManager
            documents={hook.documents}
            docInputRef={hook.docInputRef}
            deletingDocId={hook.deletingDocId}
            onDocInputChange={hook.onDocInputChange}
            onRemoveDocument={hook.removeDocument}
          />

          <FormActionButtons
            loading={hook.loading}
            onReset={hook.resetForm}
          />
        </form>
      </div>

      <AccountActionModal
        showModal={hook.showModal}
        modalAction={hook.modalAction}
        modalLoading={hook.modalLoading}
        onConfirm={hook.handleModalAction}
        onCancel={hook.closeModal}
      />

      <DocumentDeleteModal
        confirmId={hook.confirmId}
        deletingDocId={hook.deletingDocId}
        onConfirm={hook.confirmDeleteDocument}
        onCancel={hook.cancelConfirmDelete}
      />
    </div>
  );
}