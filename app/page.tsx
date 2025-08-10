"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { mockJobs } from "@/lib/job-mock-data";
import NavBar from "@/components/home/NavBar";
import Hero from "@/components/home/hero";
import HowItsWorks from "@/components/home/howItsWorks";
import JobCard from "@/components/home/jobCard";
import ForCompanies from "@/components/home/forCompanies";


export default function Home() {
  const router = useRouter();
  const featuredJobs = mockJobs.slice(0, 3);

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
                featuredJobs.length > 3
                  ? "flex space-x-6 overflow-x-auto scrollbar-hide"
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              }`}
            >
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex-shrink-0 w-full sm:w-[300px] md:w-[320px] lg:w-[350px]"
                >
                  <JobCard job={job} onClick={handleJobClick} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <ForCompanies />
      </main>
      <Footer />
    </div>
  );
}
