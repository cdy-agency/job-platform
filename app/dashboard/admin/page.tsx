"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
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
} from "@/components/ui/card"
import { approveCompany, fetchAdminCompanies, fetchAdminEmployees } from "@/lib/api"

export default function AdminDashboardPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchAdminCompanies(), fetchAdminEmployees()])
      .then(([companiesData, employeesData]) => {
        // Fix: Ensure data is always an array
        const companiesArray = Array.isArray(companiesData) ? companiesData : []
        const employeesArray = Array.isArray(employeesData) ? employeesData : []
        setCompanies(companiesArray)
        setEmployees(employeesArray)
      })
      .finally(() => setLoading(false))
  }, [])

  const updateCompanyStatus = async (id: string) => {
    try {
      await approveCompany(id)
      setCompanies(prev => prev.map(c => c._id === id ? { ...c, isApproved: true } : c))
    } catch (e) {
      // noop
    }
  }

  // Fix: Ensure companies is an array before using filter
  const companiesArray = Array.isArray(companies) ? companies : []
  const totalCompanies = companiesArray.length
  const approvedCompanies = companiesArray.filter((c) => c.isApproved === true).length
  const pendingCompanies = companiesArray.filter((c) => c.isApproved !== true).length
  
  // Fix: Ensure employees is an array
  const employeesArray = Array.isArray(employees) ? employees : []
  const totalEmployees = employeesArray.length

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="container max-w-7xl p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-black mb-1">Admin Dashboard</h1>
        <p className="text-sm text-black">
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
            <span className="text-xl font-semibold text-black">{totalCompanies}</span>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-black">Approved Companies</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-xl font-semibold text-black">{approvedCompanies}</span>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-black">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <FileCheck className="h-5 w-5 text-yellow-600" />
            <span className="text-xl font-semibold text-black">{pendingCompanies}</span>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-black">Total Employees</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Users className="h-5 w-5 text-purple-600" />
            <span className="text-xl font-semibold text-black">{totalEmployees}</span>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-black">Pending Company Registrations</h2>
        {pendingCompanies === 0 ? (
          <p className="text-black text-sm">No companies awaiting approval.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-sm bg-white">
            <thead className="text-black">
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left font-medium">Company</th>
                <th className="border border-gray-300 p-2 text-left font-medium">Email</th>
                <th className="border border-gray-300 p-2 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {companiesArray
                .filter((c) => c.isApproved !== true)
                .map((company) => (
                  <tr key={company._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{company.companyName}</td>
                    <td className="border border-gray-300 p-2">{company.email}</td>
                    <td className="border border-gray-300 p-2 text-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCompanyStatus(company._id)}
                        className="text-green-600 border-green-600 hover:bg-green-100 bg-white"
                        aria-label={`Approve ${company.companyName}`}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" /> Approve
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-black">Recent Employees</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm text-black bg-white">
          <thead className="font-bold">
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left font-medium">Name</th>
              <th className="border border-gray-300 p-2 text-left font-medium">Company</th>
              <th className="border border-gray-300 p-2 text-left font-medium">Position</th>
            </tr>
          </thead>
          <tbody>
            {employeesArray.map((emp) => (
              <tr key={emp._id} className="hover:bg-gray-50">
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