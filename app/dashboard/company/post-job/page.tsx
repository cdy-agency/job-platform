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
  CardFooter,
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
import CategorySelect from "@/components/admin/CategorySelect"
import { JOB_CATEGORIES, JobCategory } from "@/utils/jobCategories"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { postJob } from "@/lib/api"
import { X } from "lucide-react"
import { useAuth } from "@/context/authContext"

const employmentEnum = z.enum(["fulltime", "part-time", "internship"]) // exact backend enum

const jobFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  image: z.instanceof(File).optional(),
  skills: z.array(z.string()).default([]),
  experience: z.string().optional(),
  employmentType: employmentEnum,
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  category: z.enum(JOB_CATEGORIES as unknown as [JobCategory, ...JobCategory[]]),
  responsibilities: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
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
      experience: "",
      employmentType: "fulltime",
      salaryMin: "",
      salaryMax: "",
      category: "",
      responsibilities: [],
      benefits: [],
      applicationDeadline: "",
    },
  })

  const addItem = (
    fieldName: "skills" | "responsibilities" | "benefits",
    value: string,
    setValue: (v: string) => void
  ) => {
    if (!value.trim()) return
    const current = form.getValues(fieldName) || []
    form.setValue(fieldName, [...current, value.trim()], { shouldDirty: true })
    setValue("")
  }

  const removeItem = (
    fieldName: "skills" | "responsibilities" | "benefits",
    index: number
  ) => {
    const current = form.getValues(fieldName) || []
    const updated = [...current]
    updated.splice(index, 1)
    form.setValue(fieldName, updated, { shouldDirty: true })
  }

  async function onSubmit(values: JobFormValues) {
    setIsSubmitting(true)

    try {
      const companyId = (user as any)?.id || (user as any)?._id || ""
      if (!companyId) {
        toast({ title: "Missing company", description: "Company ID not found in session", variant: "destructive" })
        setIsSubmitting(false)
        return
      }

      await postJob({
        title: values.title,
        description: values.description,
        image: values.image,
        skills: values.skills,
        experience: values.experience,
        employmentType: values.employmentType,
        salaryMin: values.salaryMin,
        salaryMax: values.salaryMax,
        category: values.category,
        responsibilities: values.responsibilities,
        benefits: values.benefits,
        companyId,
        applicationDeadline: values.applicationDeadline,
      })

      toast({
        title: "Job posted successfully!",
        description: "Your job has been posted and is now live.",
      })
      router.push("/dashboard/company/jobs")
    } catch (e: any) {
      toast({
        title: "Failed to post job",
        description: e?.response?.data?.message || e?.message || "Please try again",
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
                      <CategorySelect value={field.value} onChange={field.onChange} />
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

              <CardFooter className="flex justify-end">
                <Button type="submit" className="bg-[#834de3] text-white" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Job"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
