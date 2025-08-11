"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Building2 } from "lucide-react";
import CompanyRegistration from "@/components/auth/company-registration";
import EmployeRegistration from "@/components/auth/employee-registration";
import NavBar from "@/components/home/NavBar";
import { registerCompany, registerEmployee } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const {toast} = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userType: "employee",
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

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (
    field: string,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    setError(null)
    try {
      if (formData.userType === "company") {
        let logoString = "";
        if (formData.logo) {
          logoString = await fileToBase64(formData.logo);
        }
        const payload = {
          companyName: formData.companyName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          location: formData.location,
          phoneNumber: formData.companyPhoneNumber,
          website: formData.website,
          logo: logoString || undefined,
        };
        await registerCompany(payload as any);
        toast({
          title: `${formData.companyName} registered successfully`,
          description: "You can log in now. Company routes require admin approval.",
        })
        router.push('/login')
      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          dateOfBirth: formData.dateOfBirth,
          phoneNumber: formData.employeePhoneNumber,
        };
        await registerEmployee(payload as any);
        toast({
          title: `${formData.name} registered successfully`,
          description: "Welcome! Please log in.",
        })
        router.push('/login')
      }
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Registration failed')
      console.error("Registration error:", error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div>
      <NavBar />
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
                  {formData.userType === "company" ? (
                    <CompanyRegistration
                      formData={{
                        companyName: formData.companyName,
                        email: formData.email,
                        password: formData.password,
                        confirmPassword: formData.confirmPassword,
                        location: formData.location,
                        companyPhoneNumber: formData.companyPhoneNumber,
                        website: formData.website,
                        logo: formData.logo,
                      }}
                      onInputChange={handleInputChange}
                    />
                  ) : (
                    <EmployeRegistration
                      formData={{
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        confirmPassword: formData.confirmPassword,
                        dateOfBirth: formData.dateOfBirth,
                        phoneNumber: formData.employeePhoneNumber,
                      }}
                      onInputChange={handleInputChange as any}
                    />
                  )}

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

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
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
    </div>
  );
}
