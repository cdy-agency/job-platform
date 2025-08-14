"use client";

import React from "react";
import CompanyList from "@/components/admin/CompanyList";

export default function AdminCompaniesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
        <p className="text-gray-600 mt-2">Review and manage all registered companies</p>
      </div>
      <CompanyList />
    </div>
  );
}