import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JOB_CATEGORIES } from "@/app/dashboard/company/post-job/page";

interface EmployeeRegistrationProps {
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    employeePhoneNumber: string;
    jobPreferences: string[];
  };
  onInputChange: (field: string, value: any) => void;
  errors?: {
    [key: string]: string;
  };
}

const EmployeeRegistration = ({
  formData,
  onInputChange,
  errors = {},
}: EmployeeRegistrationProps) => {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  // Sync with parent data when it changes
  useEffect(() => {
    if (Array.isArray(formData.jobPreferences)) {
      setSelectedJobs(formData.jobPreferences);
    }
  }, [formData.jobPreferences]);

  const handleJobPreferenceChange = (jobValue: string) => {
    const updatedPreferences = selectedJobs.includes(jobValue)
      ? selectedJobs.filter((pref) => pref !== jobValue)
      : [...selectedJobs, jobValue];

    setSelectedJobs(updatedPreferences);
    onInputChange("jobPreferences", updatedPreferences);
  };

  return (
    <>
      {/* Basic Info Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            className="bg-white text-black"
            required
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            className="bg-white text-black"
            required
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
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
            onChange={(e) => onInputChange("dateOfBirth", e.target.value)}
            className="bg-white text-black"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="phoneNumber"
            className="text-sm font-medium text-gray-700"
          >
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            type="text"
            inputMode="tel"
            placeholder="Phone Number (Optional)"
            value={formData.employeePhoneNumber}
            onChange={(e) => onInputChange("employeePhoneNumber", e.target.value)}
            className="bg-white text-black"
          />
          {errors.employeePhoneNumber && (
            <p className="text-sm text-red-500">
              {errors.employeePhoneNumber}
            </p>
          )}
        </div>
      </div>

      {/* Password Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => onInputChange("password", e.target.value)}
            className="bg-white text-black"
            required
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange("confirmPassword", e.target.value)}
            required
            className="bg-white text-black"
          />
          {formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-500">Passwords do not match</p>
            )}
        </div>
      </div>

      {/* Job Preferences Multi-select */}
      <div className="mt-4 space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Job Preferences
          <span className="text-xs text-gray-500 ml-2">
            (Select all that apply)
          </span>
        </Label>

        <div className="bg-white border border-gray-300 rounded-md p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {JOB_CATEGORIES.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`job-${category.value}`}
                  checked={selectedJobs.includes(category.value)}
                  onChange={() => handleJobPreferenceChange(category.value)}
                  className="h-4 w-4 text-[#834de3] focus:ring-[#834de3] border-gray-300 rounded"
                />
                <Label
                  htmlFor={`job-${category.value}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {category.label}
                </Label>
              </div>
            ))}
          </div>

          {selectedJobs.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-600 font-medium">Selected:</span>
                {selectedJobs.map((jobValue) => {
                  const category = JOB_CATEGORIES.find(cat => cat.value === jobValue);
                  return (
                    <span
                      key={jobValue}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-[#834de3] font-medium"
                    >
                      {category?.label || jobValue}
                      <button
                        type="button"
                        onClick={() => handleJobPreferenceChange(jobValue)}
                        className="ml-2 text-[#834de3] hover:text-red-500 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {errors.jobPreferences && (
          <p className="text-sm text-red-500">{errors.jobPreferences}</p>
        )}
      </div>
    </>
  );
};

export default EmployeeRegistration;