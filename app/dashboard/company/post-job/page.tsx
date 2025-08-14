"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { postJob } from "@/lib/api"
import { X } from "lucide-react"

const jobFormSchema = z.object({
  title: z.string().min(5, {
    message: "Job title must be at least 5 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a job category.",
  }),
  type: z.string().min(1, {
    message: "Please select a job type.",
  }),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  salaryMin: z.string().min(1, {
    message: "Minimum salary is required.",
  }),
  salaryMax: z.string().min(1, {
    message: "Maximum salary is required.",
  }),
  description: z.string().min(50, {
    message: "Job description must be at least 50 characters.",
  }),
  requirements: z.array(z.string()).min(1, {
    message: "Please add at least one requirement.",
  }),
  responsibilities: z.array(z.string()).min(1, {
    message: "Please add at least one responsibility.",
  }),
  applicationDeadline: z.string().min(1, {
    message: "Application deadline is required.",
  }),
  benefits: z.array(z.string()).optional(),
})

type JobFormValues = z.infer<typeof jobFormSchema>

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requirementInput, setRequirementInput] = useState("")
  const [responsibilityInput, setResponsibilityInput] = useState("")
  const [benefitInput, setBenefitInput] = useState("")

  const router = useRouter()

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      category: "",
      type: "",
      location: "",
      salaryMin: "",
      salaryMax: "",
      description: "",
      requirements: [],
      responsibilities: [],
      applicationDeadline: "",
      benefits: [],
    },
  })

  const addItem = (fieldName: "requirements" | "responsibilities" | "benefits", value: string, setValue: (v: string) => void) => {
    if (!value.trim()) return
    const current = form.getValues(fieldName) || []
    form.setValue(fieldName, [...current, value.trim()])
    setValue("")
  }

  const removeItem = (
  fieldName: "requirements" | "responsibilities" | "benefits",
  index: number
) => {
  const current = form.getValues(fieldName) || [] 
  const updated = [...current]
  updated.splice(index, 1)
  form.setValue(fieldName, updated)
}

  async function onSubmit(data: JobFormValues) {
    setIsSubmitting(true)

    try {
      const employmentType =
        data.type.toLowerCase() === "full-time"
          ? "fulltime"
          : data.type.toLowerCase() === "part-time"
          ? "part-time"
          : data.type.toLowerCase() === "internship"
          ? "internship"
          : "fulltime"

      const salary = `${data.salaryMin}-${data.salaryMax}`

      await postJob({
        title: data.title,
        description: data.description,
        skills: data.requirements,
        employmentType,
        salary,
        category: data.category,
        benefits: data.benefits || [],
      })

      toast({
        title: "Job posted successfully!",
        description: "Your job has been posted and is now live.",
      })
      router.push("/dashboard/company/jobs")
    } catch (e: any) {
      toast({
        title: "Failed to post job",
        description: e?.response?.data?.message || "Please try again",
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
        <p className="text-gray-600">
          Create a new job listing to attract qualified candidates
        </p>
      </div>

      <Card className="border-gray-200 bg-white text-black">
        <CardHeader>
          <CardTitle className="text-gray-800">Job Details</CardTitle>
          <CardDescription className="text-gray-600">
            Fill out the form below to create a new job listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Frontend Developer"
                        {...field}
                        className="border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category & Type */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Job Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Product">Product</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Customer Service">Customer Service</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Job Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
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
                      <Input
                        placeholder="e.g. New York, NY or Remote"
                        {...field}
                        className="border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Salary */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="salaryMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Minimum Salary</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 50000"
                          {...field}
                          className="border-gray-300"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-600">
                        Enter amount in USD without commas or currency symbol
                      </FormDescription>
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
                        <Input
                          placeholder="e.g. 90000"
                          {...field}
                          className="border-gray-300"
                        />
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
                      <Textarea
                        placeholder="Describe the role, team, and impact"
                        {...field}
                        className="border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Requirements */}
              <FormField
                control={form.control}
                name="requirements"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Requirements</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a requirement and press Enter"
                        value={requirementInput}
                        onChange={(e) => setRequirementInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addItem("requirements", requirementInput, setRequirementInput)
                          }
                        }}
                        className="border-gray-300"
                      />
                      <Button
                        type="button"
                        onClick={() =>
                          addItem("requirements", requirementInput, setRequirementInput)
                        }
                        className="bg-[#834de3] text-white"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch("requirements").map((req, idx) => (
                        <span
                          key={idx}
                          className="bg-[#f1ebfc] text-[#834de3] px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                        >
                          {req}
                          <X
                            size={16}
                            className="cursor-pointer hover:text-red-500"
                            onClick={() => removeItem("requirements", idx)}
                          />
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
                      <Button
                        type="button"
                        onClick={() =>
                          addItem("responsibilities", responsibilityInput, setResponsibilityInput)
                        }
                        className="bg-[#834de3] text-white"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch("responsibilities").map((resp, idx) => (
                        <span
                          key={idx}
                          className="bg-[#f1ebfc] text-[#834de3] px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                        >
                          {resp}
                          <X
                            size={16}
                            className="cursor-pointer hover:text-red-500"
                            onClick={() => removeItem("responsibilities", idx)}
                          />
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
                      <Button
                        type="button"
                        onClick={() =>
                          addItem("benefits", benefitInput, setBenefitInput)
                        }
                        className="bg-[#834de3] text-white"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch("benefits")?.map((benefit, idx) => (
                        <span
                          key={idx}
                          className="bg-[#f1ebfc] text-[#834de3] px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                        >
                          {benefit}
                          <X
                            size={16}
                            className="cursor-pointer hover:text-red-500"
                            onClick={() => removeItem("benefits", idx)}
                          />
                        </span>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              {/* Deadline */}
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
                <Button
                  type="submit"
                  className="bg-[#834de3] text-white"
                  disabled={isSubmitting}
                >
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
