"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import NavBar from "@/components/home/NavBar"

export default function TermsAndConditionsPage() {
  return (
    <div className="relative min-h-screen w-full text-black">
      <NavBar />
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/terms-conditions.jpeg"
          alt="Terms and Conditions background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="py-12 px-4 md:px-20 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-7xl w-full">
          <h1 className="text-7xl font-bold text-purple-400 mb-6 text-center">
            KaziLink Terms & Conditions
          </h1>

          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-100">
            <CardContent className="p-6 md:p-10">
              <ScrollArea className="h-[70vh] pr-4">
                {/* Introduction */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-purple-700 mb-3">
                    Welcome to KaziLink
                  </h2>
                  <p className="text-gray-800">
                    KaziLink is a digital platform designed to connect workers, employers,
                    and housekeepers in Rwanda. By using our website or mobile app, you
                    agree to comply with these Terms and Conditions.
                  </p>
                </section>

                <Separator className="my-4" />

                {/* Terms Sections */}
                {[
                  {
                    title: "1. Definitions",
                    text: `“Platform” refers to the KaziLink website and related applications.
                    “User” means any person using KaziLink, including workers, employers, and recruiters.
                    “Services” include job posting, worker–employer connection, messaging, payment, and training access.`,
                  },
                  {
                    title: "2. Acceptance of Terms",
                    text: `By accessing KaziLink, you confirm that you are at least 18 years old
                    and have read and agreed to these Terms.`,
                  },
                  {
                    title: "3. Account Registration",
                    text: `Users must create an account to access most services and maintain accurate, confidential information.`,
                  },
                  {
                    title: "4. Use of the Platform",
                    text: `Users must act lawfully, avoid false information, impersonation, and disruption.`,
                  },
                  {
                    title: "5. Job Posting & Worker Connection",
                    text: `KaziLink facilitates connections but is not a direct employer. All employment terms are handled between parties.`,
                  },
                  {
                    title: "6. Payments & Fees",
                    text: `Payments are processed securely through the platform. KaziLink is not responsible for salary disputes.`,
                  },
                  {
                    title: "7. Data Protection & Privacy",
                    text: `User data is handled in line with Rwanda’s data protection laws and is never shared without consent.`,
                  },
                  {
                    title: "8. Limitation of Liability",
                    text: `KaziLink provides services “as is” and is not liable for disputes, technical issues, or losses.`,
                  },
                  {
                    title: "9. Amendments",
                    text: `We may update these Terms at any time, effective upon publication.`,
                  },
                  {
                    title: "10. Contact",
                    text: `For inquiries or support, please reach out through the KaziLink platform.`,
                  },
                ].map((section, index) => (
                  <section key={index} className="mb-6">
                    <h3 className="text-lg font-semibold text-purple-700 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-800 leading-relaxed">{section.text}</p>
                  </section>
                ))}

                <Separator className="my-6" />

                {/* Agreement */}
                <section>
                  <h3 className="text-xl font-semibold text-purple-700 mb-3">
                    User Agreement
                  </h3>
                  <p className="text-gray-800 mb-4">
                    By creating an account or using KaziLink, you confirm that you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-800">
                    <li>Are at least 18 years old.</li>
                    <li>Use the platform lawfully for employment purposes.</li>
                    <li>Provide accurate and truthful information.</li>
                    <li>Understand KaziLink only connects users and does not employ directly.</li>
                    <li>Allow lawful processing of your data under Rwandan law.</li>
                  </ul>
                </section>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
