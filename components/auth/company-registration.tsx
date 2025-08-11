import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyRegistrationProps {
  formData: {
    companyName: string;
    email: string;
    password: string;
    confirmPassword: string;
    location: string;
    companyPhoneNumber: string;
    website: string;
    logo: File | null;
  };
  onInputChange: (field: string, value: string | File | null) => void;
}

const CompanyRegistration = ({ formData, onInputChange }: CompanyRegistrationProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
            Company Name
          </Label>
          <Input
            id="companyName"
            type="text"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={(e) => onInputChange("companyName", e.target.value)}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
            required
          />
        </div>
        {/* Repeat similar for other fields */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Company Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Company Email Address"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-gray-700">
            Location
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="Company Location (Optional)"
            value={formData.location}
            onChange={(e) => onInputChange("location", e.target.value)}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyPhoneNumber" className="text-sm font-medium text-gray-700">
            Phone Number
          </Label>
          <Input
            id="companyPhoneNumber"
            type="tel"
            placeholder="Company Phone Number (Optional)"
            value={formData.companyPhoneNumber}
            onChange={(e) => onInputChange("companyPhoneNumber", e.target.value)}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="website" className="text-sm font-medium text-gray-700">
            Website
          </Label>
          <Input
            id="website"
            type="url"
            placeholder="Company Website (Optional)"
            value={formData.website}
            onChange={(e) => onInputChange("website", e.target.value)}
            className="h-12 px-4 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="logo" className="text-sm font-medium text-gray-700">
            Company Logo (Optional)
          </Label>
          <Input
            id="logo"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              onInputChange("logo", file);
            }}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 bg-white text-black"
          />
        </div>
      </div>
      {/* Password Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => onInputChange("password", e.target.value)}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange("confirmPassword", e.target.value)}
            className="h-12 px-4 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-black"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
