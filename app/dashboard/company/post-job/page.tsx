"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { postJob, fetchJobById, updateJob } from "@/lib/api"
import { X, Loader } from "lucide-react"
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

// Rwanda Provinces and Districts
const RWANDA_LOCATIONS = {
  "Kigali": ["Gasabo", "Kicukiro", "Nyarugenge"],
  "Eastern": ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
  "Northern": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  "Southern": ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
  "Western": ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"]
}

// Predefined Benefits Options
const BENEFITS_OPTIONS = [
  { 
    id: "holiday-days", 
    label: "Holiday Days", 
    description: "Paid vacation days per month",
    hasValue: true,
    valueLabel: "Days per month",
    valuePlaceholder: "e.g., 2"
  },
  { 
    id: "food-allowance", 
    label: "Food/Launch Allowance", 
    description: "Meals provided during work hours",
    hasValue: false
  },
  { 
    id: "living-allowance", 
    label: "Living Allowance", 
    description: "Housing or accommodation support",
    hasValue: true,
    valueLabel: "Monthly amount (RWF)",
    valuePlaceholder: "e.g., 50000"
  },
  { 
    id: "insurance", 
    label: "Insurance Coverage", 
    description: "Health and/or life insurance",
    hasValue: false
  },
  { 
    id: "transport-allowance", 
    label: "Transport Allowance", 
    description: "Transportation support",
    hasValue: true,
    valueLabel: "Monthly amount (RWF)",
    valuePlaceholder: "e.g., 30000"
  },
  { 
    id: "training-development", 
    label: "Training & Development", 
    description: "Professional development opportunities",
    hasValue: false
  }
]

// Experience options
const EXPERIENCE_OPTIONS = [
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3+", label: "3+ years" }
]

// Salary range options
const SALARY_RANGE_OPTIONS = [
  { value: "0-50", label: "0 - 50k RWF" },
  { value: "51-100", label: "51 - 100k RWF" },
  { value: "101-150+", label: "101 - 150k+ RWF" }
]

// Enhanced schema for location and benefits
const jobFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  image: z.instanceof(File).optional(),
  skills: z.array(z.string()).transform(val => val || []),
  province: z.string().min(1, { message: "Province is required." }),
  district: z.string().min(1, { message: "District is required." }),
  experience: z.string().optional(),
  employmentType: employmentEnum,
  salaryRange: z.string().optional(),
  category: z.string().min(1, { message: "Category is required." }),
  responsibilities: z.array(z.string()).transform(val => val || []),
  selectedBenefits: z.array(z.object({
    id: z.string(),
    label: z.string(),
    value: z.string().optional()
  })).optional(),
  applicationDeadline: z.string().optional(),
})

type JobFormValues = z.infer<typeof jobFormSchema>

export default function PostJobPage() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [skillsInput, setSkillsInput] = useState("")
	const [responsibilityInput, setResponsibilityInput] = useState("")
	const [selectedBenefits, setSelectedBenefits] = useState<{[key: string]: {selected: boolean, value: string}}>({})
	const [availableDistricts, setAvailableDistricts] = useState<string[]>([])
	const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
	const [removeExistingImage, setRemoveExistingImage] = useState<boolean>(false)
	
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const { user } = useAuth()
	const router = useRouter()
	const searchParams = useSearchParams()
	const jobId = searchParams.get('edit') // ?edit=jobId for editing mode
	const isEditMode = !!jobId

	const form = useForm<JobFormValues>({
		resolver: zodResolver(jobFormSchema),
		defaultValues: {
			title: "",
			description: "",
			image: undefined,
			skills: [],
			province: "",
			district: "",
			experience: "",
			employmentType: "fulltime",
			salaryRange: "",
			category: "",
			responsibilities: [],
			selectedBenefits: [],
			applicationDeadline: "",
		},
		mode: "onChange",
	})

	// Load existing job data for editing
	useEffect(() => {
		if (isEditMode && jobId) {
			loadJobForEditing(jobId)
		}
	}, [isEditMode, jobId])

	const loadJobForEditing = async (id: string) => {
		setIsLoading(true)
		try {
			const jobData = await fetchJobById(id)
			if (jobData) {
				// Get province and district from job data
				const province = jobData.province || ""
				const district = jobData.district || ""
				
				// Set available districts based on province
				if (province && RWANDA_LOCATIONS[province as keyof typeof RWANDA_LOCATIONS]) {
					setAvailableDistricts(RWANDA_LOCATIONS[province as keyof typeof RWANDA_LOCATIONS])
				}

				// Parse existing benefits
				const existingBenefits: {[key: string]: {selected: boolean, value: string}} = {}
				if (jobData.benefits && Array.isArray(jobData.benefits)) {
					jobData.benefits.forEach((benefit: string) => {
						// Try to match with predefined benefits
						const matchedBenefit = BENEFITS_OPTIONS.find(opt => 
							benefit.toLowerCase().includes(opt.label.toLowerCase())
						)
						if (matchedBenefit) {
							// Extract value if it has one (look for numbers)
							const valueMatch = benefit.match(/(\d+)/)
							existingBenefits[matchedBenefit.id] = {
								selected: true,
								value: valueMatch ? valueMatch[1] : ""
							}
						}
					})
				}
				setSelectedBenefits(existingBenefits)

				// Update form with existing data
				form.reset({
					title: jobData.title || "",
					description: jobData.description || "",
					skills: jobData.skills || [],
					province,
					district,
					experience: jobData.experience || "",
					employmentType: jobData.employmentType || "fulltime",
					salaryRange: jobData.salary || "",
					category: jobData.category || "",
					responsibilities: jobData.responsibilities || [],
					applicationDeadline: jobData.applicationDeadline ? 
						new Date(jobData.applicationDeadline).toISOString().split('T')[0] : "",
				})

				// Existing image preview support
				const possibleImage = (jobData as any)?.image?.url || (jobData as any)?.image || (jobData as any)?.banner || null
				if (typeof possibleImage === 'string') {
					setExistingImageUrl(possibleImage)
					setRemoveExistingImage(false)
				} else {
					setExistingImageUrl(null)
					setRemoveExistingImage(false)
				}
			}
		} catch (error) {
			console.error("Error loading job for editing:", error)
			toast({
				title: "Error",
				description: "Failed to load job data for editing",
				variant: "destructive",
			})
		} finally {
			setIsLoading(false)
		}
	}

	// Handle province change
	const handleProvinceChange = (province: string) => {
		form.setValue("province", province)
		form.setValue("district", "") // Reset district
		setAvailableDistricts(RWANDA_LOCATIONS[province as keyof typeof RWANDA_LOCATIONS] || [])
	}

	// Handle benefit selection
	const handleBenefitChange = (benefitId: string, checked: boolean, value?: string) => {
		setSelectedBenefits(prev => ({
			...prev,
			[benefitId]: {
				selected: checked,
				value: value || prev[benefitId]?.value || ""
			}
		}))
	}

	const addItem = (
		fieldName: "skills" | "responsibilities",
		value: string,
		setValue: (v: string) => void
	) => {
		if (!value.trim()) return
		const current = form.getValues(fieldName) || []
		form.setValue(fieldName, [...current, value.trim()], { shouldDirty: true, shouldValidate: true })
		setValue("")
	}

	const removeItem = (
		fieldName: "skills" | "responsibilities",
		index: number
	) => {
		const current = form.getValues(fieldName) || []
		const updated = [...current]
		updated.splice(index, 1)
		form.setValue(fieldName, updated, { shouldDirty: true, shouldValidate: true })
	}

	// Enhanced submit function for both create and update
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
				console.warn("⚠️ Using temporary company ID for testing")
			}

			// Build benefits array from selected benefits
			const benefits: string[] = []
			Object.entries(selectedBenefits).forEach(([benefitId, data]) => {
				if (data.selected) {
					const benefitOption = BENEFITS_OPTIONS.find(opt => opt.id === benefitId)
					if (benefitOption) {
						let benefitText = benefitOption.label
						if (benefitOption.hasValue && data.value) {
							benefitText += ` (${data.value}${benefitOption.valueLabel?.includes('Days') ? ' days' : ' RWF'})`
						}
						benefits.push(benefitText)
					}
				}
			})

			const jobData: any = {
				title: values.title,
				description: values.description,
				image: values.image,
				skills: values.skills || [],
				province: values.province,
				district: values.district,
				experience: values.experience || "",
				employmentType: values.employmentType,
				salary: values.salaryRange || "",
				category: values.category,
				responsibilities: values.responsibilities || [],
				benefits,
				...(isEditMode ? {} : { companyId }), // Only include companyId for new jobs
				applicationDeadline: values.applicationDeadline || "",
				companyId
			}

			// Delete existing image on edit when requested and no new image selected
			if (isEditMode && !values.image && removeExistingImage) {
				jobData.image = "delete"
			}

			console.log("Job data being sent:", jobData)

			let result
			if (isEditMode && jobId) {
				result = await updateJob(jobId, jobData)
				console.log("Job updated successfully:", result)
				toast({
					title: "Job updated successfully!",
					description: "Your job has been updated and is now live.",
				})
			} else {
				result = await postJob(jobData)
				console.log("Job posted successfully:", result)
				toast({
					title: "Job posted successfully!",
					description: "Your job has been posted and is now live.",
				})
			}
			
			router.push("/dashboard/company/jobs")
		} catch (e: any) {
			console.error("Error:", e)
			toast({
				title: `Failed to ${isEditMode ? 'update' : 'post'} job`,
				description: e?.response?.data?.message || e?.message || "Please try again. Check console for details.",
				variant: "destructive",
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isLoading) {
		return (
			<div className="container space-y-6 p-6 pb-16">
				<div className="flex items-center justify-center py-12">
					<Loader className="animate-spin h-8 w-8" />
					<span className="ml-2">Loading job data...</span>
				</div>
			</div>
		)
	}

	return (
		<div className="container space-y-6 p-6 pb-16">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-800">
					{isEditMode ? 'Edit Job' : 'Post a New Job'}
				</h1>
				<p className="text-gray-600">
					{isEditMode ? 'Update your job listing details' : 'Create a new job listing to attract qualified candidates'}
				</p>
			</div>

			<Card className="border-gray-200 bg-white text-black">
				<CardHeader>
					<CardTitle className="text-gray-800">Job Details</CardTitle>
					<CardDescription className="text-gray-600">
						{isEditMode ? 'Modify the form below to update your job listing' : 'Fill out the form below to create a new job listing'}
					</CardDescription>
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
												</div>))}
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

							{/* Province & District Location */}
							<div className="grid gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="province"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-800">Province</FormLabel>
											<Select onValueChange={handleProvinceChange} value={field.value}>
												<FormControl>
													<SelectTrigger className="border-gray-300">
														<SelectValue placeholder="Select province" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{Object.keys(RWANDA_LOCATIONS).map((province) => (
														<SelectItem key={province} value={province}>
															{province}
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
									name="district"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-800">District</FormLabel>
											<Select onValueChange={field.onChange} value={field.value} disabled={!availableDistricts.length}>
												<FormControl>
													<SelectTrigger className="border-gray-300">
														<SelectValue placeholder="Select district" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{availableDistricts.map((district) => (
														<SelectItem key={district} value={district}>
															{district}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormDescription className="text-gray-600">
												{!availableDistricts.length ? "Select a province first" : ""}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Experience & Salary Range */}
							<div className="grid gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="experience"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-800">Experience Required</FormLabel>
											<Select onValueChange={field.onChange} value={field.value}>
												<FormControl>
													<SelectTrigger className="border-gray-300">
														<SelectValue placeholder="Select experience level" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{EXPERIENCE_OPTIONS.map((exp) => (
														<SelectItem key={exp.value} value={exp.value}>
															{exp.label}
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
									name="salaryRange"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-800">Salary Range</FormLabel>
											<Select onValueChange={field.onChange} value={field.value}>
												<FormControl>
													<SelectTrigger className="border-gray-300">
														<SelectValue placeholder="Select salary range" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{SALARY_RANGE_OPTIONS.map((salary) => (
														<SelectItem key={salary.value} value={salary.value}>
															{salary.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
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
											<div>
												{isEditMode && existingImageUrl && !removeExistingImage && !field.value && (
													<div className="mb-3 flex items-center gap-3">
														<img src={existingImageUrl} alt="Existing" className="h-24 w-24 object-cover rounded border" />
														<div className="flex gap-2">
															<Button type="button" variant="outline" className="border-gray-300" onClick={() => setRemoveExistingImage(true)}>
																Remove image
															</Button>
															<Button type="button" variant="outline" className="border-gray-300" onClick={() => fileInputRef.current?.click()}>
																Replace image
															</Button>
														</div>
													</div>
												)}
												<input
													ref={fileInputRef}
													type="file"
													accept="image/*"
													onChange={(e) => {
														const file = e.target.files?.[0]
														field.onChange(file)
														if (file) {
															setRemoveExistingImage(false)
														}
													}}
													className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-purple-700"
												/>
												{isEditMode && existingImageUrl && removeExistingImage && !field.value && (
													<div className="mt-2 text-sm text-red-600">Existing image will be deleted.</div>
												)}
											</div>
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

							{/* Enhanced Benefits Section */}
							<div>
								<FormLabel className="text-gray-800 text-base font-medium">Benefits</FormLabel>
								<FormDescription className="text-gray-600 mb-4">
									Select the benefits you offer for this position
								</FormDescription>
								<div className="space-y-4">
									{BENEFITS_OPTIONS.map((benefit) => (
										<div key={benefit.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
											<Checkbox
													checked={selectedBenefits[benefit.id]?.selected || false}
													onCheckedChange={(checked) => 
														handleBenefitChange(benefit.id, checked as boolean)
													}
													className="mt-1"
												/>
											<div className="flex-1">
												<div className="flex items-center justify-between">
													<div>
														<label className="text-sm font-medium text-gray-800">
															{benefit.label}
														</label>
														<p className="text-sm text-gray-600 mt-1">
															{benefit.description}
														</p>
													</div>
													{benefit.hasValue && selectedBenefits[benefit.id]?.selected && (
														<div className="ml-4 min-w-[140px]">
															<Input
																	placeholder={benefit.valuePlaceholder}
																	value={selectedBenefits[benefit.id]?.value || ""}
																	onChange={(e) => 
																		handleBenefitChange(benefit.id, true, e.target.value)
																	}
																	className="border-gray-300 text-sm"
																/>
																<p className="text-xs text-gray-500 mt-1">
																	{benefit.valueLabel}
																</p>
														</div>
													)}
												</div>
											</div>
										))}
								</div>
							</div>

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

							{/* Submit Button */}
							<div className="flex justify-end pt-6">
								<Button
									type="submit"
									className="bg-[#834de3] text-white hover:bg-[#7239d3] disabled:opacity-50"
									disabled={isSubmitting}
								>
									{isSubmitting ? 
										(isEditMode ? "Updating..." : "Posting...") : 
										(isEditMode ? "Update Job" : "Post Job")
									}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}