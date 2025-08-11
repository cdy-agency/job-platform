import z from 'zod'
import { _email } from 'zod/v4/core'

export const  CompanyRegistrationSchema = z.object({
    companyName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    location: z.string().email(),
    phoneNumber: z.string().min(6),
    website: z.string().min(3),
    logo: z.string().url("invalid url"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be atleast 6 characters")
}).refine((data)=> data.password === data.confirmPassword, {
    message:"Passwords do not match",
    path:["confirmPassword"]
})

export const EmployeeRegistrationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid Email"),
    dateOfBirth: z.string(),
    phoneNumber: z.string().min(10, "Phone number must be 10 digits").max(10, "Phone number must not exceed 10 digits"),
    password: z.string().min(4, "Password must be atleast 6 characters"),
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