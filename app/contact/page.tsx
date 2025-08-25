"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock,
  Send,
  User,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import NavBar from "@/components/home/NavBar";
import { Footer } from "@/components/footer";

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
      });
      
      // Reset form after showing success
      setTimeout(() => {
        setIsSubmitted(false);
        form.reset();
      }, 3000);
    }, 2000);
  }

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, name: "Facebook", url: "#", color: "hover:text-blue-600" },
    { icon: <Twitter className="h-5 w-5" />, name: "Twitter", url: "#", color: "hover:text-blue-400" },
    { icon: <Linkedin className="h-5 w-5" />, name: "LinkedIn", url: "#", color: "hover:text-blue-700" },
    { icon: <Instagram className="h-5 w-5" />, name: "Instagram", url: "#", color: "hover:text-pink-500" }
  ];

  const faqItems = [
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking the \"Sign up\" button in the top right corner of the page. You'll be asked to choose between a job seeker or company account."
    },
    {
      question: "Is it free to post jobs?",
      answer: "We offer both free and premium job posting options. Basic job listings are free, while premium listings offer enhanced visibility and additional features."
    },
    {
      question: "How can I update my profile?",
      answer: "Once logged in, you can update your profile by navigating to the settings page in your dashboard. There you can edit your personal information, resume, and preferences."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <NavBar />

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-8 py-16 text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions or feedback? We'd love to hear from you. Our team is here to help you with anything you need.
          </p>
        </div>
      </div>

      {/* Main Content with Consistent Padding */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
            </div>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for reaching out. We'll get back to you soon.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                          Full Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                              <User className="h-5 w-5" />
                            </div>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                              autoComplete="name"
                              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                          Email Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                              <Mail className="h-5 w-5" />
                            </div>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              {...field}
                              autoComplete="email"
                              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  {/* Subject Field */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                          Subject <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                              <MessageCircle className="h-5 w-5" />
                            </div>
                            <Input
                              placeholder="What is this regarding?"
                              {...field}
                              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  {/* Message Field */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                          Message <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us how we can help you..."
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none min-h-[120px] text-black"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#834de3] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-purple-400"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>

          {/* Enhanced Contact Information */}
          <div className="space-y-8">
            {/* Social Media Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                Follow Us
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 ${social.color} transition-all duration-200 hover:scale-110 hover:shadow-lg`}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about our platform and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
