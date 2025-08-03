"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRegistrationForm } from "@/components/user-registration-form"
import { CompanyRegistrationForm } from "@/components/company-registration-form"

export default function RegisterPage() {
  const [role, setRole] = useState<"user" | "company" | null>(null)
  const router = useRouter()

  const handleRoleSelect = (selectedRole: "user" | "company") => {
    setRole(selectedRole)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="container flex flex-1 items-center justify-center py-12">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Kora Konti Yawe</CardTitle>
            <CardDescription className="text-gray-600">
              Join JobHub to find your next opportunity or hire top talent
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!role ? (
              <div className="space-y-4">
                <p className="text-center text-sm text-gray-600">Hitamo compte ushaka gukora:</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="flex h-24 flex-col items-center justify-center gap-2 border-gray-300 bg-transparent p-4 text-gray-800 hover:bg-gray-100"
                    onClick={() => handleRoleSelect("user")}
                  >
                    <User className="h-8 w-8" />
                    <span>Job Seeker</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex h-24 flex-col items-center justify-center gap-2 border-gray-300 bg-transparent p-4 text-gray-800 hover:bg-gray-100"
                    onClick={() => handleRoleSelect("company")}
                  >
                    <Briefcase className="h-8 w-8" />
                    <span>Sosiyete</span>
                  </Button>
                </div>
                <div className="mt-6 text-center text-sm text-gray-600">
                  Waba usanzwe ufote Konti?{" "}
                  <Link href="/login" className="font-medium text-blue-500 hover:underline">
                    Injira hano
                  </Link>
                </div>
              </div>
            ) : (
              <Tabs defaultValue={role} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user" onClick={() => setRole("user")} className="text-gray-600">
                    Ushaka akazi
                  </TabsTrigger>
                  <TabsTrigger value="company" onClick={() => setRole("company")} className="text-gray-600">
                    Sosiyete utanga akazi
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="user">
                  <UserRegistrationForm />
                </TabsContent>
                <TabsContent value="company">
                  <CompanyRegistrationForm />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
