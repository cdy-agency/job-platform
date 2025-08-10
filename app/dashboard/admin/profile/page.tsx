"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"

export default function AdminProfilePage() {
  // Mock initial admin data, replace with real fetch from API
  const [name, setName] = useState("Admin User")
  const [email, setEmail] = useState("admin@example.com")
  const [oldPassword, setOldPassword] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Handle image file upload and preview
  function onImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setProfileImage(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Simple form submit handler
  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Password change validation:
    if (password || confirmPassword) {
      if (!oldPassword) {
        setError("Please enter your old password to change to a new one.")
        return
      }
      if (password !== confirmPassword) {
        setError("New passwords do not match.")
        return
      }
    }

    // TODO: Add API call to save profile info here
    setSuccessMessage("Profile updated successfully!")

    // Reset password fields after submission
    setOldPassword("")
    setPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="container max-w-md p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Admin Profile</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gray-300 bg-gray-100">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile Preview" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-gray-400">No Image</span>
            )}
          </div>
          <label
            htmlFor="profileImage"
            className="mt-2 cursor-pointer rounded bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Upload New Image
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Old Password */}
        <div>
          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
            Old Password
          </label>
          <input
            id="oldPassword"
            type="password"
            placeholder="Enter your current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Leave blank to keep current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Confirm New Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Error message */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Success message */}
        {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

        {/* Submit */}
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
          Save Changes
        </Button>
      </form>
    </div>
  )
}
