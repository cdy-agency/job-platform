"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, User, MapPin, DollarSign } from "lucide-react"
import { api, getErrorMessage } from "@/lib/axiosInstance"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

const allTaskOptions = [
  "Cleaning",
  "Cooking",
  "Laundry",
  "Babysitting",
  "Gardening",
  "Pet Care",
  "Shopping",
  "Ironing",
  "Elderly Care",
  "Dishwashing",
  "Feeding Pets",
  "Organizing Rooms",
  "Errand Running",
]

type LocationData = { 
  province: string
  district: string
  sector: string
  cell: string
  village: string
}

type EmployerData = {
  name: string
  email: string
  phoneNumber: string
  nationalId: string
  location: LocationData
  villageLeaderNumber: string
  partnerNumber: string
  churchName: string
  profileImage: File | null
  salary: string
  allTasks: string[]
  vocationDays: string
}

export default function EmployerForm() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<EmployerData>({
    name: "",
    email: "",
    phoneNumber: "",
    nationalId: "",
    location: { province: "", district: "", sector: "", cell: "", village: "" },
    villageLeaderNumber: "",
    partnerNumber: "",
    churchName: "",
    profileImage: null,
    salary: "",
    allTasks: [],
    vocationDays: ""
  })
  const [imagePreview, setImagePreview] = useState<string>("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, profileImage: file })
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const registerEmployer = async () => {
    try {
      setIsLoading(true)
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('phoneNumber', formData.phoneNumber)
      formDataToSend.append('nationalId', formData.nationalId)
      formDataToSend.append('villageLeaderNumber', formData.villageLeaderNumber)
      formDataToSend.append('partnerNumber', formData.partnerNumber)
      formDataToSend.append('churchName', formData.churchName)
      formDataToSend.append('salary', formData.salary)
      formDataToSend.append('vocationDays', formData.vocationDays)
      formDataToSend.append('allTasks', JSON.stringify(formData.allTasks))
      if (formData.email) formDataToSend.append('email', formData.email)
      formDataToSend.append('location', JSON.stringify(formData.location))
      if (formData.profileImage) formDataToSend.append('profileImage', formData.profileImage)

      const response = await api.post('/employers', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.employer) {
        toast({
          title: "Registration Successful!",
          description: "Your employer profile has been created successfully.",
        })
        setStep(1)
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          nationalId: "",
          location: { province: "", district: "", sector: "", cell: "", village: "" },
          villageLeaderNumber: "",
          partnerNumber: "",
          churchName: "",
          profileImage: null,
          salary: "",
          allTasks: [],
          vocationDays: ""
        })
        setImagePreview("")
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: getErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = async () => {
    if (step === 3) {
      // Validation for required fields
      if (!formData.name || !formData.phoneNumber || !formData.nationalId ||
          !formData.location.province || !formData.location.district || !formData.location.sector ||
          !formData.location.cell || !formData.location.village || !formData.villageLeaderNumber ||
          !formData.salary || formData.allTasks.length === 0 || !formData.vocationDays) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields before submitting.",
          variant: "destructive",
        })
        return
      }
      await registerEmployer()
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => step > 1 && setStep(step - 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Register as Employer</h1>
          <p className="text-gray-600">Provide your details to register</p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center items-center space-x-2 mb-8">
          {[1,2,3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= s ? "bg-[#834de3] text-white" : "bg-gray-300 text-gray-600"
              }`}>
                {step > s ? "✓" : s}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">
                {s === 1 ? "Personal Info" : s === 2 ? "Location" : "Preferences"}
              </span>
              {s !== 3 && <div className={`w-12 h-1 ${step > s ? "bg-[#834de3]" : "bg-gray-300"}`}></div>}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <User className="text-[#834de3]" />
                  <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                </div>

                {/* Profile Image */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden border-4 border-[#834de3]">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="text-[#834de3] w-12 h-12" />
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <span className="bg-[#834de3] text-white px-4 py-2 rounded-lg hover:bg-[#6f3cc2] transition-colors inline-block">
                      Upload Profile Photo
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">Phone Number <span className="text-red-500">*</span></Label>
                  <Input
                    type="tel"
                    placeholder="+250 XXX XXX XXX"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">Email <span className="text-gray-400">(optional)</span></Label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">National ID <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="1 XXXX X XXXXXXX X XX"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="bg-[#834de3] text-white hover:bg-[#6f3cc2] transition-colors px-8 py-2"
                  >
                    {isLoading ? "Loading..." : "Next →"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin className="text-[#834de3]" />
                  <h2 className="text-2xl font-bold text-gray-800">Location Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["province","district","sector","cell"].map((field) => (
                    <div key={field}>
                      <Label className="text-gray-700 font-semibold">{field.charAt(0).toUpperCase()+field.slice(1)} <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder={`e.g., ${field === "province" ? "Kigali" : ""}`}
                        value={formData.location[field as keyof LocationData]}
                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, [field]: e.target.value } })}
                        className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <Label className="text-gray-700 font-semibold">Village <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="e.g., Amahoro"
                      value={formData.location.village}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, village: e.target.value } })}
                      className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">Village Leader Phone Number <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="+250 XXX XXX XXX"
                    value={formData.villageLeaderNumber}
                    onChange={(e) => setFormData({ ...formData, villageLeaderNumber: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="border-[#834de3] text-[#834de3] hover:bg-purple-50 px-8"
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="bg-[#834de3] text-white hover:bg-[#6f3cc2] transition-colors px-8"
                  >
                    {isLoading ? "Loading..." : "Next →"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <DollarSign className="text-[#834de3]" />
                  <h2 className="text-2xl font-bold text-gray-800">Preferences & Contact</h2>
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">Partner Phone Number <span className="text-gray-400">(optional)</span></Label>
                  <Input
                    placeholder="+250 XXX XXX XXX"
                    value={formData.partnerNumber}
                    onChange={(e) => setFormData({ ...formData, partnerNumber: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">Church Name <span className="text-gray-400">(optional)</span></Label>
                  <Input
                    placeholder="Enter your church name"
                    value={formData.churchName}
                    onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <Label className="text-gray-700 font-semibold">Salary Range <span className="text-red-500">*</span></Label>
                  <select
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3] rounded-md w-full"
                  >
                    <option value="">Select salary range</option>
                    <option value="0-50000">0 - 50,000 RWF</option>
                    <option value="50000-100000">50,000 - 100,000 RWF</option>
                    <option value="100000-150000">100,000 - 150,000 RWF</option>
                    <option value="150000+">150,000+ RWF</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Select Tasks at Home <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {formData.allTasks.length > 0
                          ? `${formData.allTasks.length} selected`
                          : "Select tasks..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search tasks..." />
                        <CommandEmpty>No tasks found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {allTaskOptions.map((task) => (
                            <CommandItem
                              key={task}
                              onSelect={() => {
                                const selected = formData.allTasks.includes(task)
                                  ? formData.allTasks.filter((t) => t !== task)
                                  : [...formData.allTasks, task]
                                setFormData({ ...formData, allTasks: selected })
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.allTasks.includes(task)
                                    ? "opacity-100 text-[#834de3]"
                                    : "opacity-0"
                                )}
                              />
                              {task}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {formData.allTasks.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.allTasks.map((task) => (
                        <Badge
                          key={task}
                          variant="secondary"
                          className="cursor-pointer bg-purple-100 text-[#834de3] hover:bg-purple-200 transition"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              allTasks: formData.allTasks.filter((t) => t !== task),
                            })
                          }
                        >
                          {task} ✕
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">Vocation Days <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="e.g., Saturday and Sunday"
                    value={formData.vocationDays}
                    onChange={(e) => setFormData({ ...formData, vocationDays: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="border-[#834de3] text-[#834de3] hover:bg-purple-50 px-8"
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="bg-[#834de3] text-white hover:bg-[#6f3cc2] transition-colors px-8"
                  >
                    {isLoading ? "Registering..." : "Register"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
