"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  Users,
  Building,
  FileCheck,
  Calendar,
  Mail,
  MapPin,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  approveCompany,
  fetchAdminCompanies,
  fetchAdminEmployees,
} from "@/lib/api";

export default function AdminDashboardPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const updateCompanyStatus = async (id: string) => {
    try {
      await approveCompany(id);
      setCompanies((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isApproved: true } : c))
      );
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    const getRecentEmployee = async () => {
      try {
        const res = await fetchAdminEmployees();
        setEmployees(res.employees ?? []);
      } catch (error) {
        console.log("failed to fetch company employee", error);
      } finally {
        setLoading(false);
      }
    };
    getRecentEmployee();
  }, []);

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const res = await fetchAdminCompanies();
        setCompanies(res.companies ?? []);
      } catch (error) {
        console.log("failed to fetch companies", error);
      } finally {
        setLoading(false);
      }
    };
    getCompanies();
  }, []);

  const companiesArray = Array.isArray(companies) ? companies : [];
  const totalCompanies = companiesArray.length;
  const approvedCompanies = companiesArray.filter((c) => c.isApproved === true).length;
  const pendingCompanies = companiesArray.filter((c) => c.isApproved !== true).length;

  const employeesArray = Array.isArray(employees) ? employees : [];
  const totalEmployees = employeesArray.length;
  
  // Get last 5 employees (most recent first)
  const recentEmployees = employeesArray
    .sort((a, b) => new Date(b.createdAt || b.dateJoined || 0).getTime() - new Date(a.createdAt || a.dateJoined || 0).getTime())
    .slice(0, 5);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to get initials
  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage companies and employees on the platform</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-3">Total Companies</p>
                  <p className="text-4xl font-bold text-gray-900">{totalCompanies}</p>
                </div>
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                  <Building className="h-7 w-7 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-3">Approved Companies</p>
                  <p className="text-4xl font-bold text-gray-900">{approvedCompanies}</p>
                </div>
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-3">Pending Approvals</p>
                  <p className="text-4xl font-bold text-gray-900">{pendingCompanies}</p>
                </div>
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <FileCheck className="h-7 w-7 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-3">Total Employees</p>
                  <p className="text-4xl font-bold text-gray-900">{totalEmployees}</p>
                </div>
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                  <Users className="h-7 w-7 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col">
          {/* Pending Company Registrations */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Company Approvals</h2>
                <p className="text-gray-600 mt-1">Review and approve pending registrations</p>
              </div>
              {pendingCompanies > 0 && (
                <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                  {pendingCompanies} pending
                </span>
              )}
            </div>

            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-0">
                {pendingCompanies === 0 ? (
                  <div className="p-12 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-600">No companies awaiting approval</p>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                      <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                        <div className="col-span-5">Company Name</div>
                        <div className="col-span-4">Email Address</div>
                        <div className="col-span-3 text-center">Action</div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                      {companiesArray
                        .filter((c) => c.isApproved !== true)
                        .map((company) => (
                          <div key={company._id} className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150">
                            <div className="grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-5">
                                <p className="font-semibold text-gray-900 text-base">{company.companyName}</p>
                              </div>
                              <div className="col-span-4">
                                <p className="text-gray-600">{company.email}</p>
                              </div>
                              <div className="col-span-3 flex justify-center">
                                <Button
                                  size="sm"
                                  onClick={() => updateCompanyStatus(company._id)}
                                  disabled={!company.about || !company.documents || company.documents.length === 0}
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 h-9 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                  title={!company.about || !company.documents || company.documents.length === 0 ? "Company must complete profile with bio and documents before approval" : ""}
                                >
                                  Approve
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Employees - Enhanced Design */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Applicants</h2>
                <p className="text-gray-600 mt-1">Last 5 employee registrations</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Latest 5
                </span>
                <Link href="/dashboard/admin/employees" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View all {totalEmployees} →
                </Link>
              </div>
            </div>

            <Card className="bg-white shadow-sm border border-gray-100 overflow-hidden">
              <CardContent className="p-0">
                {recentEmployees.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees yet</h3>
                    <p className="text-gray-600">Employee registrations will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {recentEmployees.map((emp, index) => (
                      <div key={emp._id} className="p-2 hover:bg-gray-50/70 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
          
                            {/* Employee Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 text-base">
                                  {emp.name || 'Name not provided'}
                                </h3>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  <span>{emp.email}</span>
                                </div>              
                              </div>
                            </div>
                          </div>

                          {/* Right side info */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(emp.createdAt || emp.dateJoined)}</span>
                              </div>
                              {emp.company && (
                                <div className="text-xs text-gray-400">
                                  {emp.company}
                                </div>
                              )}
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Additional info if available */}
                        {(emp.skills || emp.department || emp.position) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {emp.position && (
                                <span className="px-2 py-1 bg-gray-100 rounded">
                                  {emp.position}
                                </span>
                              )}
                              {emp.department && (
                                <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded">
                                  {emp.department}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}