"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle,
  XCircle,
  Users,
  Building,
  FileCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { adminApproveCompany, adminListCompanies, adminListEmployees } from "@/lib/api"

export default function AdminDashboardPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [comps, emps] = await Promise.all([
          adminListCompanies(),
          adminListEmployees(),
        ])
        setCompanies(comps as any[])
        setEmployees(emps as any[])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalCompanies = companies.length
  const approvedCompanies = companies.filter((c) => c.isApproved).length
  const pendingCompanies = companies.filter((c) => !c.isApproved).length
  const totalEmployees = employees.length

  async function updateCompanyStatus(id: string, approve: boolean) {
    if (approve) {
      const updated = await adminApproveCompany(id)
      setCompanies((prev) => prev.map((c) => (c._id === id ? updated : c)))
    } else {
      // No explicit reject endpoint provided; simulate by removing or leaving as-is
      setCompanies((prev) => prev.filter((c) => c._id !== id))
    }
  }

  return (
    <div className="container max-w-7xl p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-sm text-gray-700">
          Manage companies and employees on the platform
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-black">Total Companies</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Building className="h-5 w-5 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">{totalCompanies}</span>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-black">Approved Companies</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-xl font-semibold text-gray-900">{approvedCompanies}</span>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-black">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <FileCheck className="h-5 w-5 text-yellow-600" />
            <span className="text-xl font-semibold text-gray-900">{pendingCompanies}</span>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-black  ">Total Employees</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Users className="h-5 w-5 text-purple-600" />
            <span className="text-xl font-semibold text-gray-900">{totalEmployees}</span>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Pending Company Registrations</h2>
        {pendingCompanies === 0 ? (
          <p className="text-gray-600 text-sm">No companies awaiting approval.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="text-black">
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left font-medium">Company</th>
                <th className="border border-gray-300 p-2 text-left font-medium">Email</th>
                <th className="border border-gray-300 p-2 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {companies
                .filter((c) => !c.isApproved)
                .map((company) => (
                  <tr key={company._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{company.companyName}</td>
                    <td className="border border-gray-300 p-2">{company.email}</td>
                    <td className="border border-gray-300 p-2 text-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCompanyStatus(company._id, true)}
                        className="text-green-600 border-green-600 hover:bg-green-100 bg-white"
                        aria-label={`Approve ${company.companyName}`}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCompanyStatus(company._id, false)}
                        className="text-red-600 border-red-600 hover:bg-red-100 bg-white"
                        aria-label={`Reject ${company.companyName}`}
                      >
                        <XCircle className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Recent Employees</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm text-black">
          <thead className="font-bold">
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left font-medium">Name</th>
              <th className="border border-gray-300 p-2 text-left font-medium">Email</th>
              <th className="border border-gray-300 p-2 text-left font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id || emp._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{emp.name}</td>
                <td className="border border-gray-300 p-2">{emp.email}</td>
                <td className="border border-gray-300 p-2">employee</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
