"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { applyToJob } from "@/lib/api"

const schema = z.object({
  skills: z.array(z.string()).min(1, { message: "Add at least one skill" }),
  experience: z.string().min(1, { message: "Experience is required" }),
  appliedVia: z.enum(["normal", "whatsapp", "referral"]),
  resume: z.instanceof(File).optional(),
})

type FormValues = z.infer<typeof schema>

export default function ApplyJobModal({ jobId, open, onOpenChange, jobTitle, companyName }: {
  jobId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  jobTitle?: string
  companyName?: string
}) {
  const [skillInput, setSkillInput] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      skills: [],
      experience: "",
      appliedVia: "normal",
      resume: undefined,
    },
  })

  const addSkill = () => {
    if (!skillInput.trim()) return
    const current = form.getValues("skills")
    form.setValue("skills", [...current, skillInput.trim()], { shouldDirty: true })
    setSkillInput("")
  }

  const removeSkill = (idx: number) => {
    const current = form.getValues("skills")
    const updated = [...current]
    updated.splice(idx, 1)
    form.setValue("skills", updated, { shouldDirty: true })
  }

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true)
      await applyToJob(jobId, values)
      toast({ title: "Application submitted successfully!" })
      onOpenChange(false)
    } catch (e: any) {
      toast({ title: "Failed to apply", description: e?.response?.data?.message || e?.message, variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-gray-900">Apply to {jobTitle || 'Job'} {companyName ? `at ${companyName}` : ''}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="skills"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Skills</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a skill and press Add"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') { e.preventDefault(); addSkill() }
                        }}
                        className="border-gray-300"
                      />
                      <Button type="button" onClick={addSkill} className="bg-[#834de3] text-white">Add</Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.watch('skills').map((s, idx) => (
                        <span key={idx} className="bg-[#f1ebfc] text-[#834de3] px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                          {s}
                          <button type="button" onClick={() => removeSkill(idx)} className="text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Experience</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Briefly describe your relevant experience" {...field} className="border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appliedVia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Apply Via</FormLabel>
                    <div className="flex gap-4 text-sm text-gray-800">
                      {(['normal', 'whatsapp', 'referral'] as const).map((v) => (
                        <label key={v} className="flex items-center gap-2">
                          <input type="radio" value={v} checked={field.value === v} onChange={() => field.onChange(v)} />
                          {v === 'normal' ? 'Normal' : v === 'whatsapp' ? 'WhatsApp' : 'Referral'}
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Resume (optional)</FormLabel>
                    <FormControl>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-purple-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DrawerFooter>
                <Button type="submit" className="bg-[#834de3] text-white" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
                <DrawerClose asChild>
                  <Button type="button" variant="outline" className="border-gray-300 text-gray-800">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}