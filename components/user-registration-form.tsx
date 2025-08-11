"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { authApi } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

const userFormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    profilePicture: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

type UserFormValues = z.infer<typeof userFormSchema>

export function UserRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const auth = useAuth()

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: UserFormValues) {
    setIsLoading(true)
    try {
      await authApi.registerEmployee({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      // Auto-login after successful registration
      const loginRes = await authApi.login(data.email, data.password)
      auth.login(loginRes.token, loginRes.user)
      toast({ title: "Account created!", description: "You have successfully registered as a job seeker." })
      router.push("/dashboard/user")
    } catch (err: any) {
      toast({ title: "Registration failed", description: err?.message || "Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} className="border-gray-300" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} className="border-gray-300" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Profile Picture (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files?.[0] || null)}
                  {...fieldProps}
                  className="border-gray-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-2">
          <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </div>
        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-500 hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </Form>
  )
}
