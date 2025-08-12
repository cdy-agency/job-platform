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
}

export default function UsersDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    fetchUsersDirectory()
      .then((list: any[]) => {
        const mapped: User[] = (Array.isArray(list) ? list : []).map((u: any) => ({
          id: u._id || u.id,
          name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'User',
          email: u.email || 'N/A',
          phone: u.phone || u.phoneNumber || 'N/A',
          location: u.location || u.address || 'N/A',
          profileImage: u.avatar || u.profileImage || undefined,
          joinDate: u.createdAt || new Date().toISOString(),
          status: u.status === 'inactive' ? 'inactive' : 'active',
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
    <Card className="group hover:shadow-xl hover:shadow-[#834de3]/10 transition-all duration-300 border border-gray-200 hover:border-[#834de3]/30 bg-white overflow-hidden cursor-pointer">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Profile Image */}
          <div className="relative mb-4">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-[#834de3]/20 transition-all duration-300"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#834de3] to-[#9260e7] flex items-center justify-center ring-4 ring-gray-100 group-hover:ring-[#834de3]/20 transition-all duration-300">
                <span className="text-white font-bold text-lg">
                  {getInitials(user.name)}
                </span>
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-[#834de3] transition-colors">
            {user.name}
          </h3>

          {/* Status Badge */}
          <Badge
            className={`mb-4 text-xs ${
              user.status === "active"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {user.status === "active" ? "● Active" : "● Inactive"}
          </Badge>

          {/* Contact Information */}
          <div className="w-full space-y-3">
            <div className="flex items-center justify-center text-sm text-gray-600 hover:text-[#834de3] transition-colors">
              <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>

            <div className="flex items-center justify-center text-sm text-gray-600 hover:text-[#9260e7] transition-colors">
              <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{user.phone}</span>
            </div>

            <div className="flex items-center justify-center text-sm text-gray-600 hover:text-[#834de3] transition-colors">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{user.location}</span>
            </div>
          </div>

          {/* Join Date */}
          <div className="mt-4 pt-4 border-t border-gray-100 w-full">
            <p className="text-xs text-gray-500">
              Joined {formatDate(user.joinDate)}
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={()=> router.push(`/users/${user.id}`)}
            className="w-full mt-4 bg-[#834de3] hover:bg-[#9260e7] text-white transition-all duration-200 transform hover:scale-[1.02]"
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
              alt="Find your dream job"
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
                  Users Directory
                </h1>
              </div>
              <p className="text-lg sm:text-xl text-purple-100 mb-6 sm:mb-8 max-w-2xl">
                Connect with our community members. Browse profiles and discover
                amazing people in our network.
              </p>

              {/* Search and Filters */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search by name, email, phone, or location..."
                      className="pl-12 h-10 sm:h-12 bg-white border-0 text-gray-800 placeholder:text-gray-500 rounded-xl font-medium text-sm sm:text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] h-10 sm:h-12 bg-white border-0 rounded-xl text-sm sm:text-base text-black">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="New York">Northern Province</SelectItem>
                      <SelectItem value="San Francisco">
                       Southern Province
                      </SelectItem>
                      <SelectItem value="Chicago">Western Province</SelectItem>
                      <SelectItem value="Boston">Eastern Province</SelectItem>
                      <SelectItem value="Seattle">Kigali City</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px] h-10 sm:h-12 bg-white border-0 rounded-xl text-sm sm:text-base text-black">
                      <SelectValue placeholder="Status" />
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
                <div className="text-4xl sm:text-6xl mb-4">👥</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  No users found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
                  Try adjusting your search criteria or filters to find more
                  community members
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("all");
                    setStatusFilter("all");
                  }}
                  className="bg-[#834de3] hover:bg-[#9260e7] text-white text-sm sm:text-base"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
