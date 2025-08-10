"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { email, password, rememberMe })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded shadow-2xl overflow-hidden">
        <div className="flex flex-col-reverse lg:flex-row">
          {/* Left side - Form */}
          <div className="flex-1 p-4 lg:p-8">
            <div className="max-w-md mx-auto">
              {/* Welcome text */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">HELLO!</h1>
                <p className="text-gray-500">Hey, welcome back to your place</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="sr-only">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white outline-none text-black"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="sr-only">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white outline-none text-black"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-purple-600">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium"
                >
                  Sign In
                </Button>

                <p className="text-center text-sm text-gray-500">
                  {"Don't have an account? "}
                  <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                    Sign Up
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="flex-1 bg-white flex items-center justify-center overflow-hidden p-2">
              <Image
                src="/auth.webp"
                alt="Authentication illustration"
                width={400}
                height={400}
                className="w-full h-full object-cover rounded-lg"
              />
          </div>
        </div>
      </div>
    </div>
  )
}
