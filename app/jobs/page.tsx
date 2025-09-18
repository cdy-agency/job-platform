"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Clock,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Building,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import { fetchJobs } from "@/lib/api";
import { AppAvatar } from "@/components/ui/avatar";
import { formatDeadline } from "@/lib/utils";

// Type definitions
interface Company {
  name: string;
  logo?: string;
  companyName?: string;
}

interface JobDisplay {
  id: string;
  title: string;
  company: Company;
  location: string;
  employmentType: string;
  salary: string;
  description: string;
  category?: string;
  createdAt?: string;
  featured?: boolean;
  applicationDeadline?: string;
  remainingDays?: number | null;
  isExpired?: boolean;
  isActive?: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  description: string;
  jobs: JobDisplay[];
  isExpanded: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  badgeColor: string;
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("all");
  const [salaryRange, setSalaryRange] = useState("all");
  const [category, setCategory] = useState("all");
  const [jobs, setJobs] = useState<JobDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    fullTime: true,
    partTime: false,
    internship: false,
  });

  // Helper function to safely extract jobs array from API response
  const extractJobsArray = (data: any): any[] => {
    console.log('API Response:', data); // Debug log
    
    // Handle different possible response structures
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data && Array.isArray(data.jobs)) {
      return data.jobs;
    }
    
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    
    if (data && data.results && Array.isArray(data.results)) {
      return data.results;
    }

    // If data is an object with job-like properties, wrap it in an array
    if (data && typeof data === 'object' && data._id) {
      return [data];
    }
    
    return [];
  };

  // Load jobs from database
  useEffect(() => {
    const loadJobs = async () => {      
      setLoading(true);
      setError(null);
      
      try {
        const jobsData = await fetchJobs(category === 'all' ? undefined : category);
        console.log('Raw API response:', jobsData); // Debug log
        
        // Safely extract jobs array from response
        const jobsArray = extractJobsArray(jobsData);
        
        // Transform the API response to match our JobDisplay interface
        const transformedRaw: JobDisplay[] = jobsArray.map((job: any) => {
          const salaryStr = job.salary || (
            job.salaryMin || job.salaryMax
              ? `${job.salaryMin || ''}${job.salaryMin && job.salaryMax ? ' - ' : ''}${job.salaryMax || ''}`
              : job.salaryRange
          ) || 'Competitive';
          return {
            id: job._id || job.id || `job-${Math.random()}`,
            title: job.title || 'Untitled Position',
            company: {
              name: job.companyId?.companyName || job.company?.name || job.companyName || 'Company',
              logo: job.image || job.companyId?.logo || job.company?.logo || job.logo,
              companyName: job.companyId?.companyName || job.company?.name || job.companyName || 'Company',
            },
            location: job.location || 'Location not specified',
            employmentType: job.employmentType || job.type || 'Full-time',
            salary: salaryStr,
            description: job.description || job.summary || 'Job description not available.',
            category: job.category || job.jobCategory,
            createdAt: job.createdAt || job.datePosted,
            featured: job.featured || job.isFeatured || false,
            applicationDeadline: job.applicationDeadline,
            remainingDays: typeof job.remainingDays === 'number' ? job.remainingDays : undefined,
            isExpired: Boolean(job.isExpired),
            isActive: job.isActive,
          } as JobDisplay
        });

        // Filter out expired/inactive jobs just in case backend didn't filter
        const transformedJobs = transformedRaw.filter((j) => !j.isExpired && j.isActive !== false && !(typeof j.remainingDays === 'number' && j.remainingDays <= 0));

        console.log('Transformed jobs:', transformedJobs); // Debug log
        setJobs(transformedJobs);
      } catch (err) {
        console.error('Error loading jobs:', err);
        setError(`Failed to load jobs: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [category]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        location === "all" ||
        job.location.toLowerCase().includes(location.toLowerCase());

      let matchesSalary = true;
      if (salaryRange !== "all") {
        const salaryText = job.salary.toLowerCase();
        const salaryNum = parseInt((job.salary || '').replace(/[^0-9]/g, ""));
        
        if (salaryRange === "under-50k") {
          matchesSalary = salaryNum > 0 && salaryNum < 50000;
        } else if (salaryRange === "50k-100k") {
          matchesSalary = salaryNum >= 50000 && salaryNum <= 100000;
        } else if (salaryRange === "over-100k") {
          matchesSalary = salaryNum > 100000;
        }
      }

      return matchesSearch && matchesLocation && matchesSalary;
    });
  }, [searchTerm, location, salaryRange, jobs]);

  const jobsByType = useMemo(() => {
    const fullTime = filteredJobs.filter(
      (job) => job.employmentType.toLowerCase().includes("full") || job.employmentType.toLowerCase() === "fulltime"
    );
    const partTime = filteredJobs.filter(
      (job) => job.employmentType.toLowerCase().includes("part")
    );
    const internship = filteredJobs.filter(
      (job) => job.employmentType.toLowerCase() === "internship"
    );

    return { fullTime, partTime, internship };
  }, [filteredJobs]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getEmploymentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "full-time":
      case "fulltime":
        return <Briefcase className="w-4 h-4" />;
      case "part-time":
        return <Clock className="w-4 h-4" />;
      case "internship":
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  const getEmploymentColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "full-time":
      case "fulltime":
        return "bg-[#834de3] text-white";
      case "part-time":
        return "bg-[#9260e7] text-white";
      case "internship":
        return "bg-gray-800 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const JobCard = ({ job }: { job: JobDisplay }) => (
    <Card className="group relative overflow-hidden bg-white border border-gray-100 hover:border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Featured Badge */}
      {job.featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            Featured
          </div>
        </div>
      )}

      <CardHeader className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <AppAvatar image={job.company.logo} name={job.company.name} size={56} />
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-xl leading-tight mb-2 group-hover:text-[#834de3] transition-colors line-clamp-2">
              {job.title}
            </h3>
            <p className="text-gray-600 font-medium mb-3 text-sm">
              {job.company.name}
            </p>
            
            {/* Employment Type Badge */}
            <div className="flex items-center gap-2">
              <Badge className={`text-xs font-medium px-3 py-1 rounded-full ${getEmploymentColor(job.employmentType)} shadow-sm`}>
                {getEmploymentIcon(job.employmentType)}
                <span className="ml-1.5">{job.employmentType}</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-4">
        {/* Job Details - Simplified */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          {/* Location */}
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-[#834de3] mr-2" />
            <span className="font-medium">{job.location}</span>
          </div>

          {/* Remaining Days */}
          {job.applicationDeadline && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-blue-500 mr-2" />
              <span className="font-medium">{formatDeadline(job.applicationDeadline)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-2">
        <Link href={`/jobs/${job.id}`} className="w-full">
          <Button className="w-full h-10 bg-[#834de3] hover:bg-[#9260e7] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02]">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );

  const CollapsibleSection = ({
    title,
    description,
    jobs,
    isExpanded,
    onToggle,
    icon,
    badgeColor,
  }: CollapsibleSectionProps) => (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className={`rounded-lg p-2 ${badgeColor}`}>{icon}</div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-sm text-gray-600">{description} • {jobs.length} position{jobs.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" /> 
              <span>Collapse</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" /> 
              <span>Show {jobs.length}</span>
            </>
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="px-6 pb-6">
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No {title.toLowerCase()} available at the moment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#834de3] mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading job opportunities...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-2xl flex items-center justify-center">
              <Briefcase className="h-10 w-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h3>
            <p className="text-red-600 mb-6 font-medium">{error}</p>
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.reload()}
                className="bg-[#834de3] hover:bg-[#9260e7] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Try Again
              </Button>
              <p className="text-sm text-gray-500">
                Check the browser console for more details about the API response.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Find Your Dream Job</h1>
          <p className="text-xl text-gray-600">Discover amazing opportunities from top companies</p>
        </div>

        {/* Filters */}
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs, companies..."
              className="h-14 rounded-xl border-2 border-gray-200 bg-white pl-12 text-gray-900 font-medium focus:border-[#834de3] focus:ring-2 focus:ring-[#834de3]/20 transition-all duration-200"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
          
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-14 rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-[#834de3] focus:ring-2 focus:ring-[#834de3]/20">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="kigali">Kigali</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-14 rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-[#834de3] focus:ring-2 focus:ring-[#834de3]/20">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={salaryRange} onValueChange={setSalaryRange}>
            <SelectTrigger className="h-14 rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-[#834de3] focus:ring-2 focus:ring-[#834de3]/20">
              <SelectValue placeholder="Salary Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ranges</SelectItem>
              <SelectItem value="under-50k">Under $50k</SelectItem>
              <SelectItem value="50k-100k">$50k - $100k</SelectItem>
              <SelectItem value="over-100k">Over $100k</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-gray-700 font-medium">
              Found <span className="font-bold text-[#834de3] text-lg">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''} 
              {searchTerm && <span> matching "<span className="font-semibold">{searchTerm}</span>"</span>}
            </p>
          </div>
        </div>

        {/* Job Sections */}
        <div className="space-y-8">
          <CollapsibleSection
            title="Full-time Jobs"
            description="Full-time positions with complete benefits"
            jobs={jobsByType.fullTime}
            isExpanded={expandedSections.fullTime}
            onToggle={() => toggleSection("fullTime")}
            icon={<Briefcase className="h-6 w-6 text-white" />}
            badgeColor="bg-[#834de3]"
          />

          <CollapsibleSection
            title="Part-time Jobs"
            description="Flexible roles with part-time hours"
            jobs={jobsByType.partTime}
            isExpanded={expandedSections.partTime}
            onToggle={() => toggleSection("partTime")}
            icon={<Clock className="h-6 w-6 text-white" />}
            badgeColor="bg-[#9260e7]"
          />

          <CollapsibleSection
            title="Internships"
            description="Gain experience with internship opportunities"
            jobs={jobsByType.internship}
            isExpanded={expandedSections.internship}
            onToggle={() => toggleSection("internship")}
            icon={<GraduationCap className="h-6 w-6 text-white" />}
            badgeColor="bg-gray-800"
          />
        </div>

        {/* Empty State */}
        {jobs.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Briefcase className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Jobs Available</h3>
            <p className="text-gray-600 text-lg">
              There are currently no job postings available. Check back later for new opportunities!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}