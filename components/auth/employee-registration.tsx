"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { JOB_CATEGORIES } from "@/app/dashboard/company/post-job/page"
import { provincesWithDistricts } from "./company-registration"

interface EmployeeRegistrationProps {
  formData: {
    name: string
    email: string
    password: string
    province: string
    district: string
    gender: string
    confirmPassword: string
    dateOfBirth: string
    employeePhoneNumber: string
    jobPreferences: string[]
  }
  onInputChange: (field: string, value: any) => void
  errors?: {
    [key: string]: string
  }
}

const EmployeeRegistration = ({
  formData,
  onInputChange,
  errors = {},
}: EmployeeRegistrationProps) => {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [date, setDate] = useState<Date | undefined>(
    formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined
  )

  // sync job preferences
  useEffect(() => {
    if (Array.isArray(formData.jobPreferences)) {
      setSelectedJobs(formData.jobPreferences)
    }
  }, [formData.jobPreferences])

  const handleJobPreferenceChange = (jobValue: string) => {
    const updatedPreferences = selectedJobs.includes(jobValue)
      ? selectedJobs.filter((pref) => pref !== jobValue)
      : [...selectedJobs, jobValue]

    setSelectedJobs(updatedPreferences)
    onInputChange("jobPreferences", updatedPreferences)
  }

  const handleProvinceChange = (province: string) => {
    onInputChange("province", province)
    onInputChange("district", "") // reset district when province changes
  }

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    onInputChange(
      "dateOfBirth",
      newDate ? format(newDate, "dd/MM/yyyy") : ""
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            className="bg-white text-black"
            required
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            className="bg-white text-black"
            required
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !date ? "text-muted-foreground" : ""
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                captionLayout="dropdown"
                fromYear={1950}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Province */}
        <div className="space-y-2">
          <Label htmlFor="province">Province</Label>
          <Select value={formData.province} onValueChange={handleProvinceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Province" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(provincesWithDistricts).map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District */}
        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Select
            value={formData.district}
            onValueChange={(val) => onInputChange("district", val)}
            disabled={!formData.province}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              {formData.province &&
                provincesWithDistricts[formData.province].map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(val) => onInputChange("gender", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
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
            <p className="text-sm text-red-500">{errors.employeePhoneNumber}</p>
          )}
        </div>
      </div>

      {/* Passwords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
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
          <Label htmlFor="confirmPassword">Confirm Password</Label>
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

      {/* Job Preferences */}
      <div className="mt-4 space-y-3">
        <Label>
          Job Preferences{" "}
          <span className="text-xs text-gray-500 ml-2">(Select all that apply)</span>
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
        </div>
      </div>
    </>
  )
}

export default EmployeeRegistration
