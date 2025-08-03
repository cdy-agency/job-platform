"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  role: z.enum(["user", "company"], {
    required_error: "Please select a role.",
  }),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  })

  function onSubmit(data: LoginFormValues) {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      if (data.role === "user") {
        router.push("/dashboard/user")
      } else {
        router.push("/dashboard/company")
      }

      toast({
        title: "Login successful!",
        description: `You have logged in as a ${data.role === "user" ? "job seeker" : "company"}.`,
      })
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="container flex flex-1 items-center justify-center py-12">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Injira</CardTitle>
            <CardDescription className="text-gray-600">Uzuza imyirondoro yawe hano</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="name@example.com" {...field} className="border-gray-300" />
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-gray-800">Ijambobanga</FormLabel>
                        <Link href="/forgot-password" className="text-xs text-blue-500 hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} className="border-gray-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-800">Urinjira nkiki?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="user" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-600">Umuntu ushaka akazi</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="company" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-600">Utanga akazi</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log in"}
                  </Button>
                </div>
                <div className="text-center text-sm text-gray-600">
                  Don&apos;Usanzwe ufite Konti?{" "}
                  <Link href="/register" className="font-medium text-blue-500 hover:underline">
                    Fungura Konti
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
