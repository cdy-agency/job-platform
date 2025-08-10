import { Briefcase, CheckCircle, Search, ArrowRight } from 'lucide-react'
import React from 'react'

const HowItsWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Search Jobs",
      description: "Browse thousands of opportunities across various industries and locations.",
      step: "01"
    },
    {
      icon: CheckCircle,
      title: "Apply with Ease",
      description: "Create your profile once and apply to multiple positions with just a few clicks.",
      step: "02"
    },
    {
      icon: Briefcase,
      title: "Land Your Dream Job",
      description: "Connect directly with employers and start your new career journey.",
      step: "03"
    }
  ]

  return (
    <section className="bg-white py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#834de3]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#8d6ee9]/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Three simple steps to connect with your next opportunity
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden md:block absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="flex justify-between items-center">
              <div className="w-5 h-5"></div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#834de3] to-[#8d6ee9] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#834de3] to-[#8d6ee9] animate-pulse"></div>
              </div>
              <div className="w-5 h-5"></div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#834de3] to-[#8d6ee9] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#834de3] to-[#8d6ee9] animate-pulse"></div>
              </div>
              <div className="w-5 h-5"></div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div 
                  key={index}
                  className="group relative"
                >
                  {/* Mobile Arrow */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center mt-8 mb-4">
                      <ArrowRight className="h-6 w-6 text-[#834de3] animate-pulse" />
                    </div>
                  )}

                  <div className="flex flex-col items-center text-center relative">
                    {/* Step Number */}
                    <div className="absolute -top-3 right-0 w-8 h-8 bg-[#834de3] text-white text-sm font-bold rounded-full flex items-center justify-center z-10">
                      {step.step}
                    </div>

                    {/* Icon Container */}
                    <div className="relative mb-6 group-hover:scale-110 transition-transform duration-300">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#834de3] to-[#8d6ee9] shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#834de3] to-[#8d6ee9] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <h3 className="mb-3 text-2xl font-bold text-gray-900 group-hover:text-[#834de3] transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed max-w-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItsWorks