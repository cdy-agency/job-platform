"use client";
import type React from "react";
import { CompanyDashboardSidebar } from "@/components/company-dashboard-sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { completeCompanyNextSteps, fetchCompanyProfile } from "@/lib/api";
import CompanyInfoForm from "@/components/auth/about-company";

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [approved, setApproved] = useState<boolean | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [about, setAbout] = useState("");
  const [docs, setDocs] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const userRaw =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!userRaw || !token) {
      router.replace("/login");
      return;
    }
    try {
      const user = JSON.parse(userRaw);
      if (user.role !== "company") {
        router.replace("/dashboard/company");
        return;
      }
    } catch {
      router.replace("/login");
      return;
    }
    // Check approval status via profile
    fetchCompanyProfile()
      .then((data) => {
        if (data?.isApproved === true) setApproved(true);
        else setApproved(false);
      })
      .catch(() => setApproved(false));
  }, [router]);

  if (approved === null) {
    return <div className="p-6">Loading...</div>;
  }

  if (!approved) {
    if (showForm) {
      return <CompanyInfoForm />;
    }
    
    return (
      <div className="min-h-screen flex items-start justify-center p-6 bg-gray-50">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg border border-gray-200 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Account Pending Approval
            </h2>
            <p className="text-gray-600 mb-6">
              Your company account is currently under review. To complete the approval process, 
              please provide additional information about your company and upload required documents.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Approval may take up to 24 hours after you submit the required information.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Click Here to Submit Required Information
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <CompanyDashboardSidebar />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
