"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CompanyRegistration = () => {
     const [formData, setFormData] = useState({
    // Common fields
    email: "",
    password: "",
    confirmPassword: "",
    userType: "employee", // 'employee' or 'company'
    agreeToTerms: false,

    // Employee fields
    name: "",
    dateOfBirth: "",
    employeePhoneNumber: "",

    // Company fields
    companyName: "",
    location: "",
    companyPhoneNumber: "",
    website: "",
    logo: null as File | null,
  });

  const handleInputChange = (
    field: string,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration attempt:", formData);
  };
  return (
    <div>
      {/* 2-by-2 Grid for Employee Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="sr-only">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="dateOfBirth"
            className="text-sm font-medium text-gray-700"
          >
            Date of Birth (Optional)
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="employeePhoneNumber" className="sr-only">
            Phone Number
          </Label>
          <Input
            id="employeePhoneNumber"
            type="tel"
            placeholder="Phone Number (Optional)"
            value={formData.employeePhoneNumber}
            onChange={(e) =>
              handleInputChange("employeePhoneNumber", e.target.value)
            }
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
