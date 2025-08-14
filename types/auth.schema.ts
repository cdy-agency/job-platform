import z from 'zod'
import { _email } from 'zod/v4/core'

export const  CompanyRegistrationSchema = z.object({
    companyName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    location: z.string().optional(),
    phoneNumber: z.string().optional(),
    website: z.string().optional(),
    logo: z.union([z.string().url("invalid url"),z.instanceof(File)]),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be atleast 6 characters")
}).refine((data)=> data.password === data.confirmPassword, {
    message:"Passwords do not match",
    path:["confirmPassword"]
})

export const EmployeeRegistrationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid Email"),
    dateOfBirth: z.string().optional(),
    phoneNumber: z.string().optional(),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be atleast 6 characters")
}).refine((data)=> data.password === data.confirmPassword, {
    message:"Passwords do not match",
    path:["confirmPassword"]

})

export const LoginSchema = z.object({
    email: z.string().email("Invalid Email"),
    password: z.string()
})

export type CompanyRegisterType = z.infer<typeof CompanyRegistrationSchema>
export type EmployeeRegisterType = z.infer<typeof EmployeeRegistrationSchema>
export type LoginType  = z.infer<typeof LoginSchema>