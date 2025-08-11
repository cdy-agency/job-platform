"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  MapPin,
  Clock,
  Users,
  Building,
  Star,
  Bookmark,
  Share2,
  ArrowUp,
  CheckCircle,
  Briefcase,
  DollarSign,
  Calendar,
} from "lucide-react";
import { listJobsForEmployee } from "@/lib/api";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/home/NavBar";
import { useAuth } from "@/context/authContext";

const mainPurple = "#834de3";

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeSection, setActiveSection] = useState("about-us");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [job, setJob] = useState<any | null>(null);
  const { user, isReady } = useAuth()

  useEffect(() => {
    const load = async () => {
      // Only employees fetch via employee jobs API to avoid 403
      if (!isReady || !user || user.role !== 'employee') {
        setJob(null)
        return
      }
      const all = await listJobsForEmployee();
      const found = (all as any[]).find((j) => j._id === id);
      setJob(found || null);
    };
    load();
  }, [id, user, isReady]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "about-us",
        "job-summary",
        "responsibilities",
        "requirements",
        "skills",
        "apply",
      ];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section);
          break;
        }
      }

      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#f5f5fb]">
        <div className="text-center bg-white p-8 rounded-lg border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-md flex items-center justify-center">
            <Briefcase className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-6">
            The job you're looking for doesn't exist or requires login as an employee.
          </p>
          <Button
            onClick={() => router.push("/login")}
            style={{ backgroundColor: mainPurple }}
            className="hover:brightness-110"
          >
            Login to view
          </Button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    if (!user || user.role !== 'employee') {
      router.push('/login')
      return
    }
    alert("Application submitted successfully!")
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job at ${(job.companyId as any)?.companyName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tocItems = [
    { id: "about-us", label: "About Us", icon: <Building className="h-4 w-4" /> },
    { id: "job-summary", label: "Job Summary", icon: <Briefcase className="h-4 w-4" /> },
    { id: "responsibilities", label: "Responsibilities", icon: <CheckCircle className="h-4 w-4" /> },
    { id: "requirements", label: "Requirements", icon: <Users className="h-4 w-4" /> },
    { id: "skills", label: "Skills", icon: <Star className="h-4 w-4" /> },
    { id: "apply", label: "How to Apply", icon: <ArrowUp className="h-4 w-4" /> },
  ];

  const company = typeof job.companyId === "object" ? job.companyId : ({} as any);

  return (
    <div className="min-h-screen bg-[#f5f5fb]">
      <NavBar />

      {/* Header */}
      <div className="relative overflow-hidden bg-white py-12 px-8 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-8">
          <img
            src={company.logo}
            alt={company.companyName}
            className="w-24 h-24 rounded-md border border-gray-300 object-cover"
          />

          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1
                  className="text-4xl font-bold"
                  style={{ color: mainPurple }}
                >
                  {job.title}
                </h1>
                <p className="text-gray-700 font-medium">{company.companyName}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="border bg-white border-gray-300 hover:bg-[#f0eaff] text-gray-700"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <InfoCard
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={(job as any).location || ""}
              />
              <InfoCard
                icon={<Clock className="h-4 w-4" />}
                label="Experience"
                value={job.experience || ""}
              />
              <InfoCard
                icon={<DollarSign className="h-4 w-4" />}
                label="Salary"
                value={job.salary || "Competitive"}
              />
              <InfoCard
                icon={<Calendar className="h-4 w-4" />}
                label="Posted"
                value={new Date(job.createdAt).toLocaleDateString()}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge text={job.employmentType} />
              <Badge text={job.category} />
              {(job as any).featured && <Badge text="Featured" />}
              <Badge text="Remote Friendly" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <nav className="sticky top-24 bg-white border border-gray-200 rounded-md p-5">
            <h3
              className="text-sm font-bold text-gray-700 mb-6 uppercase tracking-wider flex items-center gap-2"
              style={{ color: mainPurple }}
            >
              <div
                className="w-1 h-4 rounded"
                style={{ backgroundColor: mainPurple }}
              ></div>
              Contents
            </h3>
            <ul className="space-y-1">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                      activeSection === item.id
                        ? `bg-[#e5dbff] text-[#834de3]`
                        : "text-gray-600 hover:text-[#834de3]"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 ${
                        activeSection === item.id ? "text-[#834de3]" : "text-gray-400"
                      }`}
                    >
                      {item.icon}
                    </div>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="lg:col-span-3 space-y-8">
          <Section id="about-us" title="About Us" color={mainPurple}>
            <p className="text-gray-700 leading-relaxed text-lg">
              {company.companyName}
            </p>
          </Section>

          <Section id="job-summary" title="Job Summary" color={mainPurple}>
            <p className="text-gray-700 leading-relaxed text-lg">
              {job.description}
            </p>
          </Section>

          <Section id="responsibilities" title="Responsibilities" color={mainPurple}>
            <SimpleList items={(job as any).responsibilities || []} />
          </Section>

          <Section id="requirements" title="Requirements" color={mainPurple}>
            <SimpleList items={(job as any).requirements || []} />
          </Section>

          <Section id="skills" title="Skills Required" color={mainPurple}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(job.skills || []).map((skill: string, i: number) => (
                <div
                  key={i}
                  className="border border-gray-300 rounded-md p-3 text-gray-700 font-semibold text-sm text-center hover:bg-[#f3e8ff] cursor-default"
                >
                  {skill}
                </div>
              ))}
            </div>
          </Section>

          <Section id="apply" title="Ready to Apply?" color={mainPurple}>
            <div className="text-center py-6">
              <Button
                onClick={handleApply}
                style={{ backgroundColor: mainPurple }}
                className="text-white font-bold px-10 py-3 rounded-md transition-transform duration-200 hover:scale-105"
              >
                Apply Now
              </Button>
              <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto">
                Join our team and be part of something amazing. We review all
                applications within 48 hours.
              </p>
            </div>
          </Section>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{ backgroundColor: mainPurple }}
          className="fixed bottom-8 right-8 text-white p-3 rounded-full transition-transform duration-200 hover:scale-110 z-50"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-4 w-4 text-[#834de3]">{icon}</div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function Section({
  id,
  title,
  children,
  color,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  color: string;
}) {
  return (
    <section
      id={id}
      className="bg-white rounded-md p-8 border border-gray-200 scroll-mt-28"
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-1 h-8 rounded"
          style={{ backgroundColor: color }}
        ></div>
        <h2
          className="text-2xl font-bold"
          style={{ color: color }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span
      className="px-3 py-1 text-sm font-semibold text-white rounded-md"
      style={{ backgroundColor: mainPurple }}
    >
      {text}
    </span>
  );
}

function SimpleList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <div
            className="w-5 h-5 bg-[#834de3] rounded flex items-center justify-center text-white flex-shrink-0"
          >
            <CheckCircle className="h-3 w-3" />
          </div>
          <span className="text-gray-700">{item}</span>
        </li>
      ))}
    </ul>
  );
}
