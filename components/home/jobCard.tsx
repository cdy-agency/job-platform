import { ArrowRight, MapPin } from "lucide-react";
import React from "react";
import { JobTypes } from "@/types/types";

interface JobCardProps {
  job: JobTypes;
  onClick: (id: string) => void;
}

export const JobCard = ({ job, onClick }: JobCardProps) => {
  return (
    <div
      onClick={() => onClick(job.id)}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
    >
      {/* Company Logo + Name */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={job.company.logo}
          alt={job.company.name}
          className="w-10 h-10 rounded-md object-cover border border-gray-200"
        />
        <div className="overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {job.title}
          </h3>
          <p className="text-xs text-gray-500 truncate">{job.company.name}</p>
        </div>
      </div>

      {/* Location & Type */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <div className="flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3" />
          {job.location}
        </div>
        <span className="px-2 py-0.5 border rounded-full text-gray-600 truncate">
          {job.employmentType}
        </span>
      </div>

      {/* Short Description */}
      <p className="text-xs text-gray-600 line-clamp-2 mb-3">
        {job.description}
      </p>

      {/* View More Button */}
      <button
        className="flex items-center justify-center w-full text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 py-1.5 rounded-md transition-colors"
      >
        View Details
        <ArrowRight className="w-3 h-3 ml-1" />
      </button>
    </div>
  );
};

export default JobCard;
