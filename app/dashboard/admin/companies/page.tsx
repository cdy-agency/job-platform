"use client";

import React, { useEffect, useState } from "react";
import { fetchCompaniesPendingReview, approveCompanyProfile, rejectCompanyProfile } from "@/lib/api";
import { toast } from "sonner";

interface Company {
  _id: string;
  companyName: string;
  email: string;
  phoneNumber?: string;
  about?: string;
  logo?: {
    url: string;
    name: string;
  };
  documents?: Array<{
    url: string;
    name: string;
    format: string;
  }>;
  profileCompletionStatus: string;
  status: string;
  createdAt: string;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingCompany, setRejectingCompany] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetchCompaniesPendingReview();
      setCompanies(response.companies || []);
    } catch (error) {
      console.error("Error loading companies:", error);
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (companyId: string) => {
    try {
      await approveCompanyProfile(companyId);
      toast.success("Company profile approved successfully");
      loadCompanies(); // Reload the list
    } catch (error: any) {
      console.error("Error approving company:", error);
      toast.error(error.response?.data?.message || "Failed to approve company");
    }
  };

  const handleReject = async (companyId: string) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectCompanyProfile(companyId, rejectReason);
      toast.success("Company profile rejected successfully");
      setRejectReason("");
      setRejectingCompany(null);
      loadCompanies(); // Reload the list
    } catch (error: any) {
      console.error("Error rejecting company:", error);
      toast.error(error.response?.data?.message || "Failed to reject company");
    }
  };

  const openRejectModal = (companyId: string) => {
    setRejectingCompany(companyId);
    setRejectReason("");
  };

  const closeRejectModal = () => {
    setRejectingCompany(null);
    setRejectReason("");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
        <p className="text-gray-600 mt-2">
          Review and manage all registered companies
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Companies Found
          </h2>
          <p className="text-gray-600">
            No companies have registered yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {companies.map((company) => (
            <div key={company._id} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {company.logo ? (
                    <img
                      src={company.logo.url}
                      alt={company.logo.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                      <span className="text-gray-400 text-sm">No Logo</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{company.companyName}</h3>
                    <p className="text-gray-600">{company.email}</p>
                    {company.phoneNumber && (
                      <p className="text-gray-600">{company.phoneNumber}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Registered: {new Date(company.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Status Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    company.status === 'approved' ? 'bg-green-100 text-green-800' :
                    company.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    company.profileCompletionStatus === 'complete' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {company.status === 'approved' ? 'Approved' :
                     company.status === 'rejected' ? 'Rejected' :
                     company.profileCompletionStatus === 'complete' ? 'Complete Profile' :
                     'Incomplete Profile'}
                  </div>
                  
                  {/* Action Buttons */}
                  {company.profileCompletionStatus === 'complete' && company.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(company._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(company._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  
                  {company.status === 'approved' && (
                    <button
                      onClick={() => openRejectModal(company._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    >
                      Revoke Approval
                    </button>
                  )}
                  
                  {company.status === 'rejected' && (
                    <button
                      onClick={() => handleApprove(company._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    >
                      Re-approve
                    </button>
                  )}
                </div>
              </div>

              {company.about && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">About Company</h4>
                  <p className="text-gray-600 text-sm">{company.about}</p>
                </div>
              )}

              {company.documents && company.documents.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {company.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                        <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-gray-600 border">
                          {doc.format === 'pdf' ? '📄' : '📎'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.format.toUpperCase()}</p>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Profile completed on: {new Date(company.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Company Profile</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows={4}
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => handleReject(rejectingCompany)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={closeRejectModal}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}