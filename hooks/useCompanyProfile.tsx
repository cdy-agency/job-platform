"use client";

import { useEffect, useRef, useState } from "react";
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

export type DocumentItem = {
  id: string;
  file: File;
  url: string; 
  isExisting?: boolean;
  originalIndex?: number;
};

export type TeamMember = {
  id: string;
  position: string;
  phoneNumber: string;
};

export type FormData = {
  companyName: string;
  email: string;
  phoneNumber: string;
  province: string;
  district: string;
  website: string;
  about: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// Static data for provinces and districts
export const provincesWithDistricts: Record<string, string[]> = {
  Kigali: ["Gasabo", "Kicukiro", "Nyarugenge"],
  "Eastern Province": [
    "Bugesera",
    "Gatsibo",
    "Kayonza",
    "Kirehe",
    "Ngoma",
    "Nyagatare",
    "Rwamagana",
  ],
  "Northern Province": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  "Western Province": [
    "Karongi",
    "Ngororero",
    "Nyabihu",
    "Nyamasheke",
    "Rubavu",
    "Rusizi",
    "Rutsiro",
  ],
  "Southern Province": [
    "Gisagara",
    "Huye",
    "Kamonyi",
    "Muhanga",
    "Nyamagabe",
    "Nyanza",
    "Nyaruguru",
    "Ruhango",
  ],
};

export function useCompanyProfile() {
  const { toast } = useToast();
  
  // Form state
  const [form, setForm] = useState<FormData>({
    companyName: "",
    email: "",
    phoneNumber: "",
    province: "",
    district: "",
    website: "",
    about: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Team members state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Loading and data states
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  // Profile image state
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>("/placeholder-logo.png");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Documents state
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const docInputRef = useRef<HTMLInputElement | null>(null);

  // UI states
  const [dragActive, setDragActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'activate' | 'deactivate' | 'delete' | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchCompanyProfile();
        setProfileData(data);

        setIsProfileIncomplete(
          !data.about || 
          !data.logo?.url || 
          !data.documents?.length ||
          data.status === 'incomplete'
        );

        setForm({
          companyName: data.companyName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          province: data.province || "",
          district: data.district || "",
          website: data.website || "",
          about: data.about || "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Load team members
        if (data.teamMembers && Array.isArray(data.teamMembers)) {
          const loadedTeamMembers = data.teamMembers.map((member: any, index: number) => ({
            id: `existing-${index}`,
            position: member.position || "",
            phoneNumber: member.phoneNumber || "",
          }));
          setTeamMembers(loadedTeamMembers);
        }

        if (data.logo?.url) {
          setProfilePreview(data.logo.url);
        }

        if (data.documents && Array.isArray(data.documents)) {
          const existingDocs = data.documents.map((doc: any, index: number) => ({
            id: `existing-${index}`,
            file: new File([], doc.name || `Document ${index + 1}`),
            url: doc.url,
            isExisting: true,
            originalIndex: index,
          }));
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
  }, [toast]);

  // Cleanup URLs on unmount
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
  }, [profilePreview, documents]);

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle province change - reset district when province changes
    if (name === 'province') {
      setForm((p) => ({ ...p, [name]: value, district: "" }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({
      companyName: profileData?.companyName || "",
      email: profileData?.email || "",
      phoneNumber: profileData?.phoneNumber || "",
      province: profileData?.province || "",
      district: profileData?.district || "",
      website: profileData?.website || "",
      about: profileData?.about || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Reset team members
    if (profileData?.teamMembers && Array.isArray(profileData.teamMembers)) {
      const loadedTeamMembers = profileData.teamMembers.map((member: any, index: number) => ({
        id: `existing-${index}`,
        position: member.position || "",
        phoneNumber: member.phoneNumber || "",
      }));
      setTeamMembers(loadedTeamMembers);
    } else {
      setTeamMembers([]);
    }
  };

  // Team member handlers
  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      position: "",
      phoneNumber: "",
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const updateTeamMember = (id: string, field: 'position' | 'phoneNumber', value: string) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  // Profile image handlers
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

  const removeProfileImage = () => {
    if (profilePreview && profilePreview.startsWith("blob:")) {
      URL.revokeObjectURL(profilePreview);
    }
    setProfileFile(null);
    setProfilePreview("/placeholder-logo.png");
    setUploadError(null);
  };

  // Drag and drop handlers
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

  // Document handlers
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

  const removeDocument = async (id: string) => {
    const doc = documents.find(d => d.id === id);
    
    if (doc?.isExisting) {
      if (!Number.isInteger(doc.originalIndex)) return;
      setConfirmId(id);
      return;
    }

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
      
      setDocuments((prev) => prev.filter((d) => d.id !== confirmId));
      toast({
        title: `Document ${doc.url}`,
        description: "Deleted successfully",
      });
      
      const updatedData = await fetchCompanyProfile();
      setProfileData(updatedData);
      
      if (updatedData.documents && Array.isArray(updatedData.documents)) {
        const existingDocs = updatedData.documents.map((doc: any, index: number) => ({
          id: `existing-${index}`,
          file: new File([], doc.name || `Document ${index + 1}`),
          url: doc.url,
          isExisting: true,
          originalIndex: index,
        }));
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

  // Modal handlers
  const openModal = (action: 'activate' | 'deactivate' | 'delete') => {
    setModalAction(action);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalAction(null);
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
      
      const updatedData = await fetchCompanyProfile();
      setProfileData(updatedData);
    } catch (e: any) {
      toast({
        title: `Failed to ${modalAction}`,
        description: e.response?.data?.message || "Failed to delete document",
      });
    } finally {
      setModalLoading(false);
      closeModal();
    }
  };

  // Profile completion handler
  const handleCompleteProfile = async () => {
    if (!form.about.trim()) {
      toast({ title: `Please provide company description` });
      return;
    }

    if (!profileFile && !profileData?.logo?.url) {
      toast({ title: `Please upload a company logo` });
      return;
    }

    const newDocs = documents.filter((d) => !d.isExisting).map((d) => d.file);
    
    if (newDocs.length === 0 && (!profileData?.documents || profileData.documents.length === 0)) {
      toast({ title: `Please upload at least one document` });
      return;
    }

    setLoading(true);
    try {
      const completeData: { about?: string; logo?: File; documents?: File[] } = {};
      
      if (form.about.trim()) completeData.about = form.about;
      if (profileFile) completeData.logo = profileFile;
      if (newDocs.length > 0) completeData.documents = newDocs;

      await completeCompanyProfile(completeData);
      toast({
        title: `Profile completed successfully!`,
        description: "Awaiting admin approval.",
      });
      
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

  // Main form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Password validation
      if (form.oldPassword || form.newPassword || form.confirmPassword) {
        if (!form.oldPassword) {
          toast({ title: `Please enter your current password.`, description: "Try Again" });
          setLoading(false);
          return;
        }
        if (!form.newPassword) {
          toast({ title: `Please enter a new password.` });
          setLoading(false);
          return;
        }
        if (form.newPassword !== form.confirmPassword) {
          toast({ title: `New passwords do not match.` });
          setLoading(false);
          return;
        }
      }

      const updateData: any = {
        companyName: form.companyName,
        phoneNumber: form.phoneNumber,
        province: form.province,
        district: form.district,
        website: form.website,
        about: form.about,
      };

      if (form.oldPassword && form.newPassword) {
        updateData.oldPassword = form.oldPassword;
        updateData.newPassword = form.newPassword;
      }

      // Add team members to update data
      const validTeamMembers = teamMembers.filter(member => 
        member.position.trim() && member.phoneNumber.trim()
      );
      if (validTeamMembers.length > 0) {
        updateData.teamMembers = validTeamMembers.map(member => ({
          position: member.position,
          phoneNumber: member.phoneNumber,
        }));
      }

      await updateCompanyProfile(updateData);

      const newDocs = documents.filter((d) => !d.isExisting).map((d) => d.file);

      if (profileFile) {
        await updateCompanyLogo(profileFile);
      }

      if (newDocs.length > 0) {
        await uploadCompanyDocuments(newDocs);
      }

      toast({
        title: `Good`,
        description: "Profile updated successfully"
      });

      setForm((p) => ({
        ...p,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

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

  // Get available districts based on selected province
  const getAvailableDistricts = () => {
    return form.province ? provincesWithDistricts[form.province] || [] : [];
  };

  return {
    // State
    form,
    loading,
    profileData,
    profileFile,
    profilePreview,
    uploadError,
    documents,
    dragActive,
    showModal,
    modalAction,
    modalLoading,
    confirmId,
    deletingDocId,
    isProfileIncomplete,
    docInputRef,
    teamMembers,
    provincesWithDistricts,

    // Handlers
    handleChange,
    resetForm,
    handleProfileFile,
    removeProfileImage,
    onDragOver,
    onDragLeave,
    onDrop,
    onDocumentsSelected,
    removeDocument,
    confirmDeleteDocument,
    openModal,
    closeModal,
    handleModalAction,
    handleCompleteProfile,
    handleSubmit,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    getAvailableDistricts,

    // Helper functions
    onProfileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] || null;
      handleProfileFile(f);
    },
    onDocInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      onDocumentsSelected(e.target.files);
    },
    cancelConfirmDelete: () => setConfirmId(null),
  };
}