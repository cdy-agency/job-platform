import z from 'zod'

export const CompanyRegistrationSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  location: z.string().min(2, "Location must be at least 2 characters").optional().default(""),
  phoneNumber: z.string().min(6, "Phone number must be at least 6 digits").optional().default(""),
  website: z.string().url("Invalid website URL").optional().default(""),
  // For simplicity accept base64 string or URL for logo; backend may accept file too
  logo: z.string().optional().default(""),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const EmployeeRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid Email"),
  dateOfBirth: z.string().optional().default(""),
  phoneNumber: z.string().min(6, "Phone number must be at least 6 digits").optional().default(""),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(1, "Password is required"),
});

export type CompanyRegisterType = z.infer<typeof CompanyRegistrationSchema>
export type EmployeeRegisterType = z.infer<typeof EmployeeRegistrationSchema>
export type LoginType = z.infer<typeof LoginSchema>