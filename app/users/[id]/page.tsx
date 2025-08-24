"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { fetchUserById } from "@/lib/api";
import { Mail, Phone, MapPin, Calendar, Bookmark, User, ArrowLeft, Send } from "lucide-react";
import NavBar from "@/components/home/NavBar";
import { AppAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function UserProfile() {
  const params = useParams();
  const id = params?.id as string;
  const { token, user: currentUser } = useAuth();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerMessage, setOfferMessage] = useState("");
  const [sendingOffer, setSendingOffer] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    
    fetchUserById(id)
      .then((response) => {
        console.log('User API Response:', response); // Debug log
        // Handle different response structures
        const userData = response?.user || response?.data?.user || response;
        
        if (!userData) {
          setError(true);
          setUser(null);
        } else {
          setUser(userData);
        }
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
        setError(true);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, token, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="min-h-screen bg-[#f5f5fb] px-6 py-10">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header skeleton */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="space-y-3 flex-1">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-6 border-r border-gray-200 space-y-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or user not found
  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="min-h-screen bg-[#f5f5fb] px-6 py-10 flex items-center justify-center">
          <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-200 max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">User Not Found</h1>
            <p className="text-gray-600 mb-8">
              We couldn't find the user profile you're looking for.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/users")}
                className="bg-[#834de3] hover:bg-[#7c3aed] text-white px-6 py-2 rounded-lg w-full"
              >
                Back to Directory
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSendOffer = async () => {
    if (!offerMessage.trim()) return;
    
    setSendingOffer(true);
    try {
      // Here you would call the API to send the offer
      // For now, we'll just show a success message
      toast({
        title: "Offer sent successfully!",
        description: "The candidate will be notified of your job offer.",
        variant: "default"
      });
      
      setShowOfferModal(false);
      setOfferMessage("");
    } catch (error: any) {
      toast({
        title: "Failed to send offer",
        description: error?.response?.data?.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSendingOffer(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="min-h-screen bg-[#f5f5fb] px-6 py-10">
        {/* Back button */}
        <div className="max-w-6xl mx-auto mb-6">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Top header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-lg overflow-hidden">
                  <AppAvatar 
                    image={user.profileImage || user.avatar} 
                    name={user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'} 
                    size={80} 
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
                  </h1>
                  <div className="text-[#834de3] text-sm font-medium">
                    {user.role === 'employee' ? 'Job Seeker' : user.role === 'company' ? 'Company' : 'Member'}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    {(user.location || user.address) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> 
                        {user.location || user.address}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
                  <Bookmark className="h-4 w-4" /> Bookmark
                </button>
                {currentUser?.role === 'company' && (
                  <Button
                    onClick={() => setShowOfferModal(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm"
                    size="sm"
                  >
                    <Send className="h-4 w-4" /> Send Offer
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left column */}
            <div className="p-6 border-r border-gray-200 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4 text-[#834de3]" /> 
                    {user.phoneNumber || user.phone || 'Not provided'}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4 text-[#834de3]" /> 
                    {user.email || 'Not provided'}
                  </div>
                  {(user.address || user.location) && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-[#834de3]" /> 
                      {user.address || user.location}
                    </div>
                  )}
                </div>
              </div>

              {Array.isArray(user.skills) && user.skills.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-[#f1ebfc] text-[#834de3] rounded-full text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(user.jobPreferences) && user.jobPreferences.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.jobPreferences.map((p: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {user.experience && (
                <div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Experience</h3>
                  <p className="text-sm text-gray-700">{user.experience}</p>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="md:col-span-2 p-6">
              <div className="mb-4 flex items-center gap-6 text-sm">
                <button className="text-[#834de3] font-semibold">About</button>
                <span className="text-gray-300">|</span>
                <button className="text-gray-600 hover:text-[#834de3]">Timeline</button>
                <span className="text-gray-300">|</span>
                <button className="text-gray-600 hover:text-[#834de3]">Contacts</button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">About</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {user.about || user.bio || user.description || 'No bio added yet.'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Basic Information</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                      {user.gender && <div>Gender: {user.gender}</div>}
                      {user.dateOfBirth && <div>Birthday: {new Date(user.dateOfBirth).toLocaleDateString()}</div>}
                      {user.education && <div>Education: {user.education}</div>}
                    </div>
                  </div>
                  {user.workHistory && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Work History</h3>
                      <div className="text-sm text-gray-700">
                        {user.workHistory}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Send Job Offer to {user?.name || 'User'}
            </DialogTitle>
            <p className="text-gray-600 mt-2">
              Send a personalized job offer to this candidate.
            </p>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Offer Message
              </label>
              <Textarea 
                value={offerMessage} 
                onChange={(e) => setOfferMessage(e.target.value)} 
                placeholder="Write a personalized message about the job opportunity..."
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button 
              variant="outline"
              onClick={() => setShowOfferModal(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendOffer} 
              disabled={sendingOffer || !offerMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {sendingOffer ? 'Sending...' : 'Send Offer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}