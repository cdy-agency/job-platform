"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { postCompanyJob } from "@/lib/api"

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
  salaryMin: z.string().min(1, {
    message: "Minimum salary is required.",
  }),
  salaryMax: z.string().min(1, {
    message: "Maximum salary is required.",
  }),
  experience: z.string().optional().default(""),
  description: z.string().min(20, {
    message: "Job description must be at least 20 characters.",
  }),
  skillsText: z.string().min(1, {
    message: "Please provide at least one skill (one per line).",
  }),
})

type JobFormValues = z.infer<typeof jobFormSchema>

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      category: "",
      type: "",
      salaryMin: "",
      salaryMax: "",
      experience: "",
      description: "",
      skillsText: "",
    },
  })

  async function onSubmit(data: JobFormValues) {
    setIsSubmitting(true)

    try {
      const skills = data.skillsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)

      const payload = {
        title: data.title,
        description: data.description,
        skills,
        experience: data.experience || "",
        employmentType: data.type as "fulltime" | "part-time" | "internship",
        salary: `${data.salaryMin}-${data.salaryMax}`,
        category: data.category,
        image: "", // optional per schema
      }

      await postCompanyJob(payload as any)
      toast({
        title: "Job posted successfully!",
        description: "Your job has been posted and is now live.",
      })
      router.push("/dashboard/company/jobs")
    } catch (e: any) {
      const backend = e?.response?.data
      const msg = backend?.message || backend?.error || JSON.stringify(backend) || e.message || "Server error. Please check your inputs or approval status."
      toast({ title: "Failed to post job", description: msg })
      // eslint-disable-next-line no-console
      console.error("Post job error:", backend || e)
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

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800">Job Details</CardTitle>
          <CardDescription className="text-gray-600">
            Fill out the form below to create a new job listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
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
                        <FormDescription className="text-gray-600">
                          Enter amount in RWF without commas or currency symbol
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
                          <Input placeholder="e.g. 70000" {...field} className="border-gray-300" />
                        </FormControl>
                        <FormDescription className="text-gray-600">
                          Enter amount in RWF without commas or currency symbol
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Experience</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 3-5 years" {...field} className="border-gray-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the job role, responsibilities, and company culture..."
                          className="min-h[150px] border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skillsText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Skills (one per line)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="React\nTypeScript\nNode.js"
                          className="min-h-[150px] border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="flex justify-between px-0">
                <Button type="button" variant="outline" className="border-gray-300 bg-transparent text-gray-800">
                  Save as Draft
                </Button>
                <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600" disabled={isSubmitting}>
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
