"use client";

import { useState } from "react";
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
import { mockUsers } from "@/lib/mock-data";
import { toast } from "@/components/ui/use-toast";

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const currentUser = mockUsers[0];

  const handleSaveProfile = () => {
    setTimeout(() => {
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }, 500);
  };

  return (
    <div className="container space-y-6 p-6 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">
            Umwirondoro wanjye
          </h1>
          <p className="text-gray-600">
            Hindura umwirondoro wawe ma cv
          </p>
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
              <Button
                onClick={handleSaveProfile}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Emeze
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
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
                    src={currentUser.profilePicture || "/placeholder.svg"}
                    alt={currentUser.name}
                    className="h-full w-full object-cover"
                    width={128}
                    height={128}
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{currentUser.name}</h2>
                <p className="text-gray-600">{currentUser.experience[0].title}</p>
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
                  <span className="text-sm text-gray-600">{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Kigali Rwanda</span>
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
                {currentUser.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
                    {skill}
                  </span>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-dashed border-gray-300 bg-transparent text-gray-600"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Skill
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-800">Ibyangombwa</CardTitle>
              <Button size="sm" className="text-gray-600 hover:text-gray-800">
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
                      <p className="font-medium text-gray-800">{currentUser.resume}</p>
                      <p className="text-xs text-gray-600">Byahinduwe ibyumeru 2 bishize</p>
                    </div>
                  </div>
                  <Button size="sm" className="text-gray-600 hover:text-gray-800">
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
                    <p className="text-gray-600">
                      Experienced Frontend Developer with a passion for creating responsive and user-friendly web applications. Skilled in React, TypeScript, and modern frontend tools. Looking for opportunities to work on innovative projects with a collaborative team.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">Professional Summary</h3>
                    <p className="text-gray-600">
                      Over 5 years of experience in web development, specializing in frontend technologies. Proven track record of delivering high-quality, performant applications that meet business requirements and provide excellent user experiences.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="experience" className="mt-0">
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Uburambe</h3>
                    <Button size="sm" className="text-gray-600 hover:text-gray-800">
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  {currentUser.experience.map((exp, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{exp.title}</h4>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-600">{exp.duration}</p>
                          <p className="mt-2 text-gray-600">{exp.description}</p>
                        </div>
                      </div>
                      {index < currentUser.experience.length - 1 && <Separator className="my-4 bg-gray-200" />}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                    <Button size="sm" className="text-gray-600 hover:text-gray-800">
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  {currentUser.education.map((edu, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-600">{edu.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
