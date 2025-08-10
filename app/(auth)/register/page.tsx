"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Building2 } from "lucide-react";
import CompanyRegistration from "@/components/auth/company-registration";
import EmployeRegistration from "@/components/auth/employee-registration";

export default function RegisterPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Form */}
          <div className="flex-1 p-4 lg:p-8">
            <div>
              {/* Welcome text */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Join Us!
                </h1>
                <p className="text-gray-500">
                  Create your account to get started
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Type Toggle */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    I am a:
                  </Label>
                  <RadioGroup
                    value={formData.userType}
                    onValueChange={(value) =>
                      handleInputChange("userType", value)
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl flex-1">
                      <RadioGroupItem
                        value="employee"
                        id="employee"
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <Label
                        htmlFor="employee"
                        className="flex items-center gap-2 cursor-pointer text-black"
                      >
                        <User className="w-4 h-4" />
                        Job Seeker
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl flex-1">
                      <RadioGroupItem
                        value="company"
                        id="company"
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <Label
                        htmlFor="company"
                        className="flex items-center gap-2 cursor-pointer text-black"
                      >
                        <Building2 className="w-4 h-4" />
                        Company
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Conditional Fields */}
                {formData.userType === "employee" ? (
                  <>
                    <CompanyRegistration />
                  </>
                ) : (
                  <>
                    <EmployeRegistration />
                  </>
                )}

                {/* Password fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="sr-only">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
                      required
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      handleInputChange("agreeToTerms", checked as boolean)
                    }
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-purple-600 hover:text-purple-700"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-purple-600 hover:text-purple-700"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium"
                >
                  Create Account
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
