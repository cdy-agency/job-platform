"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Building2, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  TrendingUp,
  Target,
  Shield,
  Zap,
  Award,
  MessageSquare,
  Calendar,
  Star,
  Briefcase,
  UserCheck,
  Search,
  Filter,
  Send,
  Eye,
  ThumbsUp,
  Handshake
} from "lucide-react"

export default function CompanyGuidelines() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Company Guidelines & Training</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Master the art of hiring and talent acquisition with our comprehensive training guide. 
          Learn how to post jobs effectively, evaluate candidates, and build your dream team.
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Job Posting</CardTitle>
            <CardDescription>Create compelling job posts that attract top talent</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">Candidate Evaluation</CardTitle>
            <CardDescription>Screen and evaluate candidates effectively</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-xl">Admin Approval Process</CardTitle>
            <CardDescription>Understand the approval workflow and requirements</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Job Posting Guide */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Creating Effective Job Posts</CardTitle>
                <CardDescription>Learn how to write job descriptions that attract the right candidates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="job-structure">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Job Post Structure & Best Practices</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Essential Job Post Sections:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Job Title:</strong> Clear, specific, and industry-standard</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Company Overview:</strong> Brief description of your company and culture</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Role Description:</strong> Detailed responsibilities and expectations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Requirements:</strong> Essential skills, experience, and qualifications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Benefits:</strong> Salary range, perks, and growth opportunities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Application Process:</strong> Clear instructions on how to apply</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">Writing Tips:</h4>
                          <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                            <li>• Use inclusive language to attract diverse candidates</li>
                            <li>• Be specific about required vs. preferred qualifications</li>
                            <li>• Highlight your company's unique culture and values</li>
                            <li>• Include growth opportunities and career development</li>
                            <li>• Keep the tone professional but approachable</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="attracting-talent">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold">Attracting Top Talent</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">Compelling Company Description:</h4>
                        <p className="text-sm text-purple-700">
                          "We're a fast-growing tech startup that values innovation and work-life balance. 
                          Join our team of passionate professionals who are building the future of digital solutions."
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Highlight Growth Opportunities:</h4>
                        <p className="text-sm text-green-700">
                          "Opportunities for professional development, mentorship programs, and rapid career advancement 
                          in a supportive environment."
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="posting-optimization">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Job Post Optimization</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">SEO & Visibility Tips:</h4>
                      <ul className="space-y-2 text-sm text-green-700">
                        <li>• Use relevant keywords in job title and description</li>
                        <li>• Include location and remote work options clearly</li>
                        <li>• Set appropriate salary ranges to attract qualified candidates</li>
                        <li>• Post during peak hours (Tuesday-Thursday, 10 AM - 2 PM)</li>
                        <li>• Use engaging visuals and company branding</li>
                        <li>• Regularly update and refresh job postings</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Candidate Evaluation Guide */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Candidate Evaluation & Hiring</CardTitle>
                <CardDescription>Effective strategies for screening, interviewing, and selecting the best candidates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="screening-process">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Candidate Screening Process</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                        <div>
                          <h4 className="font-semibold text-green-800">Initial CV Review</h4>
                          <p className="text-sm text-green-700">Screen CVs for essential qualifications, experience, and skills match.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                        <div>
                          <h4 className="font-semibold text-green-800">Phone/Video Screening</h4>
                          <p className="text-sm text-green-700">Conduct initial interviews to assess communication skills and basic fit.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                        <div>
                          <h4 className="font-semibold text-green-800">Technical Assessment</h4>
                          <p className="text-sm text-green-700">Evaluate technical skills through tests, assignments, or portfolio reviews.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                        <div>
                          <h4 className="font-semibold text-green-800">Final Interview</h4>
                          <p className="text-sm text-green-700">Meet with key stakeholders and assess cultural fit and long-term potential.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="interview-tips">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Interview Best Practices</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Effective Interview Questions:</h4>
                        <ul className="space-y-2 text-sm text-blue-700">
                          <li>• "Tell me about a challenging project you worked on"</li>
                          <li>• "How do you handle tight deadlines?"</li>
                          <li>• "What motivates you in your work?"</li>
                          <li>• "Describe a time you had to learn something new quickly"</li>
                          <li>• "What are your long-term career goals?"</li>
                        </ul>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">Assessment Criteria:</h4>
                        <ul className="space-y-2 text-sm text-purple-700">
                          <li>• Technical competency (40%)</li>
                          <li>• Cultural fit (30%)</li>
                          <li>• Communication skills (20%)</li>
                          <li>• Growth potential (10%)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="decision-making">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold">Making the Final Decision</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Decision Framework:</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <strong className="text-purple-700">Skills Assessment:</strong>
                          <p className="text-purple-600">Does the candidate have the required technical skills and experience?</p>
                        </div>
                        <div>
                          <strong className="text-purple-700">Cultural Fit:</strong>
                          <p className="text-purple-600">Will they thrive in your company culture and work well with the team?</p>
                        </div>
                        <div>
                          <strong className="text-purple-700">Growth Potential:</strong>
                          <p className="text-purple-600">Can they grow with the role and contribute to long-term success?</p>
                        </div>
                        <div>
                          <strong className="text-purple-700">Availability & Commitment:</strong>
                          <p className="text-purple-600">Are they available when you need them and committed to the role?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Admin Approval Process */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Admin Approval Process</CardTitle>
                <CardDescription>Understanding the platform's approval workflow and compliance requirements</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="approval-workflow">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold">Approval Workflow & Timeline</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                        <div>
                          <h4 className="font-semibold text-purple-800">Job Post Submission</h4>
                          <p className="text-sm text-purple-700">Submit your job post with all required information and documentation.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                        <div>
                          <h4 className="font-semibold text-purple-800">Admin Review (1-3 days)</h4>
                          <p className="text-sm text-purple-700">Administrators review your job post for compliance, quality, and completeness.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                        <div>
                          <h4 className="font-semibold text-purple-800">Approval or Feedback</h4>
                          <p className="text-sm text-purple-700">Receive approval notification or feedback for required changes.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                        <div>
                          <h4 className="font-semibold text-purple-800">Job Goes Live</h4>
                          <p className="text-sm text-purple-700">Once approved, your job post becomes visible to job seekers.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="compliance-requirements">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Compliance Requirements</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Required Information:</h4>
                      <ul className="space-y-2 text-sm text-green-700">
                        <li>• Valid business registration and tax documents</li>
                        <li>• Complete company profile with verified contact information</li>
                        <li>• Accurate job description with clear requirements</li>
                        <li>• Competitive salary range or compensation details</li>
                        <li>• Equal opportunity employer statement</li>
                        <li>• Clear application process and requirements</li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">Common Rejection Reasons:</h4>
                          <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                            <li>• Incomplete company information</li>
                            <li>• Unrealistic requirements or discriminatory language</li>
                            <li>• Missing salary information or extremely low pay</li>
                            <li>• Vague job descriptions or unclear responsibilities</li>
                            <li>• Unprofessional or inappropriate content</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="quality-standards">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Quality Standards & Best Practices</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">✅ High-Quality Job Posts:</h4>
                        <ul className="space-y-1 text-sm text-blue-700">
                          <li>• Detailed, specific job descriptions</li>
                          <li>• Clear requirements and qualifications</li>
                          <li>• Competitive compensation packages</li>
                          <li>• Professional company presentation</li>
                          <li>• Inclusive and diverse language</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-2">❌ Avoid These Issues:</h4>
                        <ul className="space-y-1 text-sm text-red-700">
                          <li>• Generic, copy-paste job descriptions</li>
                          <li>• Unrealistic or excessive requirements</li>
                          <li>• Discriminatory language or bias</li>
                          <li>• Unprofessional tone or presentation</li>
                          <li>• Missing or incomplete information</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Job Offers & Negotiations */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Handshake className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Job Offers & Candidate Management</CardTitle>
                <CardDescription>Professional strategies for extending offers and managing the hiring process</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="extending-offers">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Send className="h-5 w-5 text-indigo-600" />
                    <span className="font-semibold">Extending Job Offers</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-800 mb-2">Offer Letter Components:</h4>
                      <ul className="space-y-2 text-sm text-indigo-700">
                        <li>• Position title and reporting structure</li>
                        <li>• Start date and work schedule</li>
                        <li>• Compensation details (salary, bonuses, benefits)</li>
                        <li>• Job responsibilities and expectations</li>
                        <li>• Company policies and procedures</li>
                        <li>• Acceptance deadline and next steps</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="negotiation-handling">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Handling Negotiations</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Negotiation Best Practices:</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <strong className="text-green-700">Be Prepared:</strong>
                          <p className="text-green-600">Have a clear budget range and flexibility options ready.</p>
                        </div>
                        <div>
                          <strong className="text-green-700">Listen Actively:</strong>
                          <p className="text-green-600">Understand what the candidate values most (salary, benefits, flexibility).</p>
                        </div>
                        <div>
                          <strong className="text-green-700">Be Transparent:</strong>
                          <p className="text-green-600">Explain your constraints and explore creative solutions.</p>
                        </div>
                        <div>
                          <strong className="text-green-700">Document Everything:</strong>
                          <p className="text-green-600">Keep clear records of all negotiation discussions and agreements.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="onboarding-process">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">New Employee Onboarding</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-8">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-800">Pre-boarding (Before Start Date)</h4>
                          <p className="text-sm text-blue-700">Send welcome materials, complete paperwork, and prepare workspace.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Star className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-800">First Day</h4>
                          <p className="text-sm text-blue-700">Company tour, introductions, policy review, and initial training.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-800">First Week</h4>
                          <p className="text-sm text-blue-700">Role-specific training, mentor assignment, and goal setting.</p>
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
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Using Your Company Dashboard</CardTitle>
                <CardDescription>Navigate and maximize the features of your company dashboard</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Profile Management</h4>
                <p className="text-sm text-gray-700">Keep your company profile updated with current information and branding.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Job Posting</h4>
                <p className="text-sm text-gray-700">Create, edit, and manage your job postings efficiently.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Applicant Management</h4>
                <p className="text-sm text-gray-700">Review, screen, and communicate with job applicants.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Employee Tracking</h4>
                <p className="text-sm text-gray-700">Manage your hired employees and track their progress.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Notifications</h4>
                <p className="text-sm text-gray-700">Stay updated on new applications, approvals, and system updates.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Analytics</h4>
                <p className="text-sm text-gray-700">Track job post performance and hiring success metrics.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
