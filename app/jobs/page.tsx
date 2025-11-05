"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Search,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchJobs } from "@/lib/api";
import { Footer } from "@/components/footer";
import NavBar from "@/components/home/NavBar";
import { useTranslation } from "react-i18next";

interface Company {
  _id: string;
  companyName: string;
  about?: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  province: string;
  district: string;
  employmentType: string;
  salary: string;
  category: string;
  experience?: string;
  companyId: Company;
  createdAt?: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [employmentFilter, setEmploymentFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const {t} = useTranslation('jobs')

  const typeJob = [t('jobs-filter-all'), t('jobs-filter-full-time'),t('jobs-filter-part-time'),t('jobs-filter-internship')]

  // Fetch jobs
  useEffect(() => {
  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchJobs();
      console.log("📦 Jobs API response:", data);

      // Handle both possible response formats
      const jobsArray = Array.isArray(data)
        ? data
      // @ts-expect-error error
        : Array.isArray(data?.jobs)
      // @ts-expect-error error
        ? data.jobs
        : [];

      setJobs(jobsArray);
    } catch (err) {
      console.error("❌ Error loading jobs:", err);
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  loadJobs();
}, []);


  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyId.companyName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesEmployment =
        employmentFilter === "all" ||
        job.employmentType.toLowerCase() === employmentFilter;
      return matchesSearch && matchesEmployment;
    });
  }, [jobs, searchTerm, employmentFilter]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#834de3] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#834de3] text-white">
            {t('jobs-retry')}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="max-w-5xl mx-auto w-full px-4 py-10 flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          {t('jobs-page-title')}
        </h1>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={('jobs-search-placeholder')}
              className="h-12 pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
          </div>

          <div className="flex gap-2 justify-center md:justify-start flex-wrap">
            {typeJob.map((type) => (
              <Button
                key={type}
                variant={employmentFilter === type ? "default" : "outline"}
                onClick={() => setEmploymentFilter(type)}
                className={
                  employmentFilter === type
                    ? "bg-[#834de3] text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }
              >
                {type === "all"
                  ? "All"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Job List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card
                key={job._id}
                className="p-5 hover:border-[#834de3] transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <Link
                      href={`/jobs/${job._id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-[#834de3] transition-colors"
                    >
                      {job.title}
                    </Link>
                    <p className="text-sm text-gray-600">
                      {job.companyId?.companyName}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.district || job.province}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.employmentType}
                      </span>
                      <span className="flex items-center gap-1">
                        💰 {job.salary}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="bg-[#834de3] hover:bg-[#925ef0] text-white rounded-md"
                  >
                    <Link href={`/jobs/${job._id}`}>{t('jobs-view')}</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            {t('jobs-no-results')}
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
