"use client";
import type React from "react";
import { CompanyDashboardSidebar } from "@/components/company-dashboard-sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCompanyProfile } from "@/lib/api";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        if (user.role === 'superadmin') {
          router.replace('/dashboard/admin');
        } else {
          router.replace('/dashboard/user');
        }
        return;
      }
    } catch {
      router.replace("/login");
      return;
    }
    
    // Fetch company profile data
    fetchCompanyProfile()
      .then((data) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <CompanyDashboardSidebar />
      <main className="flex-1 bg-gray-50">
        {/* Profile completion banner */}
        {profileData && profileData.profileCompletionStatus !== 'complete' && (
          <div className="bg-purple-50 border-b border-purple-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-800">
                    {profileData.statusNotice || 'Complete your profile to unlock job posting and other features.'}
                  </p>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <Link
                  href="/dashboard/company/profile"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Complete Profile
                </Link>
              </div>
            </div>
          </div>
        )}
        {children}
      </main>
      <Toaster />
    </div>
  );
}
