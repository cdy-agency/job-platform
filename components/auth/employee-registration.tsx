// EmployeeRegistration.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmployeeRegistrationProps {
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    phoneNumber: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const EmployeeRegistration = ({
  formData,
  onInputChange,
}: EmployeeRegistrationProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            className="bg-white text-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            className="bg-white text-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="dateOfBirth"
            className="text-sm font-medium text-gray-700"
          >
            Date of Birth (Optional)
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => onInputChange("dateOfBirth", e.target.value)}
            className="bg-white text-black"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="phoneNumber"
            className="text-sm font-medium text-gray-700"
          >
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Phone Number (Optional)"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange("phoneNumber", e.target.value)}
            className="bg-white text-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => onInputChange("password", e.target.value)}
            className="bg-white text-black"
            required
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange("confirmPassword", e.target.value)}
            required
            className="bg-white text-black"
          />
        </div>
      </div>
    </>
  );
};

export default EmployeeRegistration;
