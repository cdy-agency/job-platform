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
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation('employer')
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
          title: t('messages.registrationSuccessTitle'),
          description: t('messages.registrationSuccessDesc'),
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
        title: t('messages.registrationFailed'),
        description: getErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = async () => {
    if (step === 3) {
      if (!formData.name || !formData.phoneNumber || !formData.nationalId ||
          !formData.location.province || !formData.location.district || !formData.location.sector ||
          !formData.location.cell || !formData.location.village || !formData.villageLeaderNumber ||
          !formData.salary || formData.allTasks.length === 0 || !formData.vocationDays) {
        toast({
          title: t('messages.missingInfoTitle'),
          description: t('messages.missingInfoDesc'),
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('titles.registerEmployer')}</h1>
          <p className="text-gray-600">{t('subtitles.registerEmployerDesc')}</p>
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
                {s === 1 ? t('steps.personalInfo') : s === 2 ? t('steps.location') : t('steps.preferences')}
              </span>
              {s !== 3 && <div className={`w-12 h-1 ${step > s ? "bg-[#834de3]" : "bg-gray-300"}`}></div>}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <User className="text-[#834de3]" />
                  <h2 className="text-2xl font-bold text-gray-800">{t('steps.personalInfo')}</h2>
                </div>

                {/* Profile Image */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden border-4 border-[#834de3]">
                    {imagePreview ? (
                      <img src={imagePreview} alt={t('placeholders.profileImageAlt')} className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="text-[#834de3] w-12 h-12" />
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <span className="bg-[#834de3] text-white px-4 py-2 rounded-lg hover:bg-[#6f3cc2] transition-colors inline-block">
                      {t('buttons.uploadProfile')}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">{t('fields.fullName')} <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder={t('placeholders.fullName')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">{t('fields.phoneNumber')} <span className="text-red-500">*</span></Label>
                  <Input
                    type="tel"
                    placeholder={t('placeholders.phoneNumber')}
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">{t('fields.email')} <span className="text-gray-400">({t('optional')})</span></Label>
                  <Input
                    type="email"
                    placeholder={t('placeholders.email')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">{t('fields.nationalId')} <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder={t('placeholders.nationalId')}
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
                    {isLoading ? t('buttons.loading') : t('buttons.next')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin className="text-[#834de3]" />
                  <h2 className="text-2xl font-bold text-gray-800">{t('steps.location')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["province","district","sector","cell"].map((field) => (
                    <div key={field}>
                      <Label className="text-gray-700 font-semibold">
                        {t(`fields.${field}`)} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder={t(`placeholders.${field}`)}
                        value={formData.location[field as keyof LocationData]}
                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, [field]: e.target.value } })}
                        className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <Label className="text-gray-700 font-semibold">{t('fields.village')} <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder={t('placeholders.village')}
                      value={formData.location.village}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, village: e.target.value } })}
                      className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">{t('fields.villageLeaderNumber')} <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder={t('placeholders.phoneNumber')}
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
                    ← {t('buttons.back')}
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="bg-[#834de3] text-white hover:bg-[#6f3cc2] transition-colors px-8"
                  >
                    {isLoading ? t('buttons.loading') : t('buttons.next')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Preferences & Contact */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <DollarSign className="text-[#834de3]" />
                  <h2 className="text-2xl font-bold text-gray-800">{t('steps.preferences')}</h2>
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">{t('fields.partnerNumber')} <span className="text-gray-400">({t('optional')})</span></Label>
                  <Input
                    placeholder={t('placeholders.phoneNumber')}
                    value={formData.partnerNumber}
                    onChange={(e) => setFormData({ ...formData, partnerNumber: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">{t('fields.churchName')} <span className="text-gray-400">({t('optional')})</span></Label>
                  <Input
                    placeholder={t('placeholders.churchName')}
                    value={formData.churchName}
                    onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <Label className="text-gray-700 font-semibold">{t('fields.salary')} <span className="text-red-500">*</span></Label>
                  <select
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full mt-2 border-gray-300 rounded-lg focus:border-[#834de3] focus:ring-[#834de3] p-2"
                  >
                    <option value="">{t('placeholders.selectSalary')}</option>
                    <option value="5000-10000">5000-10000 RWF</option>
                    <option value="10001-20000">10001-20000 RWF</option>
                    <option value="20001-50000">20001-50000 RWF</option>
                    <option value="50001+">50001+ RWF</option>
                  </select>
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">{t('fields.vocationDays')} <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder={t('placeholders.vocationDays')}
                    value={formData.vocationDays}
                    onChange={(e) => setFormData({ ...formData, vocationDays: e.target.value })}
                    className="mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">{t('fields.tasks')} <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between mt-2 border-gray-300 focus:border-[#834de3] focus:ring-[#834de3]"
                      >
                        {formData.allTasks.length > 0
                          ? formData.allTasks.join(', ')
                          : t('placeholders.selectTasks')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder={t('placeholders.searchTasks')} />
                        <CommandEmpty>{t('placeholders.noTask')}</CommandEmpty>
                        <CommandGroup>
                          {allTaskOptions.map((task) => (
                            <CommandItem
                              key={task}
                              onSelect={() => {
                                const newTasks = formData.allTasks.includes(task)
                                  ? formData.allTasks.filter(t => t !== task)
                                  : [...formData.allTasks, task]
                                setFormData({ ...formData, allTasks: newTasks })
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.allTasks.includes(task) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {t(`tasks.${task}`)}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex justify-between mt-4">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="border-[#834de3] text-[#834de3] hover:bg-purple-50 px-8"
                  >
                    ← {t('buttons.back')}
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="bg-[#834de3] text-white hover:bg-[#6f3cc2] transition-colors px-8"
                  >
                    {isLoading ? t('buttons.loading') : t('buttons.submit')}
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
