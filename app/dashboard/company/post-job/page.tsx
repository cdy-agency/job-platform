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
import { postJob } from "@/lib/api"

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
  requirements: z.string().min(50, {
    message: "Job requirements must be at least 50 characters.",
  }),
  responsibilities: z.string().min(50, {
    message: "Job responsibilities must be at least 50 characters.",
  }),
  applicationDeadline: z.string().min(1, {
    message: "Application deadline is required.",
  }),
  benefits: z.string().optional(),
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
      location: "",
      salaryMin: "",
      salaryMax: "",
      description: "",
      requirements: "",
      responsibilities: "",
      applicationDeadline: "",
      benefits: "",
    },
  })

  async function onSubmit(data: JobFormValues) {
    setIsSubmitting(true)

    try {
      const employmentType = data.type.toLowerCase() === 'full-time' ? 'fulltime'
        : data.type.toLowerCase() === 'part-time' ? 'part-time'
        : data.type.toLowerCase() === 'internship' ? 'internship'
        : 'fulltime'

      const salary = `${data.salaryMin}-${data.salaryMax}`
      // Derive skills from requirements (comma separated) for simplicity
      const skills = data.requirements.split(/,|\n/).map(s => s.trim()).filter(Boolean)
      const benefits = (data.benefits || '').split(/,|\n/).map(s => s.trim()).filter(Boolean)

      await postJob({
        title: data.title,
        description: data.description,
        skills,
        employmentType,
        salary,
        category: data.category,
        benefits,
      })

      toast({
        title: "Job posted successfully!",
        description: "Your job has been posted and is now live.",
      })
      router.push("/dashboard/company/jobs")
    } catch (e: any) {
      toast({ title: "Failed to post job", description: e?.response?.data?.message || 'Please try again', variant: "destructive" })
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

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. New York, NY or Remote" {...field} className="border-gray-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          <Input placeholder="e.g. 90000" {...field} className="border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Requirements (comma separated)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g. React, TypeScript, REST APIs" {...field} className="border-gray-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List key responsibilities" {...field} className="border-gray-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Benefits (comma separated)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g. Insurance, Transport allowance, Lunch" {...field} className="border-gray-300" />
                      </FormControl>
                      <FormDescription className="text-gray-600">
                        Include perks like insurance, allowances, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

              <CardFooter className="flex justify-end">
                <Button type="submit" className="bg-[#834de3] text-white" disabled={isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post Job'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
