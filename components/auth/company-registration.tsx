import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompanyRegistrationProps {
  formData: {
    companyName: string;
    email: string;
    password: string;
    confirmPassword: string;
    province: string;
    district: string;
    companyPhoneNumber: string;
    website: string;
    logo: File | null;
  };
  onInputChange: (field: string, value: string | File | null) => void;
}

export const provincesWithDistricts: Record<string, string[]> = {
  Kigali: ["Gasabo", "Kicukiro", "Nyarugenge"],
  "Eastern Province": [
    "Bugesera",
    "Gatsibo",
    "Kayonza",
    "Kirehe",
    "Ngoma",
    "Nyagatare",
    "Rwamagana",
  ],
  "Northern Province": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  "Western Province": [
    "Karongi",
    "Ngororero",
    "Nyabihu",
    "Nyamasheke",
    "Rubavu",
    "Rusizi",
    "Rutsiro",
  ],
  "Southern Province": [
    "Gisagara",
    "Huye",
    "Kamonyi",
    "Muhanga",
    "Nyamagabe",
    "Nyanza",
    "Nyaruguru",
    "Ruhango",
  ],
};

const CompanyRegistration = ({ formData, onInputChange }: CompanyRegistrationProps) => {
  const handleProvinceChange = (province: string) => {
    onInputChange("province", province);
    onInputChange("district", ""); // reset district whenever province changes
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            type="text"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={(e) => onInputChange("companyName", e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Company Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Company Email Address"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            required
          />
        </div>

        {/* Province */}
        <div className="space-y-2">
          <Label htmlFor="province">Province</Label>
          <Select
            value={formData.province}
            onValueChange={handleProvinceChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Province" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(provincesWithDistricts).map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District */}
        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Select
            value={formData.district}
            onValueChange={(val) => onInputChange("district", val)}
            disabled={!formData.province}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              {formData.province &&
                provincesWithDistricts[formData.province].map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="companyPhoneNumber">Phone Number</Label>
          <Input
            id="companyPhoneNumber"
            type="tel"
            placeholder="Company Phone Number (Optional)"
            value={formData.companyPhoneNumber}
            onChange={(e) => onInputChange("companyPhoneNumber", e.target.value)}
          />
        </div>

        {/* Website */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="Company Website (Optional)"
            value={formData.website}
            onChange={(e) => onInputChange("website", e.target.value)}
          />
        </div>

        {/* Logo */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="logo">Company Logo</Label>
          <Input
            id="logo"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              onInputChange("logo", file);
            }}
          />
        </div>
      </div>

      {/* Passwords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => onInputChange("password", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange("confirmPassword", e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
