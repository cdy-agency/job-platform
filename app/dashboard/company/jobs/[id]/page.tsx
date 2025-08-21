"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { fetchJobById, updateJob } from "@/lib/api";
import { X } from "lucide-react";

const employmentEnum = z.enum(["fulltime", "part-time", "internship"]);

const jobFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  image: z.instanceof(File).optional(),
  skills: z.array(z.string()).transform((val) => val || []),
  location: z.string().min(1, { message: "Location is required." }),
  experience: z.string().optional(),
  employmentType: employmentEnum,
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  category: z.string().min(1, { message: "Category is required." }),
  responsibilities: z.array(z.string()).transform((val) => val || []),
  benefits: z.array(z.string()).transform((val) => val || []),
  applicationDeadline: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export default function EditJobPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobMeta, setJobMeta] = useState<{ isExpired?: boolean; applicationDeadline?: string; remainingDays?: number | null } | null>(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
  });

  useEffect(() => {
    const load = async () => {
      try {
        const job: any = await fetchJobById(id);
        if (!job) throw new Error("Job not found");
        setJobMeta({
          isExpired: Boolean(job.isExpired),
          applicationDeadline: job.applicationDeadline,
          remainingDays: typeof job.remainingDays === 'number' ? job.remainingDays : null,
        });
        form.reset({
          title: job.title || "",
          description: job.description || "",
          skills: Array.isArray(job.skills) ? job.skills : [],
          location: job.location || "",
          experience: job.experience || "",
          employmentType: job.employmentType || "fulltime",
          salaryMin: job.salaryMin || "",
          salaryMax: job.salaryMax || "",
          category: job.category || "",
          responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
          benefits: Array.isArray(job.benefits) ? job.benefits : [],
          applicationDeadline: job.applicationDeadline ? job.applicationDeadline.substring(0, 10) : "",
        });
      } catch (e: any) {
        toast({ title: "Failed to load job", description: e?.message || "", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const addItem = (
    fieldName: "skills" | "responsibilities" | "benefits",
    value: string,
    setValue: (v: string) => void
  ) => {
    if (!value.trim()) return;
    const current = form.getValues(fieldName) || [];
    form.setValue(fieldName, [...current, value.trim()], { shouldDirty: true, shouldValidate: true });
    setValue("");
  };

  const removeItem = (
    fieldName: "skills" | "responsibilities" | "benefits",
    index: number
  ) => {
    const current = form.getValues(fieldName) || [];
    const updated = [...current];
    updated.splice(index, 1);
    form.setValue(fieldName, updated, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (values: JobFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: any = { ...values };
      if (!payload.image) delete payload.image;
      await updateJob(id, payload);
      toast({ title: "Job updated" });
      router.push("/dashboard/company/jobs");
    } catch (e: any) {
      toast({ title: "Failed to update", description: e?.response?.data?.message || e?.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container space-y-6 p-6 pb-16">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Edit Job</h1>
          {jobMeta?.isExpired && (
            <span className="text-xs uppercase tracking-wide bg-gray-200 text-gray-700 px-2 py-1 rounded">Ended</span>
          )}
        </div>
        <p className="text-gray-600">
          Update your job listing
          {jobMeta?.applicationDeadline && (
            <>
              {" "}| Deadline: {new Date(jobMeta.applicationDeadline).toLocaleDateString()} {typeof jobMeta.remainingDays === 'number' && (
                <>
                  {" "}({jobMeta.remainingDays === 0 ? 'Deadline reached' : `${jobMeta.remainingDays} day${jobMeta.remainingDays === 1 ? '' : 's'} left`})
                </>
              )}
            </>
          )}
        </p>
      </div>
      <Card className={`${jobMeta?.isExpired ? 'border-gray-300' : 'border-gray-200'} bg-white text-black`}>
        <CardHeader>
          <CardTitle className="text-gray-800">Job Details</CardTitle>
          <CardDescription className="text-gray-600">Edit the form below and save</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <FormControl>
                        <Input placeholder="e.g. it-digital" {...field} className="border-gray-300" />
                      </FormControl>
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

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Kigali" {...field} className="border-gray-300" />
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
                      <Textarea placeholder="Describe the role" {...field} className="border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                        className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-purple-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                            e.preventDefault();
                            addItem("skills", skillsInput, setSkillsInput);
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
                            e.preventDefault();
                            addItem("responsibilities", responsibilityInput, setResponsibilityInput);
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
                            e.preventDefault();
                            addItem("benefits", benefitInput, setBenefitInput);
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

              <div className="flex justify-end pt-6">
                <Button type="submit" className="bg-[#834de3] text-white hover:bg-[#7239d3]" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
