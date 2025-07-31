"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { mockUsers } from "@/lib/mock-data"

const accountFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
})

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  jobAlerts: z.boolean(),
  applicationUpdates: z.boolean(),
  marketingEmails: z.boolean(),
})

const preferencesFormSchema = z.object({
  jobTypes: z.array(z.string()).nonempty({
    message: "Please select at least one job type.",
  }),
  locations: z.array(z.string()).nonempty({
    message: "Please select at least one location.",
  }),
  salaryRange: z.string().min(1, {
    message: "Please select a salary range.",
  }),
})

export default function UserSettingsPage() {
  const [isDeleting, setIsDeleting] = useState(false)

  // Mock data for the current user
  const currentUser = mockUsers[0]

  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: currentUser.preferences.notifications.email,
      jobAlerts: currentUser.preferences.notifications.jobAlerts,
      applicationUpdates: currentUser.preferences.notifications.applicationUpdates,
      marketingEmails: currentUser.preferences.notifications.marketingEmails,
    },
  })

  const preferencesForm = useForm<z.infer<typeof preferencesFormSchema>>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      jobTypes: currentUser.preferences.jobTypes,
      locations: currentUser.preferences.locations,
      salaryRange: currentUser.preferences.salaryRange,
    },
  })

  function onAccountSubmit(data: z.infer<typeof accountFormSchema>) {
    toast({
      title: "Account settings updated",
      description: "Your account settings have been updated successfully.",
    })
  }

  function onNotificationSubmit(data: z.infer<typeof notificationFormSchema>) {
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been updated successfully.",
    })
  }

  function onPreferencesSubmit(data: z.infer<typeof preferencesFormSchema>) {
    toast({
      title: "Job preferences updated",
      description: "Your job preferences have been updated successfully.",
    })
  }

  function onDeleteAccount() {
    // Simulate account deletion
    setTimeout(() => {
      setIsDeleting(false)
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      })
      // In a real app, we would redirect to the home page or login page
    }, 1000)
  }

  return (
    <div className="container space-y-6 p-6 pb-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="account" className="text-gray-600">
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-gray-600">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="text-gray-600">
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800">Account Information</CardTitle>
              <CardDescription className="text-gray-600">Update your account information and password</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...accountForm}>
                <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={accountForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800">Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={accountForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800">Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6 bg-gray-200" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Change Password</h3>
                    <FormField
                      control={accountForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800">Current Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={accountForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800">New Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={accountForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800">Confirm New Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Account</CardTitle>
              <CardDescription className="text-gray-600">
                Permanently delete your account and all of your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Once you delete your account, there is no going back. This action cannot be undone.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setIsDeleting(true)}
                className="border-red-200 bg-transparent text-red-600 hover:bg-red-50"
              >
                Delete Account
              </Button>
              {isDeleting && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleting(false)}
                    className="border-gray-300 bg-transparent text-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button onClick={onDeleteAccount} className="bg-red-600 text-white hover:bg-red-700">
                    Confirm Delete
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800">Notification Preferences</CardTitle>
              <CardDescription className="text-gray-600">Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-gray-800">Email Notifications</FormLabel>
                            <FormDescription className="text-gray-600">Receive notifications via email</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="jobAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-gray-800">Job Alerts</FormLabel>
                            <FormDescription className="text-gray-600">
                              Receive alerts for new job postings that match your preferences
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="applicationUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-gray-800">Application Updates</FormLabel>
                            <FormDescription className="text-gray-600">
                              Receive updates about your job applications
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-gray-800">Marketing Emails</FormLabel>
                            <FormDescription className="text-gray-600">
                              Receive marketing emails and newsletters
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">
                      Save Preferences
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800">Job Preferences</CardTitle>
              <CardDescription className="text-gray-600">
                Set your job preferences to get better job recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...preferencesForm}>
                <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                  <FormField
                    control={preferencesForm.control}
                    name="jobTypes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800">Job Types</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {["Full-time", "Part-time", "Contract", "Remote", "Internship"].map((type) => (
                            <Button
                              key={type}
                              type="button"
                              variant={field.value.includes(type) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                if (field.value.includes(type)) {
                                  field.onChange(field.value.filter((t) => t !== type))
                                } else {
                                  field.onChange([...field.value, type])
                                }
                              }}
                              className={
                                field.value.includes(type)
                                  ? "bg-blue-500 text-white hover:bg-blue-600"
                                  : "border-gray-300 bg-transparent text-gray-800"
                              }
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={preferencesForm.control}
                    name="locations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800">Preferred Locations</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {["New York", "San Francisco", "Chicago", "Boston", "Remote"].map((location) => (
                            <Button
                              key={location}
                              type="button"
                              variant={field.value.includes(location) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                if (field.value.includes(location)) {
                                  field.onChange(field.value.filter((l) => l !== location))
                                } else {
                                  field.onChange([...field.value, location])
                                }
                              }}
                              className={
                                field.value.includes(location)
                                  ? "bg-blue-500 text-white hover:bg-blue-600"
                                  : "border-gray-300 bg-transparent text-gray-800"
                              }
                            >
                              {location}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={preferencesForm.control}
                    name="salaryRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800">Salary Range</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300">
                              <SelectValue placeholder="Select salary range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="$40,000 - $60,000">$40,000 - $60,000</SelectItem>
                            <SelectItem value="$60,000 - $80,000">$60,000 - $80,000</SelectItem>
                            <SelectItem value="$80,000 - $100,000">$80,000 - $100,000</SelectItem>
                            <SelectItem value="$100,000 - $120,000">$100,000 - $120,000</SelectItem>
                            <SelectItem value="$120,000+">$120,000+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">
                      Save Preferences
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
