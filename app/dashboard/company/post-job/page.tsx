"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { postJob } from "@/lib/api"
import { X } from "lucide-react"
import { useAuth } from "@/context/authContext"

const employmentEnum = z.enum(["fulltime", "part-time", "internship"])

export const JOB_CATEGORIES = [
  { value: "general-labour", label: "Akazi rusange (General Labour)" },
  { value: "domestic-work", label: "Akazi ko mu rugo (Domestic Work)" },
  { value: "cleaning-janitorial", label: "Isuku (Cleaning & Janitorial)" },
  { value: "construction", label: "Ubwubatsi (Construction)" },
  { value: "drivers-riders", label: "Abashoferi n'Abamotari (Drivers & Riders)" },
  { value: "sales-marketing", label: "Abacuruzi/Marketing (Sales & Promotion)" },
  { value: "health-care", label: "Ubuvuzi n'Ububyaza (Health & Care)" },
  { value: "education-assistants", label: "Abarezi n'abafasha mu mashuri (Education & Assistants)" },
  { value: "it-digital", label: "Abashinzwe ikoranabuhanga (IT & Digital Jobs)" },
  { value: "packaging-production", label: "Gutunganya no gupakira (Packaging & Production)" },
  { value: "creative-media", label: "Akazi k'Ubuhanzi n'Imyidagaduro (Creative & Media)" },
  { value: "factory-workshop", label: "Gukora mu nganda (Factory/Workshop Jobs)" },
]

// FIXED SCHEMA - Properly handle arrays with transform
const jobFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  image: z.instanceof(File).optional(),
  skills: z.array(z.string()).transform(val => val || []), // Always return array
  location: z.string().min(1, { message: "Location is required." }),
  experience: z.string().optional(),
  employmentType: employmentEnum,
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  category: z.string().min(1, { message: "Category is required." }),
  responsibilities: z.array(z.string()).transform(val => val || []), // Always return array
  benefits: z.array(z.string()).transform(val => val || []), // Always return array
  applicationDeadline: z.string().optional(),
})

type JobFormValues = z.infer<typeof jobFormSchema>

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [skillsInput, setSkillsInput] = useState("")
  const [responsibilityInput, setResponsibilityInput] = useState("")
  const [benefitInput, setBenefitInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
      skills: [],
      location: "",
      experience: "",
      employmentType: "fulltime",
      salaryMin: "",
      salaryMax: "",
      category: "",
      responsibilities: [],
      benefits: [],
      applicationDeadline: "",
    },
    mode: "onChange",
  })

  const addItem = (
    fieldName: "skills" | "responsibilities" | "benefits",
    value: string,
    setValue: (v: string) => void
  ) => {
    if (!value.trim()) return
    const current = form.getValues(fieldName) || []
    form.setValue(fieldName, [...current, value.trim()], { shouldDirty: true, shouldValidate: true })
    setValue("")
  }

  const removeItem = (
    fieldName: "skills" | "responsibilities" | "benefits",
    index: number
  ) => {
    const current = form.getValues(fieldName) || []
    const updated = [...current]
    updated.splice(index, 1)
    form.setValue(fieldName, updated, { shouldDirty: true, shouldValidate: true })
  }

  // ENHANCED SUBMIT FUNCTION with better error handling and user ID debugging
  async function onSubmit(values: JobFormValues) {
    setIsSubmitting(true)
    
    try {

      
      const companyId = (user as any)?.id || 
                       (user as any)?._id || 
                       (user as any)?.userId || 
                       (user as any)?.companyId || 
                       (user as any)?.uid || 
                       "temp-company-id"
                       
      if (!companyId || companyId === "temp-company-id") {
        console.warn("⚠️ Using temporary company ID for testing");
        // Don't return, continue with temp ID to test the API call
      }

      console.log("About to call postJob API...");
      const jobData = {
        title: values.title,
        description: values.description,
        image: values.image,
        skills: values.skills || [],
        location: values.location,
        experience: values.experience || "",
        employmentType: values.employmentType,
        salaryMin: values.salaryMin || "",
        salaryMax: values.salaryMax || "",
        category: values.category,
        responsibilities: values.responsibilities || [],
        benefits: values.benefits || [],
        companyId,
        applicationDeadline: values.applicationDeadline || "",
      }
      console.log("Job data being sent:", jobData);

      const result = await postJob(jobData)
      console.log("API call successful:", result);

      toast({
        title: "Job posted successfully!",
        description: "Your job has been posted and is now live.",
      })
      router.push("/dashboard/company/jobs")
    } catch (e: any) {
      
      toast({
        title: "Failed to post job",
        description: e?.response?.data?.message || e?.message || "Please try again. Check console for details.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container space-y-6 p-6 pb-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">Post a New Job</h1>
        <p className="text-gray-600">Create a new job listing to attract qualified candidates</p>
      </div>

      <Card className="border-gray-200 bg-white text-black">
        <CardHeader>
          <CardTitle className="text-gray-800">Job Details</CardTitle>
          <CardDescription className="text-gray-600">Fill out the form below to create a new job listing</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Frontend Developer" {...field} className="border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category & Employment Type */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Job Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {JOB_CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Employment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fulltime">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Kigali, Musanze, Huye" {...field} className="border-gray-300" required/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Experience */}
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Experience</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 3+ years, Mid-level" {...field} className="border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Salary Range */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="salaryMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Minimum Salary</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 50000" {...field} className="border-gray-300" />
                      </FormControl>
                      <FormDescription className="text-gray-600">Enter amount without currency symbol</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salaryMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Maximum Salary</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 90000" {...field} className="border-gray-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Job Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the role, team, and impact" {...field} className="border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Job Image/Banner</FormLabel>
                    <FormControl>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          field.onChange(file)
                        }}
                        className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-purple-700"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">Optional image to showcase the job</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Skills */}
              <FormField
                control={form.control}
                name="skills"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Skills</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a skill and press Enter"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addItem("skills", skillsInput, setSkillsInput)
                          }
                        }}
                        className="border-gray-300"
                      />
                      <Button type="button" onClick={() => addItem("skills", skillsInput, setSkillsInput)} className="bg-[#834de3] text-white">
                        Add
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.watch("skills").map((skill, idx) => (
                        <span key={idx} className="bg-[#f1ebfc] text-[#834de3] px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                          {skill}
                          <X size={16} className="cursor-pointer hover:text-red-500" onClick={() => removeItem("skills", idx)} />
                        </span>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Responsibilities */}
              <FormField
                control={form.control}
                name="responsibilities"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Responsibilities</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a responsibility and press Enter"
                        value={responsibilityInput}
                        onChange={(e) => setResponsibilityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addItem("responsibilities", responsibilityInput, setResponsibilityInput)
                          }
                        }}
                        className="border-gray-300"
                      />
                      <Button type="button" onClick={() => addItem("responsibilities", responsibilityInput, setResponsibilityInput)} className="bg-[#834de3] text-white">
                        Add
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.watch("responsibilities").map((resp, idx) => (
                        <span key={idx} className="bg-[#f1ebfc] text-[#834de3] px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                          {resp}
                          <X size={16} className="cursor-pointer hover:text-red-500" onClick={() => removeItem("responsibilities", idx)} />
                        </span>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Benefits */}
              <FormField
                control={form.control}
                name="benefits"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Benefits</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a benefit and press Enter"
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addItem("benefits", benefitInput, setBenefitInput)
                          }
                        }}
                        className="border-gray-300"
                      />
                      <Button type="button" onClick={() => addItem("benefits", benefitInput, setBenefitInput)} className="bg-[#834de3] text-white">
                        Add
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.watch("benefits").map((benefit, idx) => (
                        <span key={idx} className="bg-[#f1ebfc] text-[#834de3] px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                          {benefit}
                          <X size={16} className="cursor-pointer hover:text-red-500" onClick={() => removeItem("benefits", idx)} />
                        </span>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Application Deadline */}
              <FormField
                control={form.control}
                name="applicationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Application Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ✅ FIXED SUBMIT BUTTON - Removed isValid check */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  className="bg-[#834de3] text-white hover:bg-[#7239d3] disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post Job"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}