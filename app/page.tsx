"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/footer";
import NavBar from "@/components/home/NavBar";
import Hero from "@/components/home/hero";
import HowItsWorks from "@/components/home/howItsWorks";
import JobCard from "@/components/home/jobCard";
import ForCompanies from "@/components/home/forCompanies";
import { listJobsForEmployee } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await listJobsForEmployee();
      const arr = Array.isArray(data) ? data : [];
      setJobs(arr.slice(0, 3));
    };
    load();
  }, []);

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Hero />
        <HowItsWorks />
        <section className="bg-white py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-black">
              Featured Jobs
            </h2>

            <div
              className={`${
                jobs.length > 3
                  ? "flex space-x-6 overflow-x-auto scrollbar-hide"
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              }`}
            >
              {jobs.map((job) => {
                const company = typeof job.companyId === 'object' ? job.companyId : ({} as any)
                const mapped = {
                  id: job._id,
                  title: job.title,
                  company: {
                    id: company._id || "",
                    name: company.companyName || "Company",
                    logo: company.logo || "/placeholder.svg",
                  },
                  companyId: company._id || "",
                  location: (job as any).location || "",
                  employmentType: job.employmentType,
                  category: job.category,
                  salary: job.salary || "",
                  description: job.description,
                  requirements: [],
                  responsibilities: [],
                  skills: job.skills || [],
                  experience: job.experience || "",
                  image: "",
                  featured: false,
                  postedDate: job.createdAt,
                  applicationDeadline: "",
                  applicants: [],
                  createdAt: job.createdAt,
                  updatedAt: job.updatedAt,
                }
                return (
                  <div
                    key={job._id}
                    className="flex-shrink-0 w-full sm:w-[300px] md:w-[320px] lg:w-[350px]"
                  >
                    <JobCard job={mapped as any} onClick={() => handleJobClick(job._id)} />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
        <ForCompanies />
      </main>
      <Footer />
    </div>
  );
}
