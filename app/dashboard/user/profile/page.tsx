"use client";

import { useEffect, useState } from "react";
import {
  Edit,
  Mail,
  MapPin,
  Phone,
  Plus,
  X,
  Upload,
  Camera,
  FileText,
  Trash2,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { fetchEmployeeProfile, updateEmployeeProfile } from "@/lib/api";

// Define the profile type
interface EmployeeProfile {
  name?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  profileImage?: string;
  about?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  jobPreferences?: string[];
  resume?: string;
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
  }>;
}

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployeeProfile().then((data) => setProfile(data || null)).catch(() => setProfile(null))
  }, [])

  const handleSaveProfile = async () => {
    try {
      if (!profile) return
      const payload: Partial<EmployeeProfile> = {
        about: profile.about || '',
        experience: profile.experience || '',
        education: profile.education || '',
        name: profile.name || '',
        phoneNumber: profile.phoneNumber || '',
        location: profile.location || '',
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        jobPreferences: Array.isArray(profile.jobPreferences) ? profile.jobPreferences : [],
      }
      
      // Handle image upload if selected
      if (selectedImage) {
        // Here you would upload the image and get the URL
        // payload.profileImage = uploadedImageUrl
      }
      
      await updateEmployeeProfile(payload)
      setIsEditing(false)
      setIsEditingContact(false)
      setSelectedImage(null)
      setImagePreview(null)
      toast({ title: "Profile updated", description: "Your profile has been successfully updated." })
    } catch (e: any) {
      toast({ title: "Failed to update", description: e?.response?.data?.message || 'Try again', variant: 'destructive' })
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid file", description: "Please select an image file", variant: 'destructive' });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File too large", description: "Please select an image smaller than 5MB", variant: 'destructive' });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && profile) {
      const currentSkills = profile.skills || [];
      if (!currentSkills.includes(newSkill.trim())) {
        setProfile(prev => ({
          ...prev,
          skills: [...currentSkills, newSkill.trim()]
        }));
        setNewSkill("");
      } else {
        toast({ title: "Skill exists", description: "This skill is already added", variant: 'destructive' });
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile((prev: EmployeeProfile | null) => ({
      ...prev,
      skills: (prev?.skills || []).filter(skill => skill !== skillToRemove)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments = Array.from(files).map(file => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      }));
      
      setProfile((prev: EmployeeProfile | null) => ({
        ...prev,
        documents: [...(prev?.documents || []), ...newDocuments]
      }));
      
      toast({ title: "Files uploaded", description: `${files.length} file(s) uploaded successfully` });
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    setProfile((prev: EmployeeProfile | null) => ({
      ...prev,
      documents: (prev?.documents || []).filter(doc => doc.id !== documentId)
    }));
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
          {(isEditing || isEditingContact) ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setIsEditingContact(false)
                  setSelectedImage(null)
                  setImagePreview(null)
                }}
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
                <div className="mb-4 h-32 w-32 overflow-hidden rounded-full relative group">
                  <img
                    src={imagePreview || profile?.profileImage || "/placeholder.svg"}
                    alt={profile?.name || 'Profile'}
                    className="h-full w-full object-cover"
                    width={128}
                    height={128}
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{profile?.name || '—'}</h2>
                <p className="text-gray-600">{profile?.experience || '—'}</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="profile-image-upload"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-300 bg-transparent text-gray-800"
                    onClick={() => document.getElementById('profile-image-upload')?.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Hindura ifoto ikuranga
                  </Button>
                </div>
              </div>

              <Separator className="my-4 bg-gray-200" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{profile?.email || '—'}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    {isEditingContact ? (
                      <Input
                        value={profile?.phoneNumber || ''}
                        onChange={(e) => setProfile((prev: EmployeeProfile | null) => ({ 
                          ...prev, 
                          phoneNumber: e.target.value 
                        }))}
                        className="text-sm h-6 px-1"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{profile?.phoneNumber || '—'}</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsEditingContact(!isEditingContact)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    {isEditingContact ? (
                      <Input
                        value={profile?.location || 'Kigali Rwanda'}
                        onChange={(e) => setProfile((prev: EmployeeProfile | null) => ({ 
                          ...prev, 
                          location: e.target.value 
                        }))}
                        className="text-sm h-6 px-1"
                        placeholder="Enter location"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{profile?.location || 'Kigali Rwanda'}</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsEditingContact(!isEditingContact)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800">Ubemenyi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {(profile?.skills || []).map((skill: string) => (
                  <div key={skill} className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
                    <span>{skill}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Enter skill"
                    className="text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <Button
                    onClick={handleAddSkill}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-dashed border-gray-300 bg-transparent text-gray-600"
                  onClick={() => setIsEditing(true)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Skill
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-800">Ibyangombwa</CardTitle>
              <div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="documents-upload"
                />
                <Button 
                  size="sm" 
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => document.getElementById('documents-upload')?.click()}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add document</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(profile?.documents || []).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100 text-blue-500">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" className="text-gray-600 hover:text-gray-800">
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {(!profile?.documents || profile.documents.length === 0) && (
                  <div className="text-center text-gray-500 py-4">
                    <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No documents uploaded yet</p>
                  </div>
                )}
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
                    {isEditing ? (
                      <textarea
                        value={profile?.about || ''}
                        onChange={(e) => setProfile((prev: EmployeeProfile | null) => ({ ...prev, about: e.target.value }))}
                        className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-600">
                        {profile?.about || 'Experienced Frontend Developer with a passion for creating responsive and user-friendly web applications. Skilled in React, TypeScript, and modern frontend tools. Looking for opportunities to work on innovative projects with a collaborative team.'}
                      </p>
                    )}
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
                  {isEditing ? (
                    <textarea
                      value={profile?.experience || ''}
                      onChange={(e) => setProfile((prev: EmployeeProfile | null) => ({ ...prev, experience: e.target.value }))}
                      className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe your work experience..."
                    />
                  ) : (
                    <div className="space-y-2 text-gray-700">
                      {profile?.experience || '—'}
                    </div>
                  )}
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
                  {isEditing ? (
                    <textarea
                      value={profile?.education || ''}
                      onChange={(e) => setProfile((prev: EmployeeProfile | null) => ({ ...prev, education: e.target.value }))}
                      className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe your education background..."
                    />
                  ) : (
                    <div className="space-y-2 text-gray-700">
                      {profile?.education || '—'}
                    </div>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}