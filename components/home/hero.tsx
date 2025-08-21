import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/worker.png"
          alt="Professional workers collaborating"
          className="w-full h-full object-cover blur-0"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#bdb0d8]/70 via-[#645398]/60 to-[#834de3]/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          {/* Left Content */}
          <div className="text-white">
            {/* Main Heading */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              The fastest way to find trusted work and talent in Rwanda
            </h1>

            {/* Subtitle */}
            <p className="mb-8 text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
              Akazi-Link connects companies with reliable workers across Rwanda. Post jobs in minutes, apply with a click.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button 
                  size="lg"
                  className="bg-[#834de3] text-white font-semibold hover:bg-[#9260e7] px-8 py-3 rounded shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#834de3] font-semibold px-8 py-3 rounded backdrop-blur-sm bg-white/10 transition-all duration-200"
                >
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default Hero