"use client"

import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MapPin, Clock, Users, Building, Star } from 'lucide-react';
import { getJobById } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export default function JobDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const job = getJobById(id as string);
  
  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <Button onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    // Handle job application logic here
    alert('Application submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Jobs
          </button>
          
          <div className="flex items-start gap-6">
            <img
              src={job.company.logo}
              alt={job.company.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Building className="h-5 w-5" />
                  <span className="text-lg">{job.company.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  <span>{job.experience}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  {job.employmentType.charAt(0).toUpperCase() + job.employmentType.slice(1)}
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {job.category}
                </span>
                {job.featured && (
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              {job.salary && (
                <div className="text-2xl font-bold text-purple-600 mb-4">
                  {job.salary}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Application Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Apply for this job</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium">{new Date(job.postedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Deadline</span>
                  <span className="font-medium">{new Date(job.applicationDeadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Applicants
                  </span>
                  <span className="font-medium">{job.applicants.length}</span>
                </div>
              </div>

              <Button 
                onClick={handleApply}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Apply Now
              </Button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By applying, you agree to our terms and privacy policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}