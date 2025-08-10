import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const EmployeRegistration = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="sr-only">
            Company Name
          </Label>
          <Input
            id="companyName"
            type="text"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="sr-only">
            Company Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Company Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="sr-only">
            Location
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="Company Location (Optional)"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyPhoneNumber" className="sr-only">
            Phone Number
          </Label>
          <Input
            id="companyPhoneNumber"
            type="tel"
            placeholder="Company Phone Number (Optional)"
            value={formData.companyPhoneNumber}
            onChange={(e) =>
              handleInputChange("companyPhoneNumber", e.target.value)
            }
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="website" className="sr-only">
            Website
          </Label>
          <Input
            id="website"
            type="url"
            placeholder="Company Website (Optional)"
            value={formData.website}
            onChange={(e) => handleInputChange("website", e.target.value)}
            className="h-12 px-4 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="logo" className="text-sm font-medium text-gray-700">
            Company Logo (Optional)
          </Label>
          <Input
            id="logo"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              handleInputChange("logo", file);
            }}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 bg-white text-black"
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeRegistration;
