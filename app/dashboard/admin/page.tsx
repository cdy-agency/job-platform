"use client"

import Link from "next/link"
import { useState } from "react"
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

const mockCompanies = [
  {
    id: "c1",
    name: "Acme Inc",
    email: "contact@acme.com",
    status: "Pending",
    employeesCount: 12,
  },
  {
    id: "c2",
    name: "Globex Corp",
    email: "hr@globex.com",
    status: "Approved",
    employeesCount: 50,
  },
  {
    id: "c3",
    name: "Umbrella Co",
    email: "admin@umbrella.com",
    status: "Rejected",
    employeesCount: 8,
  },
]

const mockEmployees = [
  { id: "e1", name: "John Doe", company: "Acme Inc", position: "Developer" },
  { id: "e2", name: "Jane Smith", company: "Globex Corp", position: "Designer" },
  { id: "e3", name: "Alice Johnson", company: "Globex Corp", position: "Manager" },
  { id: "e4", name: "Bob Brown", company: "Umbrella Co", position: "Sales" },
]

export default function AdminDashboardPage() {
  const [companies, setCompanies] = useState(mockCompanies)

  function updateCompanyStatus(id: string, status: "Approved" | "Rejected") {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === id ? { ...company, status } : company
      )
    )
  }

  const totalCompanies = companies.length
  const approvedCompanies = companies.filter((c) => c.status === "Approved").length
  const pendingCompanies = companies.filter((c) => c.status === "Pending").length
  const totalEmployees = mockEmployees.length

  return (
    <div className="container max-w-7xl p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-sm text-gray-700">
          Manage companies and employees on the platform
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Building className="h-5 w-5 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">{totalCompanies}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Approved Companies</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-xl font-semibold text-gray-900">{approvedCompanies}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <FileCheck className="h-5 w-5 text-yellow-600" />
            <span className="text-xl font-semibold text-gray-900">{pendingCompanies}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
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
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left font-medium">Company</th>
                <th className="border border-gray-300 p-2 text-left font-medium">Email</th>
                <th className="border border-gray-300 p-2 text-center font-medium">Employees</th>
                <th className="border border-gray-300 p-2 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies
                .filter((c) => c.status === "Pending")
                .map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{company.name}</td>
                    <td className="border border-gray-300 p-2">{company.email}</td>
                    <td className="border border-gray-300 p-2 text-center">{company.employeesCount}</td>
                    <td className="border border-gray-300 p-2 text-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCompanyStatus(company.id, "Approved")}
                        className="text-green-600 border-green-600 hover:bg-green-100"
                        aria-label={`Approve ${company.name}`}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCompanyStatus(company.id, "Rejected")}
                        className="text-red-600 border-red-600 hover:bg-red-100"
                        aria-label={`Reject ${company.name}`}
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
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left font-medium">Name</th>
              <th className="border border-gray-300 p-2 text-left font-medium">Company</th>
              <th className="border border-gray-300 p-2 text-left font-medium">Position</th>
            </tr>
          </thead>
          <tbody>
            {mockEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{emp.name}</td>
                <td className="border border-gray-300 p-2">{emp.company}</td>
                <td className="border border-gray-300 p-2">{emp.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
