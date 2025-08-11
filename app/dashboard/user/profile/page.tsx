"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Edit,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { employeeApi } from "@/lib/api"
import { Employee } from "@/lib/types"
import { getAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Employee | null>(null)

  useEffect(() => {
    const { token } = getAuth()
    const load = async () => {
      try {
        if (!token) return
        const me = await employeeApi.me(token)
        setProfile(me)
      } catch (e: any) {
        toast({ title: "Failed to load profile", description: e?.message || "", variant: "destructive" })
      }
    }
    load()
  }, [])

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="container space-y-6 p-6 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Umwirondoro wanjye</h1>
          <p className="text-gray-600">Hindura umwirondoro wawe ma cv</p>
        </div>
        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-gray-300 bg-transparent text-gray-800"
              >
                Funga
              </Button>
              <Button onClick={handleSaveProfile} className="bg-blue-500 text-white hover:bg-blue-600">
                Emeze
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white hover:bg-blue-600">
              <Edit className="mr-2 h-4 w-4" />
              Hindura umwirondoro
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <img
                    src={(profile as any)?.profilePicture || "/placeholder.svg"}
                    alt={profile?.email || "User"}
                    className="h-full w-full object-cover"
                    width={128}
                    height={128}
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{(profile as any)?.name || profile?.email}</h2>
                <p className="text-gray-600">Employee</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" className="border-gray-300 bg-transparent text-gray-800">
                    Hindura ifoto ikuranga
                  </Button>
                </div>
              </div>

              <Separator className="my-4 bg-gray-200" />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{profile?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{profile?.phoneNumber || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">—</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800">Ubemenyi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {/* Skills not in Employee model; placeholder */}
                <Button variant="outline" size="sm" className="rounded-full border-dashed border-gray-300 bg-transparent text-gray-600">
                  <Plus className="mr-1 h-3 w-3" />
                  Add Skill
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-800">Ibyangombwa</CardTitle>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add document</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Resume</p>
                      <p className="text-xs text-gray-600">Byahinduwe ibyumeru 2 bishize</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs Section */}
        <Card className="border-gray-200">
          <Tabs defaultValue="about">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about" className="text-gray-600">Ibinyerekeyeho</TabsTrigger>
                <TabsTrigger value="experience" className="text-gray-600">Uburambe</TabsTrigger>
                <TabsTrigger value="education" className="text-gray-600">Amashuri</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="about" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">Ibinyerekeyeho</h3>
                    <p className="text-gray-600">—</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">Professional Summary</h3>
                    <p className="text-gray-600">—</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="experience" className="mt-0">
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Uburambe</h3>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <p className="text-gray-600">—</p>
                </div>
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <p className="text-gray-600">—</p>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
