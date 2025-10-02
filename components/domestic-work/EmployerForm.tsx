"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent} from "@/components/ui/card"
import { Upload, User, MapPin, DollarSign, Users, CheckCircle } from "lucide-react"
import { api, getErrorMessage } from "@/lib/axiosInstance"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "../ui/skeleton"

type LocationData = { 
  province: string
  district: string
  sector: string
  cell: string
  village: string
}

type image = {
  url: string
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
  salaryRangeMin: string
  salaryRangeMax: string
}



type ApiHousekeeper = {
  _id: string
  fullName: string
  dateOfBirth: string
  gender: "male" | "female"
  idNumber: string
  phoneNumber: string
  location: LocationData
  passportImage: image,
  fullBodyImage: image,
  workPreferences: {
    workDistrict: string
    workSector: string
    willingToWorkWithChildren: boolean
  }
  background: {
    hasParents: boolean
    fatherName?: string
    fatherPhone?: string
    motherName?: string
    motherPhone?: string
    hasStudied: boolean
    educationLevel?: string
    church?: string
  }
  status: "available" | "hired" | "inactive"
  createdAt: string
  updatedAt: string
}


export default function EmployerForm() {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [employerId, setEmployerId] = useState<string | null>(null)
  const [matchingHousekeepers, setMatchingHousekeepers] = useState<ApiHousekeeper[]>([])
  const [loadingMatches, setLoadingMatches] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<EmployerData>({
    name: "",
    email: "",
    phoneNumber: "",
    nationalId: "",
    location: {
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: ""
    },
    villageLeaderNumber: "",
    partnerNumber: "",
    churchName: "",
    profileImage: null,
    salaryRangeMin: "",
    salaryRangeMax: ""
  })
  const [imagePreview, setImagePreview] = useState<string>("")

  const toggleSelect = (id: string | number) => {
    const stringId = String(id)
    setSelected((prev) =>
      prev.includes(stringId) ? prev.filter((x) => x !== stringId) : prev.length < 2 ? [...prev, stringId] : prev
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, profileImage: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
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
      formDataToSend.append('salaryRangeMin', formData.salaryRangeMin)
      formDataToSend.append('salaryRangeMax', formData.salaryRangeMax)

      if (formData.email) {
        formDataToSend.append('email', formData.email)
      }
      formDataToSend.append('location', JSON.stringify(formData.location))
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage)
      }

      const response = await api.post('/employers', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      if (response.data.employer) {
        setEmployerId(response.data.employer._id)
        toast({
          title: "Registration Successful!",
          description: "Your employer profile has been created successfully.",
        })
        
        await fetchMatchingHousekeepers(response.data.employer._id)
        setStep(4)
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

  const fetchMatchingHousekeepers = async (empId: string) => {
    try {
      setLoadingMatches(true)
      const response = await api.get(`/employers/${empId}/matches`)
      if (response.data.housekeepers) {
        setMatchingHousekeepers(response.data.housekeepers)
      }
    } catch (error) {
      console.error('Error fetching matching housekeepers:', error)
      toast({
        title: "Error",
        description: "Failed to fetch matching housekeepers",
        variant: "destructive",
      })
    } finally {
      setLoadingMatches(false)
    }
  }

  const handleNext = async () => {
    if (step === 3) {
      if (!formData.name || !formData.phoneNumber || !formData.nationalId || !formData.location.province || 
          !formData.location.district || !formData.location.sector || !formData.location.cell || 
          !formData.location.village || !formData.villageLeaderNumber || !formData.partnerNumber || 
          !formData.churchName || !formData.salaryRangeMin || !formData.salaryRangeMax) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive",
        })
        return
      }
      await registerEmployer()
    } else if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const getMatchingHousekeepers = () => {
    return matchingHousekeepers.map(hk => ({
      id: hk._id,
      name: hk.fullName,
      location: hk.location,
      gender: hk.gender,
      fullBodyImage:hk.fullBodyImage,
      passportImage: hk.passportImage,
      workPreferences: hk.workPreferences,
      age: hk.dateOfBirth ? new Date().getFullYear() - new Date(hk.dateOfBirth).getFullYear() : 25,
      experience: "Available",
      availability: hk.status === 'available' ? 'Available' : 'Not Available',
      profileImage: hk.gender === 'female' ? "👩" : "👨",
    }))
  }

  const handleSelectHousekeepers = async () => {
    if (!employerId || selected.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one housekeeper.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await api.post(`/employers/${employerId}/select`, {
        housekeeperIds: selected
      })

      if (response.data.employer) {
        toast({
          title: "Selection Complete!",
          description: "You have successfully selected your housekeepers. You can now contact them.",
        })
      }
    } catch (error) {
      toast({
        title: "Selection Failed",
        description: getErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Register as Employer</h1>
          <p className="text-gray-600">Find the perfect housekeeper for your home</p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center items-center space-x-2 mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              step >= 1 ? "bg-[#834de3] text-white" : "bg-gray-300 text-gray-600"
            }`}>
              {step > 1 ? "✓" : "1"}
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">Personal Info</span>
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? "bg-[#834de3]" : "bg-gray-300"}`}></div>
          
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              step >= 2 ? "bg-[#834de3] text-white" : "bg-gray-300 text-gray-600"
            }`}>
              {step > 2 ? "✓" : "2"}
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">Location</span>
          </div>
          <div className={`w-12 h-1 ${step >= 3 ? "bg-[#834de3]" : "bg-gray-300"}`}></div>
          
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              step >= 3 ? "bg-[#834de3] text-white" : "bg-gray-300 text-gray-600"
            }`}>
              {step > 3 ? "✓" : "3"}
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">Preferences</span>
          </div>
          <div className={`w-12 h-1 ${step >= 4 ? "bg-[#834de3]" : "bg-gray-300"}`}></div>
          
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              step >= 4 ? "bg-[#834de3] text-white" : "bg-gray-300 text-gray-600"
            }`}>
              4
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">Match</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            {/* Step 1: Personal Information */}
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

            {/* Step 2: Location Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin className="text-[#834de3]" />
                  <h2 className="text-2xl font-bold text-gray-800">Location Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 font-semibold">Province <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="e.g., Kigali"
                      value={formData.location.province}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, province: e.target.value }
                      })}
                      className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 font-semibold">District <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="e.g., Gasabo"
                      value={formData.location.district}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, district: e.target.value }
                      })}
                      className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 font-semibold">Sector <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="e.g., Remera"
                      value={formData.location.sector}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, sector: e.target.value }
                      })}
                      className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 font-semibold">Cell <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="e.g., Rukiri"
                      value={formData.location.cell}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, cell: e.target.value }
                      })}
                      className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-gray-700 font-semibold">Village <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="e.g., Amahoro"
                      value={formData.location.village}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, village: e.target.value }
                      })}
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

            {/* Step 3: Additional Information & Preferences */}
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
                  <p className="text-sm text-gray-500 mt-1">If you are a family, please provide your partner's number</p>
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
                  <Label className="text-gray-700 font-semibold text-lg mb-4 block">Salary Range <span className="text-red-500">*</span></Label>
                  <p className="text-sm text-gray-600 mb-4">Specify the monthly salary range you're willing to pay</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600 text-sm">Minimum (RWF)</Label>
                      <Input
                        type="number"
                        placeholder="50,000"
                        value={formData.salaryRangeMin}
                        onChange={(e) => setFormData({ ...formData, salaryRangeMin: e.target.value })}
                        className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600 text-sm">Maximum (RWF)</Label>
                      <Input
                        type="number"
                        placeholder="100,000"
                        value={formData.salaryRangeMax}
                        onChange={(e) => setFormData({ ...formData, salaryRangeMax: e.target.value })}
                        className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                      />
                    </div>
                  </div>
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
                    {isLoading ? "Registering..." : "Find Matches →"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Matching Housekeepers */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Users className="text-[#834de3]" />
                  <h2 className="text-2xl font-bold text-gray-800">Available Housekeepers</h2>
                </div>

                {loadingMatches ? (
                  <div className="space-y-4">
                    {[1,2,3].map((i) => (
                      <Card key={i} className="border-gray-200">
                        <CardContent className="p-6 flex space-x-4">
                          <Skeleton className="w-16 h-16 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                  {getMatchingHousekeepers().map((hk) => (
                    <Card
                      key={hk.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selected.includes(String(hk.id)) 
                          ? "border-[#834de3] border-2 bg-purple-50" 
                          : "border-gray-200 hover:border-[#834de3]"
                      }`}
                      onClick={() => toggleSelect(hk.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-6">
                          
                          {/* Profile / Passport Image */}
                          <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300">
                            <img 
                              src={hk.passportImage?.url || "/placeholder-profile.png"} 
                              alt={hk.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                    
                          {/* Housekeeper Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-xl font-bold text-gray-800">{hk.name}</h3>
                              {selected.includes(String(hk.id)) && (
                                <CheckCircle className="text-[#834de3] w-5 h-5" />
                              )}
                            </div>
                            
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <p><strong>Location:</strong> {hk.location.village}, {hk.location.cell}, {hk.location.sector}</p>
                              <p><strong>Gender:</strong> {hk.gender} | <strong>Age:</strong> {hk.age}</p>
                              <p><strong>Availability:</strong> {hk.availability}</p>
                              <p><strong>Preferred Work Area:</strong> {hk.workPreferences?.workDistrict}, {hk.workPreferences?.workSector}</p>
                              <p><strong>Children:</strong> {hk.workPreferences?.willingToWorkWithChildren ? "Yes" : "No"}</p>
                            </div>
                            
                          </div>
                            
                          {/* Full Body Image (clickable) */}
                          {hk.fullBodyImage?.url && (
                            <div className="w-24 h-32 rounded overflow-hidden border border-gray-300">
                              <a href={hk.fullBodyImage.url} target="_blank" rel="noopener noreferrer">
                                <img 
                                  src={hk.fullBodyImage.url} 
                                  alt={`${hk.name} full body`} 
                                  className="w-full h-full object-cover hover:opacity-90 transition" 
                                />
                              </a>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                )}
                
                <div className="flex justify-between items-center pt-4">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="border-[#834de3] text-[#834de3] hover:bg-purple-50 px-8"
                  >
                    ← Back
                  </Button>
                  <div className="text-sm text-gray-600">
                    Selected: {selected.length}/2
                  </div>
                  <Button
                    onClick={handleSelectHousekeepers}
                    disabled={selected.length === 0 || isLoading}
                    className="bg-[#834de3] text-white hover:bg-[#6f3cc2] transition-colors px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Processing..." : "Confirm Selection →"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress indication at bottom */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Step {step} of 4
        </div>
      </div>
    </div>
  )
}