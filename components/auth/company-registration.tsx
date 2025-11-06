"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
  const {t} = useTranslation('auth')
  const { toast } = useToast()
  const [isWebsiteValid, setIsWebsiteValid] = useState(true);
  const handleProvinceChange = (province: string) => {
    onInputChange("province", province);
    onInputChange("district", "");
  };

  const validateWebsite = (url: string) => /^https?:\/\//i.test(url);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName">{t('companyName')} </Label>
          <Input
            id="companyName"
            type="text"
            placeholder={t("companyNameP")}
            value={formData.companyName}
            onChange={(e) => onInputChange("companyName", e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">{t('companyEmail')} </Label>
          <Input
            id="email"
            type="email"
            placeholder={t("companyEmailP")}
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            required
          />
        </div>

        {/* Province */}
        <div className="space-y-2">
          <Label htmlFor="province">{t('province')}</Label>
          <Select
            value={formData.province}
            onValueChange={handleProvinceChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("provinceP")} />
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
          <Label htmlFor="district">{t('district')}</Label>
          <Select
            value={formData.district}
            onValueChange={(val) => onInputChange("district", val)}
            disabled={!formData.province}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("districtP")} />
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
          <Label htmlFor="companyPhoneNumber">{t('phoneNumber')}</Label>
          <Input
            id="companyPhoneNumber"
            type="tel"
            placeholder={t("phoneNumberP")}
            value={formData.companyPhoneNumber}
            onChange={(e) => onInputChange("companyPhoneNumber", e.target.value)}
          />
        </div>

        {/* Website */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="website">{t('website')}</Label>
          <Input
            id="website"
            type="url"
            placeholder={t("websiteP")}
            value={formData.website}
            onChange={(e) => {
              const value = e.target.value;
              onInputChange("website", value);
            
              // validate website live
              setIsWebsiteValid(value === "" || validateWebsite(value));
            }}
            className={`border ${!isWebsiteValid ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 w-full`}
          />
          {!isWebsiteValid && (
            <p className="text-red-500 text-sm">Website must start with http:// or https://</p>
          )}
        </div>

        {/* Logo */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="logo">{t('logo')}</Label>
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
          <Label htmlFor="password">{t('password')}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t("password")}
            value={formData.password}
            onChange={(e) => onInputChange("password", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder={t("confirmPasswordP")}
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
