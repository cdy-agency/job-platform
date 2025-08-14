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
        console.log('Extracted jobs array:', jobsArray); // Debug log
        
        // Transform the API response to match our JobDisplay interface
        const transformedJobs: JobDisplay[] = jobsArray.map((job: any) => ({
          id: job._id || job.id || `job-${Math.random()}`,
          title: job.title || 'Untitled Position',
          company: {
            name: job.companyId?.companyName || job.company?.name || job.companyName || 'Company',
            logo: job.companyId?.logo || job.company?.logo || job.logo,
            companyName: job.companyId?.companyName || job.company?.name || job.companyName || 'Company',
          },
          location: job.location || 'Location not specified',
          employmentType: job.employmentType || job.type || 'Full-time',
          salary: job.salary || job.salaryRange || 'Competitive',
          description: job.description || job.summary || 'Job description not available.',
          category: job.category || job.jobCategory,
          createdAt: job.createdAt || job.datePosted,
          featured: job.featured || job.isFeatured || false,
        }));

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
    <Card className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-[#834de3] bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="relative">
            {job.company.logo ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="h-12 w-12 rounded-lg object-cover ring-2 ring-gray-100 group-hover:ring-[#834de3] transition-all"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center ring-2 ring-gray-100 group-hover:ring-[#834de3] transition-all ${job.company.logo ? 'hidden' : ''}`}>
              <Building className="h-6 w-6 text-gray-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 group-hover:text-[#834de3] transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              {job.company.name}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                className={`text-xs ${getEmploymentColor(job.employmentType)}`}
              >
                {getEmploymentIcon(job.employmentType)}
                <span className="ml-1">{job.employmentType}</span>
              </Badge>
              {job.featured && (
                <Badge className="text-xs bg-yellow-500 text-white">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-[#834de3]" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 text-[#834de3]" />
            <span className="font-semibold text-gray-800">{job.salary}</span>
          </div>
          {job.category && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-gray-500">Category:</span>
              <span className="ml-1 font-medium">{job.category}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/jobs/${job.id}`} className="w-full">
          <Button className="w-full bg-[#834de3] hover:bg-[#9260e7] text-white font-medium transition-all duration-200 transform hover:scale-[1.02]">
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
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-md p-2 ${badgeColor}`}>{icon}</div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">{description} ({jobs.length} positions)</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
        >
          {isExpanded ? (
            <span className="flex items-center gap-2">
              <ChevronUp className="h-4 w-4" /> Collapse
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ChevronDown className="h-4 w-4" /> Expand ({jobs.length})
            </span>
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="p-4">
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No {title.toLowerCase()} available at the moment.</p>
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
        <main className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#834de3] mx-auto mb-4" />
              <p className="text-gray-600">Loading job opportunities...</p>
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
        <main className="container mx-auto px-4 py-10">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.reload()}
                className="bg-[#834de3] hover:bg-[#9260e7] text-white mr-2"
              >
                Try Again
              </Button>
              <p className="text-sm text-gray-500 mt-4">
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

      <main className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-gray-600">Discover amazing opportunities from top companies</p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs, companies..."
              className="h-12 rounded-lg border border-gray-300 bg-white pl-10 text-gray-900"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
          
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-12 rounded-lg border border-gray-300 bg-white text-gray-900">
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
            <SelectTrigger className="h-12 rounded-lg border border-gray-300 bg-white text-gray-900">
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
            <SelectTrigger className="h-12 rounded-lg border border-gray-300 bg-white text-gray-900">
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
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-[#834de3]">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''} 
            {searchTerm && <span> matching "{searchTerm}"</span>}
          </p>
        </div>

        {/* Job Sections */}
        <div className="space-y-6">
          <CollapsibleSection
            title="Full-time Jobs"
            description="Full-time positions with complete benefits"
            jobs={jobsByType.fullTime}
            isExpanded={expandedSections.fullTime}
            onToggle={() => toggleSection("fullTime")}
            icon={<Briefcase className="h-5 w-5 text-white" />}
            badgeColor="bg-[#834de3]"
          />

          <CollapsibleSection
            title="Part-time Jobs"
            description="Flexible roles with part-time hours"
            jobs={jobsByType.partTime}
            isExpanded={expandedSections.partTime}
            onToggle={() => toggleSection("partTime")}
            icon={<Clock className="h-5 w-5 text-white" />}
            badgeColor="bg-[#9260e7]"
          />

          <CollapsibleSection
            title="Internships"
            description="Gain experience with internship opportunities"
            jobs={jobsByType.internship}
            isExpanded={expandedSections.internship}
            onToggle={() => toggleSection("internship")}
            icon={<GraduationCap className="h-5 w-5 text-white" />}
            badgeColor="bg-gray-800"
          />
        </div>

        {/* Empty State */}
        {jobs.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Available</h3>
            <p className="text-gray-600">
              There are currently no job postings available. Check back later for new opportunities!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}