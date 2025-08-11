"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { applyForJob } from "@/lib/api"

const applyFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(5, {
    message: "Please enter a valid phone number.",
  }),
  resume: z.any().refine((file) => file?.length > 0, {
    message: "Resume is required.",
  }),
  coverLetter: z.string().optional(),
})

type ApplyFormValues = z.infer<typeof applyFormSchema>

interface ApplyJobFormProps {
  jobId: string
  onCancel: () => void
}

export function ApplyJobForm({ jobId, onCancel }: ApplyJobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
    },
  })

  async function onSubmit(data: ApplyFormValues) {
    setIsSubmitting(true)
    try {
      // Minimal payload to backend model
      await applyForJob(jobId, {
        skills: [],
        experience: undefined,
        appliedVia: "normal",
      })
      toast({
        title: "Application submitted!",
        description: "Your job application has been successfully submitted.",
      })
      router.push("/dashboard/user")
    } catch (e: any) {
      toast({ title: "Failed to apply", description: e?.response?.data?.message || "Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} className="border-gray-300" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} className="border-gray-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} className="border-gray-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="resume"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Resume</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => onChange(e.target.files)}
                  {...fieldProps}
                  className="border-gray-300"
                />
              </FormControl>
              <FormDescription className="text-gray-600">
                Upload your resume in PDF, DOC, or DOCX format (max 5MB)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Cover Letter (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us why you're a good fit for this position..."
                  className="min-h-[150px] border-gray-300"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-gray-300 bg-transparent text-gray-800"
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
