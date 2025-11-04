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
  Globe,
  Award,
  Target,
} from "lucide-react";
import { fetchJobById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/home/NavBar";
import { applyToJob, checkJobApplication } from "@/lib/api";
import { AppAvatar } from "@/components/ui/avatar";
import { formatDeadline } from "@/lib/utils";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/authContext";
import { useTranslation } from "react-i18next";

const mainPurple = "#834de3";

type CompanyShape = {
  name: string;
  logo?: string;
  about?: string;
  province?: string;
  district?: string;
  website?: string;
  employeeCount?: string;
};

type JobShape = {
  id: string;
  title: string;
  company: CompanyShape;
  district: string;
  province: string;
  employmentType: string;
  salary?: string;
  category: string;
  description: string;
  experience?: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[]; 
  skills: string[];
  featured?: boolean;
  applicationDeadline?: string;
  remainingDays?: number | null;
  image?: string;
};

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeSection, setActiveSection] = useState("about-us");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [applying, setApplying] = useState(false)
  const [job, setJob] = useState<JobShape | null>(null)
  const [loading, setLoading] = useState(true)
  const [applyOpen, setApplyOpen] = useState(false)
  const [applyMessage, setApplyMessage] = useState("")
  const [applyFile, setApplyFile] = useState<File | null>(null)
  const { toast } = useToast()
  const { user } = useAuth();
  const [hasApplied, setHasApplied] = useState(false);
  const { t } = useTranslation('jobs')

  useEffect(() => {
    setLoading(true);
    fetchJobById(id)
      .then((response: any) => {
        // Handle the response structure - it might be wrapped in a response object
        const found = response?.job || response?.data?.job || response;
        
        if (!found) { 
          setJob(null); 
          return; 
        }

        console.log('API Response:', found); // Debug log to see the actual structure

        // Build salary range
        const salaryParts = [];
        if (found.salaryMin) salaryParts.push(found.salaryMin);
        if (found.salaryMax) salaryParts.push(found.salaryMax);
        const salaryRange = salaryParts.length > 0 ? salaryParts.join(' - ') : '';

        // Extract company logo URL
        const companyLogo = found.companyId?.logo?.url || 
                           found.companyId?.logo || 
                           found.company?.logo?.url || 
                           found.company?.logo;

        // Extract job image URL
        const jobImage = found.image?.url || found.image;

        const mapped: JobShape = {
          id: found._id || found.id,
          title: found.title || 'Untitled Position',
          company: { 
            name: found.companyId?.companyName || found.company?.name || 'Company Name', 
            logo: companyLogo,
            about: found.companyId?.about || found.company?.about || 'Company description not available.',
            province: found.companyId?.province || found.company?.province || found.province,
            district: found.companyId?.district || found.company?.district || found.district,
            website: found.companyId?.website || found.company?.website,
            employeeCount: found.companyId?.employeeCount || found.company?.employeeCount,
          },
          province: found.province || found.companyId?.province || '—',
          district: found.district || found.companyId?.district || '—',
          employmentType: found.employmentType || 'full-time',
          salary: found.salary || salaryRange || '—',
          category: found.category || 'General',
          description: found.description || '',
          experience: found.experience || '1-3 years',
          responsibilities: Array.isArray(found.responsibilities) ? found.responsibilities : [],
          requirements: Array.isArray(found.requirements) ? found.requirements : [],
          skills: Array.isArray(found.skills) ? found.skills : [],
          benefits: Array.isArray(found.benefits) ? found.benefits : [],
          featured: Boolean(found.featured),
          applicationDeadline: found.applicationDeadline,
          remainingDays: typeof found.remainingDays === 'number' ? found.remainingDays : null,
          image: jobImage,
        };

        console.log('Mapped Job Data:', mapped); 
        setJob(mapped);
      })
      .catch((error) => {
        console.error('Error fetching job:', error);
        setJob(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (user && job) {
        try {
          const response = await checkJobApplication(job.id);
          setHasApplied(response.hasApplied);
        } catch (e) {
          console.error('Error checking application status:', e);
          setHasApplied(false);
        }
      }
    };

    checkApplicationStatus();
  }, [job, user]);

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        
        {/* Header Skeleton */}
        <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-6">
              {/* Logo Skeleton */}
              <div className="w-20 h-20 bg-white/20 rounded-full animate-pulse"></div>
              
              {/* Content Skeleton */}
              <div className="flex-1 space-y-4">
                <div className="h-10 bg-white/20 rounded-lg animate-pulse w-2/3"></div>
                <div className="h-6 bg-white/20 rounded animate-pulse w-1/2"></div>
                <div className="grid grid-cols-3 gap-8 mt-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                      <div className="h-6 bg-white/20 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action buttons skeleton */}
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg animate-pulse"></div>
                <div className="w-12 h-12 bg-white/20 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* Company section skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
          
          {/* Job details skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg border">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          
          {/* Other sections skeleton */}
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
              <div className="bg-white p-6 rounded-lg border space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
        <div className="text-center bg-white p-12 rounded-lg shadow-lg max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-purple-100 rounded-lg flex items-center justify-center">
            <Briefcase className="h-10 w-10 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('job-not-found-title')}</h1>
          <p className="text-gray-600 mb-8">
            {t('job-not-found-message')}
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            {t('back-to-home')}
          </Button>
        </div>
      </div>
    );
  }

  const handleApply = async () => {
    if (!job) return;
    
    setApplying(true);
    try {
      await applyToJob(job.id, { 
        coverLetter: applyMessage || undefined, 
        resumeFile: applyFile, 
        appliedVia: 'normal' 
      });
      
      toast({ 
        title: t('application-submitted-title'), 
        description: t('application-submitted-description'),
        variant: 'default'
      });
      
      setApplyOpen(false);
      setApplyMessage('');
      setApplyFile(null);
      setHasApplied(true); 
    } catch (error: any) {
      toast({ 
        title: t('application-failed-title'), 
        description: error?.response?.data?.message || 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setApplying(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({ 
      title: isBookmarked ? t('removed-bookmark') : t('bookmarked'),
      description: isBookmarked ? 'Job removed from your saved list.' : 'Job saved to your bookmarks.'
    })
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this amazing opportunity: ${job.title} at ${job.company.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: t('link-copied'), description: 'The job link has been copied to your clipboard.' })
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isDeadlinePassed = job.remainingDays !== null && job.remainingDays !== undefined && job.remainingDays <= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Header with job image background */}
      <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 min-h-[400px]">
        {/* Background Image with Overlay */}
        {job.image && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${job.image})` }}
          >
            <div className="absolute inset-0 bg-purple-900/70"></div>
          </div>
        )}
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute top-20 -left-20 w-60 h-60 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-white/5 rounded-full"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center gap-6">
            {/* Company Logo as Circle */}
            <div className="w-20 h-20 bg-white/10 rounded-full p-1 backdrop-blur-sm">
              <AppAvatar image={job.company.logo} name={job.company.name} size={76} />
            </div>

            {/* Job Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
                {job.title}
              </h1>
              
              <div className="flex items-center gap-4 text-white/90 mb-8">
                <span className="font-medium text-lg">{job.company.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.district}, {job.province}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-8 text-white">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-white/80" />
                    <p className="text-sm text-white/70 font-medium">{t('salary')}</p>
                  </div>
                  <p className="font-bold text-sm">{job.salary}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-white/80" />
                    <p className="text-sm text-white/70 font-medium">{t('experience')}</p>
                  </div>
                  <p className="font-bold text-sm">{job.experience} {t('years')}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-white/80" />
                    <p className="text-sm text-white/70 font-medium">{t('deadline')}</p>
                  </div>
                  <p className="font-bold text-sm">
                    {job.applicationDeadline ? formatDeadline(job.applicationDeadline) : 'Open'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm p-3"
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm p-3"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Company Description */}
        <section id="about-us" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About {job.company.name}</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {job.company.about}
          </p>
          {job.company.website && (
            <div className="flex items-center gap-2 text-purple-600">
              <Globe className="h-4 w-4" />
              <a 
                href={job.company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {t('visit-website')}
              </a>
            </div>
          )}
        </section>

        {/* Job Summary */}
        <section id="job-summary" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{job.title}</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {job.description}
          </p>
          
          {/* Job Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Briefcase className="h-4 w-4" />
                <span className="text-sm font-medium">{t('type')}</span>
              </div>
              <p className="text-gray-900 capitalize">{job.employmentType.replace('-', ' ')}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">Experience</span>
              </div>
              <p className="text-gray-900">{job.experience}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">{t('location')}</span>
              </div>
              <p className="text-gray-900">{job.province}, {job.district}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">Salary</span>
              </div>
              <p className="text-gray-900">{job.salary}</p>
            </div>
          </div>
        </section>

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <section id="responsibilities" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('responsibilities')}</h2>
            <div className="bg-white p-6 rounded-lg border">
              <ul className="space-y-3">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <section id="requirements" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('requirements')}</h2>
            <div className="bg-white p-6 rounded-lg border">
              <ul className="space-y-3">
                {job.requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <section id="benefits" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('benefits')}</h2>
            <div className="bg-white p-6 rounded-lg border">
              <ul className="space-y-3">
                {job.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <section id="skills" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('skills')}</h2>
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Apply Section */}
        <section id="apply" className="text-center py-12">
          <div className="bg-white p-8 rounded-lg border shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('apply-section-title')}</h3>
            <p className="text-gray-600 mb-6">
              {t('apply-section-message')} {job.company.name} {t('apply-section-message1')}
            </p>
            <Button 
              onClick={() => setApplyOpen(true)} 
              disabled={applying || isDeadlinePassed || hasApplied}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium"
              size="lg"
            >
              {applying ? t('submitting') : 
               hasApplied ? t('already-applied') : 
               isDeadlinePassed ? t('applications-closed') : 
               t('apply-now')}
            </Button>
            {job.applicationDeadline && (
              <p className="text-sm text-gray-500 mt-3">
                {t('application-deadline')} {formatDeadline(job.applicationDeadline)}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-purple-600 p-3 rounded-full text-white shadow-lg hover:bg-purple-700 transition-all duration-200 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Application Modal */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Apply for {job.title}
            </DialogTitle>
            <p className="text-gray-600 mt-2">
              We're excited to learn more about you! Please fill out the form below.
            </p>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('cover-letter')}
              </label>
              <textarea 
                  value={applyMessage} 
                  onChange={(e) => setApplyMessage(e.target.value)} 
                  placeholder={t('cover-letter-placeholder')}
                  maxLength={250}
                  className="block w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[120px] focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {applyMessage.length}/250 characters
                </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CV
              </label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                onChange={(e) => setApplyFile(e.target.files?.[0] || null)} 
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('cv-supported-formats')}
              </p>
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button 
              onClick={handleApply} 
              disabled={applying}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
            >
              {applying ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}