// pages/auth/register.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { PasswordInput } from './ui/password-input';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { FileInput } from './ui/file-input';
import { RegisterFormData } from '@/types/types';
import { toast } from "@/components/ui/use-toast"

const CompanyRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    companyName: '',
    location: '',
    phoneNumber: '',
    website: '',
    logo: undefined,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [logoFiles, setLogoFiles] = useState<File[]>([]);
  const router = useRouter();

  const roleOptions = [
    { value: 'employee', label: 'Job Seeker / Employee' },
    { value: 'company', label: 'Company / Employer' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    // Basic validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Company-specific validation
    if (formData.role === 'company') {
      if (!formData.companyName) {
        newErrors.companyName = 'Company name is required';
      }
      if (!formData.location) {
        newErrors.location = 'Location is required';
      }
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      }
      if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
        newErrors.website = 'Please enter a valid website URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as 'employee' | 'company';
    setFormData(prev => ({
      ...prev,
      role: newRole,
      // Reset company-specific fields when switching to employee
      ...(newRole === 'employee' && {
        companyName: '',
        location: '',
        phoneNumber: '',
        website: '',
        logo: undefined,
      })
    }));
    
    // Clear company-related errors when switching to employee
    if (newRole === 'employee') {
      const { companyName, location, phoneNumber, website, ...restErrors } = errors;
      setErrors(restErrors);
    }
  };

  const handleLogoChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setLogoFiles([file]);
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
    }
  };

  const handleRemoveLogo = () => {
    setLogoFiles([]);
    setFormData(prev => ({
      ...prev,
      logo: undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Replace with actual API call
      console.log('Registration data:', formData);
      
      // Show success message and redirect
      toast({
        title: 'Registration successful!',
        description: 'Please check your email to verify your account.',
      });
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ email: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join our platform today
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md lg:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
            // @ts-expect-error error
              label="I want to register as"
              value={formData.role}
              onChange={handleRoleChange}
              options={roleOptions}
              required
            />

            <Input
              label="Email address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput
                label="Password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                required
              />
            </div>

            {/* Company-specific fields */}
            {formData.role === 'company' && (
              <div className="space-y-6 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
                
                <Input
                  label="Company Name"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={handleInputChange('companyName')}
                  error={errors.companyName}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={handleInputChange('location')}
                    error={errors.location}
                    required
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={handleInputChange('phoneNumber')}
                    error={errors.phoneNumber}
                    required
                  />
                </div>

                <Input
                  label="Website"
                  type="url"
                  placeholder="https://www.company.com"
                  value={formData.website}
                  onChange={handleInputChange('website')}
                  error={errors.website}
                  helperText="Optional: Your company website"
                />

                <FileInput
                  label="Company Logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  selectedFiles={logoFiles}
                  onRemoveFile={handleRemoveLogo}
                  helperText="Upload your company logo (optional)"
                />
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationForm;