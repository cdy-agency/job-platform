"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Building2, Router } from "lucide-react";
import CompanyRegistration from "@/components/auth/company-registration";
import EmployeRegistration from "@/components/auth/employee-registration";
import NavBar from "@/components/home/NavBar";
import {
  createCompanyFormData,
  registerCompany,
  registerEmployee,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating ] = useState<boolean>(false)
  const {t} = useTranslation('auth')
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
    jobPreferences: [] as string[],
    gender: "",

    // Company fields
    companyName: "",
    district: "",
    province: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true)
    try {
      if (formData.userType === "company") {
        const companyFormData = createCompanyFormData(formData);
        await registerCompany(companyFormData);
        toast({
          title: `${formData.companyName} registered successfully!`,
          description: "Welcome to our platform!",
        });
        router.push("/login");
      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          province: formData.province,
          district: formData.district,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          phoneNumber: formData.employeePhoneNumber,
          jobPreferences: formData.jobPreferences,
        };
        await registerEmployee(payload);
        toast({
          title: `${formData.name} ${t('registrationSuccess')}`,
          description: t('welcomePlatform'),
        });
        router.push("/login");
      }
    } catch (error) {
      const message =
      // @ts-expect-error error
      error?.response?.data?.message ||
      // @ts-expect-error error
      error?.message ||
      "Something went wrong";

    toast({
    title: t("registrationFailed"),
    description: message,
    variant: "destructive",
  });
    }finally{
      setIsCreating(false)
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
                   {t('joinUs')}
                  </h1>
                  <p className="text-gray-500">
                    {t('createAccount')}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Type Toggle */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      {t('iAm')}
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
                          {t('employee')}
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
                          {t('company')}
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
                        province: formData.province,
                        district: formData.district,
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
                        province: formData.province,
                        district: formData.district,
                        gender: formData.gender,
                        dateOfBirth: formData.dateOfBirth,
                        employeePhoneNumber: formData.employeePhoneNumber,
                        jobPreferences: formData.jobPreferences,
                      }}
                      onInputChange={handleInputChange}
                    />
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    onClick={()=> setIsCreating(true)}
                    className={`w-full h-12 hover:bg-purple-700 text-white rounded-xl font-medium ${
                      isCreating ? "bg-purple-400" : "bg-purple-600" 
                    }`}
                  >
                    {isCreating ? t("creating") : t("creatingAccount")}
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    {t('alreadyHaveAccount')}{" "}
                    <Link
                      href="/login"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      {t('signIn')}
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
