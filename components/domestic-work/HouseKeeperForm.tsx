import { useState } from 'react';
import { api, getErrorMessage } from "@/lib/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';

export default function HousekeeperRegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: "", dateOfBirth: "", gender: "", idNumber: "", phoneNumber: "",
    province: "", district: "", sector: "", cell: "", village: "",
    amountOfMoney: "", language: "",workType: "" ,vocationDays:"",married:"",numberChildren:"", willingToWorkWithChildren: "",
    hasParents: "", fatherName: "", fatherPhone: "", motherName: "", motherPhone: "",
    hasStudied: "", educationLevel: "", church: "",
    passportImageName: "", fullBodyImageName: "", idImageName: ""
  });

  const [passportImage, setPassportImage] = useState<File | null>(null);
  const [fullBodyImage, setFullBodyImage] = useState<File | null>(null);
  const [idImage, setIdImage] = useState<File | null>(null)

  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const [fullBodyPreview, setFullBodyPreview] = useState<string | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('houseKeeper')

  // @ts-expect-error error
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: any, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      if (fieldName === "passportImageName") {
        setPassportImage(file);
        setPassportPreview(preview);
        setFormData(prev => ({ ...prev, passportImageName: file.name }));
      } else if (fieldName === "fullBodyImageName") {
        setFullBodyImage(file);
        setFullBodyPreview(preview);
        setFormData(prev => ({ ...prev, fullBodyImageName: file.name }));
      } else if (fieldName === "idImageName") {
        setIdImage(file);
        setIdPreview(preview);
        setFormData(prev => ({ ...prev, idImageName: file.name }));
      }
    }
  };

 const handleSubmit = async () => {
  try {
    setIsLoading(true);

    if (
      !formData.fullName ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.idNumber ||
      !formData.phoneNumber
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const formDataToSend = new FormData();

    // Basic info
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("dateOfBirth", formData.dateOfBirth);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("idNumber", formData.idNumber);
    formDataToSend.append("phoneNumber", formData.phoneNumber);

    // Location
    const location = {
      province: formData.province,
      district: formData.district,
      sector: formData.sector,
      cell: formData.cell,
      village: formData.village,
    };
    formDataToSend.append("location", JSON.stringify(location));

    // Background
    const background = {
      hasParents: formData.hasParents,
      fatherName: formData.fatherName,
      fatherPhone: formData.fatherPhone,
      motherName: formData.motherName,
      motherPhone: formData.motherPhone,
      hasStudied: formData.hasStudied,
      educationLevel: formData.educationLevel,
      church: formData.church,
    };
    formDataToSend.append("background", JSON.stringify(background));

    // Work Preferences
    const workPreferences = {
      language: formData.language,
      amountOfMoney: formData.amountOfMoney,
      workType: formData.workType,
      vocationDays: formData.vocationDays,
      married: formData.married,
      numberChildren: formData.numberChildren,
      willingToWorkWithChildren: formData.willingToWorkWithChildren === "yes",
    };
    formDataToSend.append("workPreferences", JSON.stringify(workPreferences));

    // Images
    if (passportImage)
      formDataToSend.append("images", passportImage, `passport-${passportImage.name}`);
    if (fullBodyImage)
      formDataToSend.append("images", fullBodyImage, `fullbody-${fullBodyImage.name}`);
    if (idImage)
      formDataToSend.append("images", idImage, `id-${idImage.name}`);

    // Submit
    const response = await api.post("/housekeepers", formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.housekeeper) {
      toast({
        title: "Registration Successful!",
        description: "Your housekeeper profile has been created successfully.",
      });

      setFormData({
        fullName: "", dateOfBirth: "", gender: "", idNumber: "", phoneNumber: "",
        province: "", district: "", sector: "", cell: "", village: "",
        hasParents: "", fatherName: "", fatherPhone: "", motherName: "", motherPhone: "",
        hasStudied: "", educationLevel: "", church: "",
        language: "", amountOfMoney: "", workType: "", vocationDays: "", married: "",
        numberChildren: "", willingToWorkWithChildren: "",
        passportImageName: "", fullBodyImageName: "", idImageName: ""
      });
      setPassportPreview(null);
      setFullBodyPreview(null);
      setIdPreview(null);
      setStep(1);
    }

    console.log("✅ Data sent to backend:", response.data);
  } catch (error) {
    console.error("❌ Registration error:", error);
    toast({
      title: "Registration Failed",
      description: getErrorMessage(error),
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-0 md:px-4">
      <div className="md:max-w-4xl max-w-full mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('title')}</h1>
          <p className="text-gray-600">{t('description')}</p>
        </div>

        <div className="flex justify-center items-center mb-10 space-x-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step === 1 ? 'bg-[#834de3] text-white' : step > 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className="ml-2 font-medium text-gray-700 hidden sm:inline">{t('steps.1')}</span>
          </div>
          <div className="w-12 sm:w-16 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step === 2 ? 'bg-[#834de3] text-white' : step > 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > 2 ? '✓' : '2'}
            </div>
            <span className="ml-2 font-medium text-gray-700 hidden sm:inline">{t('steps.2')}</span>
          </div>
          <div className="w-12 sm:w-16 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step === 3 ? 'bg-[#834de3] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <span className="ml-2 font-medium text-gray-700 hidden sm:inline">{t('steps.3')}</span>
          </div>
        </div>

        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('steps.1')}</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('personalInfo.fullName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t("personalInfo.fullNamePlaceholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("personalInfo.dateOfBirth")}<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("personalInfo.gender")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
                  >
                    <option value="">Select gender</option>
                    <option value="male">{t("personalInfo.genderOptions.male")}</option>
                    <option value="female">{t("personalInfo.genderOptions.female")}</option>
                    <option value="other">{t("personalInfo.genderOptions.other")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("personalInfo.idNumber")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    placeholder={t("personalInfo.idNumberPlaceholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("personalInfo.phoneNumber")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder={t("personalInfo.phoneNumberPlaceholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Current Location</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("personalInfo.province")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
                  >
                    <option value="">Select province</option>
                    <option value="kigali">{t("personalInfo.provinceOptions.kigali")}</option>
                    <option value="eastern">{t("personalInfo.provinceOptions.eastern")}</option>
                    <option value="western">{t("personalInfo.provinceOptions.western")}</option>
                    <option value="northern">{t("personalInfo.provinceOptions.northern")}</option>
                    <option value="southern">{t("personalInfo.provinceOptions.southern")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("personalInfo.district")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder={t("personalInfo.districtPlaceholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("personalInfo.sector")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    placeholder={t("personalInfo.sectorPlaceholder")} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("personalInfo.cell")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cell"
                    value={formData.cell}
                    onChange={handleInputChange}
                    placeholder={t("personalInfo.cellPlaceholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("personalInfo.village")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    placeholder={t("personalInfo.villagePlaceholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">{t("personalInfo.uploadPhotos")}</h3>
              
               {/* --- Upload Section --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          {/* Passport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("personalInfo.passportPhoto")} <span className="text-red-500">*</span>
            </label>
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-lg w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#834de3] transition"
              style={{
                backgroundImage: passportPreview ? `url(${passportPreview})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!passportPreview && (
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-1">📷</div>
                  <p className="text-xs">Click to upload</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                id="passport-upload"
                onChange={(e) => handleFileChange(e, "passportImageName")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Full Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("personalInfo.fullBodyPhoto")} <span className="text-red-500">*</span>
            </label>
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-lg w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#834de3] transition"
              style={{
                backgroundImage: fullBodyPreview ? `url(${fullBodyPreview})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!fullBodyPreview && (
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-1">📷</div>
                  <p className="text-xs">Click to upload</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                id="fullbody-upload"
                onChange={(e) => handleFileChange(e, "fullBodyImageName")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* ID Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("personalInfo.idImage")} <span className="text-red-500">*</span>
            </label>
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-lg w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#834de3] transition"
              style={{
                backgroundImage: idPreview ? `url(${idPreview})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!idPreview && (
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-1">📷</div>
                  <p className="text-xs">Click to upload</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                id="id-upload"
                onChange={(e) => handleFileChange(e, "idImageName")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={isLoading}
                  className="px-8 py-3 bg-[#834de3] text-white font-semibold rounded-lg hover:bg-[#7043c7] transition flex items-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t('buttons.loading'): t('buttons.next')}
                  {!isLoading && <span className="ml-2">→</span>}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('steps.2')}</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('backgroundInfo.hasParents')} <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="hasParents"
                      value="yes"
                      checked={formData.hasParents === 'yes'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-[#834de3] focus:ring-[#834de3] cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700">{t('backgroundInfo.yes')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="hasParents"
                      value="no"
                      checked={formData.hasParents === 'no'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-[#834de3] focus:ring-[#834de3] cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700">{t('backgroundInfo.no')}</span>
                  </label>
                </div>
              </div>

              {formData.hasParents === 'yes' && (
                <div className="space-y-6 bg-purple-50 p-6 rounded-lg border border-purple-100">
                  <h3 className="text-lg font-medium text-gray-800">{t('backgroundInfo.parentInformation')}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('backgroundInfo.fatherName')}
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        placeholder={t('backgroundInfo.fatherName')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('backgroundInfo.fatherPhone')}
                      </label>
                      <input
                        type="tel"
                        name="fatherPhone"
                        value={formData.fatherPhone}
                        onChange={handleInputChange}
                        placeholder={t('backgroundInfo.fatherPhone')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('backgroundInfo.motherName')}
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleInputChange}
                        placeholder={t('backgroundInfo.motherName')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('backgroundInfo.motherPhone')}
                      </label>
                      <input
                        type="tel"
                        name="motherPhone"
                        value={formData.motherPhone}
                        onChange={handleInputChange}
                        placeholder={t('backgroundInfo.motherPhone')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('backgroundInfo.hasStudied')} <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="hasStudied"
                      value="yes"
                      checked={formData.hasStudied === 'yes'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-[#834de3] focus:ring-[#834de3] cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700">{t('backgroundInfo.yes')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="hasStudied"
                      value="no"
                      checked={formData.hasStudied === 'no'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-[#834de3] focus:ring-[#834de3] cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700">{t('backgroundInfo.no')}</span>
                  </label>
                </div>
              </div>

              {formData.hasStudied === 'yes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('backgroundInfo.educationLevel')}
                  </label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
                  >
                    <option value="">{t('backgroundInfo.educationLevel')}</option>
                    <option value="primary">{t('backgroundInfo.educationOptions.primary')}</option>
                    <option value="secondary">{t('backgroundInfo.educationOptions.secondary')}</option>
                    <option value="alevel">{t('backgroundInfo.educationOptions.alevel')}</option>
                    <option value="vocational">{t('backgroundInfo.educationOptions.vocational')}</option>
                    <option value="university">{t('backgroundInfo.educationOptions.university')}</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('backgroundInfo.church')} <span className="text-red-500">*</span>
                </label>
                <select
                  name="church"
                  value={formData.church}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
                >
                  <option value="">Select your church/religion</option>
                  <option value="catholic">{t('backgroundInfo.churchOptions.catholic')}</option>
                  <option value="adventist">{t('backgroundInfo.churchOptions.adventist')}</option>
                  <option value="protestant">{t('backgroundInfo.churchOptions.protestant')}</option>
                  <option value="anglican">{t('backgroundInfo.churchOptions.anglican')}</option>
                  <option value="pentecostal">{t('backgroundInfo.churchOptions.pentecostal')}</option>
                  <option value="baptist">{t('backgroundInfo.churchOptions.baptist')}</option>
                  <option value="muslim">{t('backgroundInfo.churchOptions.muslim')}</option>
                  <option value="other">{t('backgroundInfo.churchOptions.other')}</option>
                </select>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="px-8 py-3 border-2 border-[#834de3] text-[#834de3] font-semibold rounded-lg hover:bg-[#834de3] hover:text-white transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="mr-2">←</span>
                  {t('buttons.back')}
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={isLoading}
                  className="px-8 py-3 bg-[#834de3] text-white font-semibold rounded-lg hover:bg-[#7043c7] transition flex items-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t('buttons.loading') : t('buttons.next')}
                  {!isLoading && <span className="ml-2">→</span>}
                </button>
              </div>
            </div>
          )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('steps.3')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('workPreferences.language')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  placeholder={t('workPreferences.languagePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
                />
            </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('workPreferences.amountOfMoney')} <span className="text-red-500">*</span>
        </label>
        <select
          name="amountOfMoney"
          value={formData.amountOfMoney}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
        >
          <option value="">{t('workPreferences.amountOptions')}</option>
          <option value="0-50">0 - 50,000</option>
          <option value="50-100">50,000 - 100,000</option>
          <option value="100-150+">100,000 - 150,000+</option>
        </select>
      </div>
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('workPreferences.workType')} <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-6">
          {[t("workPreferences.workTypeOptions.live-in"), t("workPreferences.workTypeOptions.live-out"), t("workPreferences.workTypeOptions.all")].map((type) => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="workType"
                value={type}
                checked={formData.workType === type}
                onChange={handleInputChange}
                className="w-5 h-5 text-[#834de3] focus:ring-[#834de3] cursor-pointer"
              />
              <span className="ml-2 text-gray-700">
                {type === "all" ? "Either" : type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {t('workPreferences.married')} <span className="text-red-500">*</span>
      </label>
      <div className="flex space-x-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="married"
            value="yes"
            checked={formData.married === "yes"}
            onChange={handleInputChange}
            className="w-5 h-5 text-[#834de3] focus:ring-[#834de3] cursor-pointer"
          />
          <span className="ml-2 text-gray-700">{t('backgroundInfo.yes')}</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="married"
            value="no"
            checked={formData.married === "no"}
            onChange={handleInputChange}
            className="w-5 h-5 text-[#834de3] focus:ring-[#834de3] cursor-pointer"
          />
          <span className="ml-2 text-gray-700">{t('backgroundInfo.no')}</span>
        </label>
      </div>
    </div>

    {formData.married === "yes" && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('workPreferences.numberChildren')}
        </label>
        <input
          type="number"
          name="numberChildren"
          value={formData.numberChildren}
          onChange={handleInputChange}
          placeholder={t('workPreferences.numberChildren')}
          min="0"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
        />
      </div>
    )}

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
         {t('workPreferences.willingToWorkWithChildren')} <span className="text-red-500">*</span>
      </label>
      <div className="flex space-x-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="willingToWorkWithChildren"
            value="yes"
            checked={formData.willingToWorkWithChildren === "yes"}
            onChange={handleInputChange}
            className="w-5 h-5 text-[#834de3] focus:ring-[#834de3] cursor-pointer"
          />
          <span className="ml-2 text-gray-700">{t('backgroundInfo.yes')}</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="willingToWorkWithChildren"
            value="no"
            checked={formData.willingToWorkWithChildren === "no"}
            onChange={handleInputChange}
            className="w-5 h-5 text-[#834de3] focus:ring-[#834de3] cursor-pointer"
          />
          <span className="ml-2 text-gray-700">{t('backgroundInfo.no')}</span>
        </label>
      </div>
    </div>

    {/* Vocation Days */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('workPreferences.vocationDays')} <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="vocationDays"
        value={formData.vocationDays}
        onChange={handleInputChange}
        placeholder="Enter vocation days (e.g., Mon-Fri)"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#834de3] focus:border-transparent outline-none transition"
      />
    </div>

    <div className="flex justify-between mt-8">
      <button
        onClick={() => setStep(2)}
        disabled={isLoading}
        className="px-8 py-3 border-2 border-[#834de3] text-[#834de3] font-semibold rounded-lg hover:bg-[#834de3] hover:text-white transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="mr-2">←</span>
        {t('buttons.back')} 
      </button>
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="px-8 py-3 bg-[#834de3] text-white font-semibold rounded-lg hover:bg-[#7043c7] transition flex items-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? t('buttons.submitting') : t('buttons.submit')}
        {!isLoading && <span className="ml-2">→</span>}
      </button>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}