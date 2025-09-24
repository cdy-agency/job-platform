"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  BookOpen, 
  FileText, 
  Send, 
  Handshake, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  TrendingUp,
  Users,
  Briefcase,
  MessageSquare,
  Calendar,
  Star,
  Award,
  Target,
  Zap
} from "lucide-react"

export default function UserGuidelines() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">User Guidelines & Training</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Master your job search journey with our comprehensive training guide. Learn how to create compelling CVs, 
          apply for jobs effectively, and respond to job offers professionally.
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-xl">CV Creation</CardTitle>
            <CardDescription>Learn to create professional CVs that stand out</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Job Applications</CardTitle>
            <CardDescription>Master the art of effective job applications</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Handshake className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">Job Offers</CardTitle>
            <CardDescription>Handle job offers and negotiations professionally</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* CV Creation Guide */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Creating Your Professional CV</CardTitle>
                <CardDescription>Step-by-step guide to building a compelling CV that gets you noticed</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="cv-basics">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold">CV Fundamentals & Structure</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Essential CV Sections:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Contact Information:</strong> Name, phone, email, LinkedIn profile</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Professional Summary:</strong> 2-3 sentences highlighting your key strengths</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Work Experience:</strong> Most recent first, include achievements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Education:</strong> Degrees, certifications, relevant coursework</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Skills:</strong> Technical and soft skills relevant to your field</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">Pro Tips:</h4>
                          <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                            <li>• Keep your CV to 1-2 pages maximum</li>
                            <li>• Use action verbs to describe your achievements</li>
                            <li>• Tailor your CV for each specific job application</li>
                            <li>• Use a clean, professional format</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cv-writing">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Writing Effective Content</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Professional Summary Example:</h4>
                        <p className="text-sm text-blue-700 italic">
                          "Results-driven marketing professional with 3+ years of experience in digital marketing 
                          and social media management. Proven track record of increasing brand engagement by 40% 
                          and driving lead generation campaigns that exceeded targets by 25%."
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Achievement-Based Experience:</h4>
                        <p className="text-sm text-green-700">
                          Instead of: "Responsible for social media management"<br/>
                          Write: "Managed social media campaigns resulting in 50% increase in follower engagement"
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cv-optimization">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">CV Optimization & ATS</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">ATS-Friendly Tips:</h4>
                      <ul className="space-y-2 text-sm text-green-700">
                        <li>• Use standard section headings (Experience, Education, Skills)</li>
                        <li>• Include relevant keywords from job descriptions</li>
                        <li>• Save as PDF or Word document</li>
                        <li>• Avoid graphics, tables, or complex formatting</li>
                        <li>• Use standard fonts like Arial, Calibri, or Times New Roman</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Job Application Guide */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Send className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Mastering Job Applications</CardTitle>
                <CardDescription>Learn how to apply for jobs effectively and increase your chances of success</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="application-process">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Application Process</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                        <div>
                          <h4 className="font-semibold text-blue-800">Research the Company</h4>
                          <p className="text-sm text-blue-700">Understand the company culture, values, and recent news before applying.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                        <div>
                          <h4 className="font-semibold text-blue-800">Customize Your Application</h4>
                          <p className="text-sm text-blue-700">Tailor your CV and cover letter to match the specific job requirements.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                        <div>
                          <h4 className="font-semibold text-blue-800">Submit Application</h4>
                          <p className="text-sm text-blue-700">Double-check all documents and submit through the platform or company website.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                        <div>
                          <h4 className="font-semibold text-blue-800">Follow Up</h4>
                          <p className="text-sm text-blue-700">Send a polite follow-up email after 1-2 weeks if you haven't heard back.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cover-letter">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold">Writing Cover Letters</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Cover Letter Structure:</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <strong className="text-purple-700">Opening:</strong>
                          <p className="text-purple-600">State the position you're applying for and how you learned about it.</p>
                        </div>
                        <div>
                          <strong className="text-purple-700">Body:</strong>
                          <p className="text-purple-600">Highlight 2-3 relevant experiences that match the job requirements.</p>
                        </div>
                        <div>
                          <strong className="text-purple-700">Closing:</strong>
                          <p className="text-purple-600">Express enthusiasm and request an interview opportunity.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="application-tips">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold">Application Best Practices</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">✅ Do's:</h4>
                        <ul className="space-y-1 text-sm text-green-700">
                          <li>• Apply within 48 hours of job posting</li>
                          <li>• Use a professional email address</li>
                          <li>• Proofread all documents</li>
                          <li>• Be specific about your achievements</li>
                          <li>• Show enthusiasm for the role</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-2">❌ Don'ts:</h4>
                        <ul className="space-y-1 text-sm text-red-700">
                          <li>• Don't apply to too many jobs at once</li>
                          <li>• Avoid generic cover letters</li>
                          <li>• Don't lie about your experience</li>
                          <li>• Avoid using unprofessional language</li>
                          <li>• Don't forget to follow application instructions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Job Offers Guide */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Handshake className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Handling Job Offers</CardTitle>
                <CardDescription>Professional strategies for responding to job offers and negotiations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="offer-response">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Responding to Job Offers</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="space-y-3">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Accepting an Offer:</h4>
                        <ul className="space-y-2 text-sm text-green-700">
                          <li>• Respond within 24-48 hours</li>
                          <li>• Express genuine enthusiasm</li>
                          <li>• Confirm start date and next steps</li>
                          <li>• Ask any remaining questions</li>
                          <li>• Thank the hiring manager</li>
                        </ul>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">Declining an Offer:</h4>
                        <ul className="space-y-2 text-sm text-yellow-700">
                          <li>• Be polite and professional</li>
                          <li>• Give a brief reason (optional)</li>
                          <li>• Express appreciation for the opportunity</li>
                          <li>• Keep the door open for future opportunities</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="negotiation">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold">Salary Negotiation</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Negotiation Tips:</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <strong className="text-purple-700">Research Market Rates:</strong>
                          <p className="text-purple-600">Know the average salary for your role and experience level.</p>
                        </div>
                        <div>
                          <strong className="text-purple-700">Consider Total Package:</strong>
                          <p className="text-purple-600">Look beyond salary - benefits, vacation time, professional development.</p>
                        </div>
                        <div>
                          <strong className="text-purple-700">Be Professional:</strong>
                          <p className="text-purple-600">Frame negotiations as discussions about mutual value creation.</p>
                        </div>
                        <div>
                          <strong className="text-purple-700">Know Your Worth:</strong>
                          <p className="text-purple-600">Be confident but reasonable in your requests.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="onboarding">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Starting Your New Job</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-800">First Week</h4>
                          <p className="text-sm text-blue-700">Focus on learning, building relationships, and understanding company culture.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Star className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-800">First Month</h4>
                          <p className="text-sm text-blue-700">Take initiative, ask questions, and start contributing to team projects.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-800">First 90 Days</h4>
                          <p className="text-sm text-blue-700">Establish yourself as a valuable team member and identify growth opportunities.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Dashboard Navigation Guide */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Using Your Dashboard</CardTitle>
                <CardDescription>Navigate and maximize the features of your user dashboard</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">Profile Management</h4>
                <p className="text-sm text-indigo-700">Keep your profile updated with current information, skills, and experience.</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">Application Tracking</h4>
                <p className="text-sm text-indigo-700">Monitor the status of all your job applications in one place.</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">Notifications</h4>
                <p className="text-sm text-indigo-700">Stay informed about new job matches, application updates, and messages.</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">Job Offers</h4>
                <p className="text-sm text-indigo-700">Review and respond to job offers from employers quickly.</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">Skill Development</h4>
                <p className="text-sm text-indigo-700">Access training resources and skill enhancement opportunities.</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">Network Building</h4>
                <p className="text-sm text-indigo-700">Connect with professionals and expand your industry network.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
