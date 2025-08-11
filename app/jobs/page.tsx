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
import { listJobsForEmployee } from "@/lib/api";
import { useAuth } from "@/context/authContext";

// Type definitions
interface Job {
  _id: string;
  title: string;
  companyId: string | { _id: string; companyName: string; logo?: string };
  employmentType: string;
  category: string;
  salary?: string;
  description: string;
  location?: string;
}

interface CollapsibleSectionProps {
  title: string;
  description: string;
  jobs: Job[];
  isExpanded: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  badgeColor: string;
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("all");
  const [salaryRange, setSalaryRange] = useState("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user, isReady } = useAuth()

  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    fullTime: true,
    partTime: false,
    internship: false,
  });

  useEffect(() => {
    const load = async () => {
      // Only employees can hit employee/job APIs without 403
      if (!isReady || !user || user.role !== 'employee') {
        setJobs([] as any)
        return
      }
      const data = await listJobsForEmployee();
      setJobs((data as any) || []);
    };
    load();
  }, [user, isReady]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const company = typeof job.companyId === "object" ? job.companyId : ({} as any);
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.companyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        location === "all" ||
        (job as any).location?.toLowerCase().includes(location.toLowerCase());

      // Salary numeric filter is best-effort
      let matchesSalary = true;
      const salaryNum = parseInt((job.salary || "").replace(/[^0-9]/g, ""));
      if (salaryRange === "under-50k") matchesSalary = salaryNum < 50000;
      if (salaryRange === "50k-100k")
        matchesSalary = salaryNum >= 50000 && salaryNum <= 100000;
      if (salaryRange === "over-100k") matchesSalary = salaryNum > 100000;

      return matchesSearch && matchesLocation && matchesSalary;
    });
  }, [searchTerm, location, salaryRange, jobs]);

  const jobsByType = useMemo(() => {
    const fullTime = filteredJobs.filter(
      (job) => job.employmentType.toLowerCase() === "fulltime"
    );
    const partTime = filteredJobs.filter(
      (job) => job.employmentType.toLowerCase() === "part-time"
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

  const JobCard = ({ job }: { job: Job }) => {
    const company = typeof job.companyId === "object" ? job.companyId : ({} as any);
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-[#834de3] bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="relative">
              <img
                src={company.logo || "/placeholder.svg"}
                alt={company.companyName || "Company"}
                className="h-12 w-12 rounded-lg object-cover ring-2 ring-gray-100 group-hover:ring-[#834de3] transition-all"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 group-hover:text-[#834de3] transition-colors">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {company.companyName || "Company"}
              </p>
              <Badge
                className={`mt-2 text-xs ${getEmploymentColor(
                  job.employmentType
                )}`}
              >
                {getEmploymentIcon(job.employmentType)}
                <span className="ml-1">{job.employmentType}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-[#834de3]" />
              {(job as any).location || ""}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-semibold text-gray-800">{job.salary || ""}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        </CardContent>

        <CardFooter className="pt-0">
          <Link href={`/jobs/${job._id}`} className="w-full">
            <Button className="w-full bg-[#834de3] hover:bg-[#9260e7] text-white font-medium transition-all duration-200 transform hover:scale-[1.02]">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };

  const CollapsibleSection = ({
    title,
    description,
    jobs,
    isExpanded,
    onToggle,
    icon,
    badgeColor,
  }: CollapsibleSectionProps) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div
        className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 line-clamp-2 sm:line-clamp-none">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Badge
              variant="outline"
              className="text-[#834de3] border-[#834de3] text-xs sm:text-sm"
            >
              {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
            </Badge>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 border-t border-gray-100">
          {jobs.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4 sm:mt-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <p className="text-sm sm:text-base">
                No {title.toLowerCase()} match your search criteria
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-white py-16">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/job.webp"
              alt="Find your dream job"
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay to darken image */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#834de3]/80 via-[#9260e7]/80 to-[#834de3]/80" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Find Your Dream Job
              </h1>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl">
                Discover amazing opportunities from top companies. Your next
                career move starts here.
              </p>

              {/* Search and Filters */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] mb-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search jobs, companies, or keywords..."
                      className="pl-12 h-12 bg-white border-0 text-gray-800 placeholder:text-gray-500 rounded-xl font-medium"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="md:w-[200px] h-12 bg-white border-0 rounded-xl text-black">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Western">Western Province</SelectItem>
                      <SelectItem value="Eastern">Eastern Province</SelectItem>
                      <SelectItem value="Northern">North Province</SelectItem>
                      <SelectItem value="Kigali">Kigali City</SelectItem>
                      <SelectItem value="Southern">Southern Province</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={salaryRange} onValueChange={setSalaryRange}>
                    <SelectTrigger className="md:w-[200px] h-12 bg-white border-0 rounded-xl text-black">
                      <SelectValue placeholder="Salary Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Salaries</SelectItem>
                      <SelectItem value="under-50k">Under RWF 50,000</SelectItem>
                      <SelectItem value="50k-100k">
                          50,000 - 100,000
                      </SelectItem>
                      <SelectItem value="over-100k">Over RWF 100,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Section with Collapsible Categories */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Browse by Job Type
              </h2>
              <p className="text-gray-600">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"} found across all
                categories
              </p>
            </div>

            <div className="space-y-6">
              {/* Full-time Jobs Section */}
              <CollapsibleSection
                title="Full-time Jobs"
                description="Permanent positions with full benefits and career growth opportunities"
                jobs={jobsByType.fullTime}
                isExpanded={expandedSections.fullTime}
                onToggle={() => toggleSection("fullTime")}
                icon={<></>}
                badgeColor=""
              />

              {/* Part-time Jobs Section */}
              <CollapsibleSection
                title="Part-time Jobs"
                description="Flexible positions perfect for work-life balance and side opportunities"
                jobs={jobsByType.partTime}
                isExpanded={expandedSections.partTime}
                onToggle={() => toggleSection("partTime")}
                icon={<></>}
                badgeColor=""
              />

              {/* Internship Section */}
              <CollapsibleSection
                title="Internships"
                description="Gain valuable experience and kickstart your career with these learning opportunities"
                jobs={jobsByType.internship}
                isExpanded={expandedSections.internship}
                onToggle={() => toggleSection("internship")}
                icon={<></>}
                badgeColor=""
              />
            </div>

            {/* No Jobs Found State */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search criteria or filters to find more
                  opportunities
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setLocation("all");
                    setSalaryRange("all");
                  }}
                  className="bg-[#834de3] hover:bg-[#9260e7] text-white"
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
