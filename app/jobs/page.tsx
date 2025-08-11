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
import { mockJobs } from "@/lib/mock-data";
import { fetchJobs } from "@/lib/api";

// Type definitions
interface Company {
  name: string;
  logo?: string;
}

interface JobDisplay {
  id: string;
  title: string;
  company: Company;
  location: string;
  employmentType: string;
  salary: string;
  description: string;
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
  const [remoteJobs, setRemoteJobs] = useState<JobDisplay[] | null>(null)

  // Load from API if logged-in employee
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) return
    fetchJobs()
      .then((list) => {
        const mapped: JobDisplay[] = (list || []).map((j: any) => ({
          id: j._id,
          title: j.title,
          company: { name: j.companyId?.companyName || 'Company', logo: j.companyId?.logo },
          location: j.location || '—',
          employmentType: j.employmentType || 'fulltime',
          salary: j.salary || '—',
          description: j.description || '',
        }))
        setRemoteJobs(mapped)
      })
      .catch(() => setRemoteJobs(null))
  }, [])

  const dataSource: JobDisplay[] = remoteJobs ?? mockJobs.map((m: any) => ({
    id: m.id,
    title: m.title,
    company: m.company,
    location: m.location,
    employmentType: m.employmentType,
    salary: m.salary,
    description: m.description,
  }))

  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    fullTime: true,
    partTime: false,
    internship: false,
  });

  const filteredJobs = useMemo(() => {
    return dataSource.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        location === "all" ||
        job.location.toLowerCase().includes(location.toLowerCase());

      let matchesSalary = true;
      const salaryNum = parseInt((job.salary || '').replace(/[^0-9]/g, ""));
      if (salaryRange === "under-50k") matchesSalary = salaryNum < 50000;
      if (salaryRange === "50k-100k")
        matchesSalary = salaryNum >= 50000 && salaryNum <= 100000;
      if (salaryRange === "over-100k") matchesSalary = salaryNum > 100000;

      return matchesSearch && matchesLocation && matchesSalary;
    });
  }, [searchTerm, location, salaryRange, dataSource]);

  const jobsByType = useMemo(() => {
    const fullTime = filteredJobs.filter(
      (job) => job.employmentType.toLowerCase() === "fulltime" || job.employmentType.toLowerCase() === "full-time"
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
            <img
              src={job.company.logo || "/placeholder.svg"}
              alt={job.company.name}
              className="h-12 w-12 rounded-lg object-cover ring-2 ring-gray-100 group-hover:ring-[#834de3] transition-all"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 group-hover:text-[#834de3] transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              {job.company.name}
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
            {job.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-semibold text-gray-800">{job.salary}</span>
          </div>
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
            <p className="text-sm text-gray-600">{description}</p>
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
              <ChevronDown className="h-4 w-4" /> Expand
            </span>
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="relative">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for jobs, companies, or keywords"
                className="h-12 rounded-lg border border-gray-300 bg-white pl-10 text-gray-900"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div className="flex gap-4">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-12 w-full rounded-lg border border-gray-300 bg-white text-gray-900">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="kigali">Kigali</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
            <Select value={salaryRange} onValueChange={setSalaryRange}>
              <SelectTrigger className="h-12 w-full rounded-lg border border-gray-300 bg-white text-gray-900">
                <SelectValue placeholder="Salary" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="under-50k">Under $50k</SelectItem>
                <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                <SelectItem value="over-100k">Over $100k</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <CollapsibleSection
            title="Full-time Jobs"
            description="Opportunities for full-time positions"
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
      </main>

      <Footer />
    </div>
  );
}
