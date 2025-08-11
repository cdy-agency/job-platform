"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import NavBar from "@/components/home/NavBar";
import Hero from "@/components/home/hero";
import HowItsWorks from "@/components/home/howItsWorks";
import ForCompanies from "@/components/home/forCompanies";
import { FeaturedJobs } from "@/components/featured-jobs";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Hero />
        <HowItsWorks />
        <FeaturedJobs />
        <ForCompanies />
      </main>
      <Footer />
    </div>
  );
}
