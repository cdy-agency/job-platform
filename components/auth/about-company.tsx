import React, { useState } from "react";
import { completeCompanyNextSteps } from "@/lib/api";
import { toast } from "sonner";

export default function CompanyInfoForm() {
  const [about, setAbout] = useState("");
  const [docs, setDocs] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const filesArray = Array.from(newFiles);

    // Avoid duplicates by name and size
    const uniqueFiles = filesArray.filter(
      (f) =>
        !docs.some(
          (existing) => existing.name === f.name && existing.size === f.size
        )
    );

    setDocs((prev) => [...prev, ...uniqueFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!about.trim()) {
      toast.error("Please provide information about your company");
      return;
    }
    
    if (docs.length === 0) {
      toast.error("Please upload at least one proof document");
      return;
    }

    setSubmitting(true);
    try {
      // Convert files to base64 strings for the API
      const documentPromises = docs.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      const documentStrings = await Promise.all(documentPromises);
      
      await completeCompanyNextSteps({
        about: about.trim(),
        documents: documentStrings
      });
      
      toast.success("Information submitted successfully! Your account will be reviewed by admin.");
      
      // Reset form
      setAbout("");
      setDocs([]);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error?.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-6 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg border border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Missing Information
          </h2>
          <p className="text-gray-600 mb-6">
            Please provide About the Company and upload company documents. Your
            account will be reviewed by admin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* About the Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About the Company <span className="text-red-500">*</span>
            </label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 min-h-56 text-black bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Briefly describe your company"
              required
            />
          </div>

          {/* Proof Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proof Documents <span className="text-red-500">*</span>
            </label>
            <label className="flex items-center justify-center w-full px-4 py-3 bg-white text-purple-600 border border-purple-500 rounded-lg cursor-pointer hover:bg-purple-50 transition">
              <span className="text-sm font-medium">Click to select files</span>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
                onChange={(e) => handleAddFiles(e.target.files)}
              />
            </label>

            {/* File List */}
            {docs.length > 0 && (
              <ul className="mt-3 space-y-2">
                {docs.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50"
                  >
                    <span className="truncate max-w-[75%]">📄 {file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-600 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Upload one or more PDFs or images that verify your company.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg text-white font-medium bg-purple-500 hover:bg-gradient-to-r hover:from-purple-400 hover:via-purple-500 hover:to-purple-600 transition-colors disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
