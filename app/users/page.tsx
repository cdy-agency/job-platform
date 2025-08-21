"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Phone, Mail, Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import NavBar from "@/components/home/NavBar";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { fetchUsersDirectory } from "@/lib/api";

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  profileImage?: string;
  joinDate: string;
  status: "active" | "inactive";
  role?: 'employee' | 'company' | 'superadmin';
}

export default function UsersDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    fetchUsersDirectory()
      .then((list: any[]) => {
        // Filter to only show employees, not companies
        const employeesOnly = (Array.isArray(list) ? list : []).filter((u: any) => u.role === 'employee');
        
        const mapped: User[] = employeesOnly.map((u: any) => ({
          id: u._id || u.id,
          name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'User',
          email: u.email || 'N/A',
          phone: u.phone || u.phoneNumber || 'N/A',
          location: u.location || u.address || 'N/A',
          profileImage: u.avatar || u.profileImage || undefined,
          joinDate: u.createdAt || new Date().toISOString(),
          status: u.status === 'inactive' ? 'inactive' : 'active',
          role: u.role,
        }))
        setUsers(mapped)
      })
      .finally(() => setLoading(false))
  }, [token, router])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        locationFilter === "all" ||
        user.location.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [searchTerm, locationFilter, statusFilter, users]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const UserCard = ({ user }: { user: User }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Profile Image */}
          <div className="relative mb-4">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">
                  {getInitials(user.name)}
                </span>
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-base text-gray-900 mb-1">
            {user.name}
          </h3>

          {/* Role/Position */}
          <p className="text-sm text-gray-500 mb-3">
            {user.role === 'company' ? 'Company' : user.role === 'employee' ? 'Job Seeker' : 'Member'}
          </p>

          {/* Description/Bio */}
          <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">
            {user.location !== 'N/A' ? `Based in ${user.location}` : 'Community member'}. 
            {user.status === 'active' ? ' Available to connect.' : ' Currently inactive.'}
          </p>

          {/* Contact Info - Minimal */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
            {user.email !== 'N/A' && (
              <div className="flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                <span>Email</span>
              </div>
            )}
            {user.phone !== 'N/A' && (
              <div className="flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                <span>Phone</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={() => router.push(`/users/${user.id}`)}
            variant="outline"
            className="w-full h-8 text-xs border-gray-300 hover:border-[#834de3] hover:text-[#834de3] transition-colors"
            size="sm"
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-white py-20">
          <div className="absolute inset-0">
            <img
              src="/job.webp"
              alt="Users Directory"
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay to darken image */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#834de3]/80 via-[#9260e7]/80 to-[#834de3]/80" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 sm:w-10 sm:h-10" />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  Employees Directory
                </h1>
              </div>
              <p className="text-lg sm:text-xl text-purple-100 mb-6 sm:mb-8 max-w-2xl">
                Connect with our community members. Browse employee profiles and discover
                amazing people in our network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, email, phone, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="kigali">Kigali</SelectItem>
                      <SelectItem value="southern">Southern Province</SelectItem>
                      <SelectItem value="northern">Northern Province</SelectItem>
                      <SelectItem value="eastern">Eastern Province</SelectItem>
                      <SelectItem value="western">Western Province</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Users Grid Section */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Community Members
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {filteredUsers.length}{" "}
                {filteredUsers.length === 1 ? "member" : "members"} found
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-200">
                <div className="text-4xl sm:text-6xl mb-4">👥</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  Loading users...
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
                  Please wait while we fetch the community members.
                </p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-200">
                <div className="text-4xl sm:text-6xl mb-4">🧑‍🤝‍🧑</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  No users found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}