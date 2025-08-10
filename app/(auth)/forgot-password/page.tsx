"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Fingerprint, ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      console.log("Password reset requested for:", email)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Form */}
          <div className="flex-1 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Flingger</span>
              </div>

              {/* Back to login link */}
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>

              {!isSubmitted ? (
                <>
                  {/* Welcome text */}
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                    <p className="text-gray-500">
                      No worries! Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="sr-only">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending Reset Link...
                        </div>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  {/* Success state */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email!</h1>
                    <p className="text-gray-500">
                      We've sent a password reset link to{" "}
                      <span className="font-medium text-gray-700">{email}</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 text-center">
                      Didn't receive the email? Check your spam folder or{" "}
                      <button
                        onClick={() => {
                          setIsSubmitted(false)
                          setEmail("")
                        }}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        try again
                      </button>
                    </p>

                    <Button
                      onClick={() => window.location.href = "mailto:"}
                      variant="outline"
                      className="w-full h-12 border-gray-200 rounded-xl hover:bg-gray-50"
                    >
                      Open Email App
                    </Button>
                  </div>
                </>
              )}

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Remember your password?{" "}
                  <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600 p-8 lg:p-12 flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <Image
                src="/images/auth-illustration.png"
                alt="Authentication illustration"
                width={400}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
