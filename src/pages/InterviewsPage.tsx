import React from "react";
import { useJobs } from "../contexts/JobsContext";
import { Link } from "react-router-dom";

export default function InterviewsPage() {
  const { jobs } = useJobs();

  // Filter for jobs with interviews and sort by updatedAt in descending order
  const interviewJobs = jobs
    .filter(job => job.isInterview)
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Interviews</h1>
      <div className="grid gap-4 max-w-full">
        {interviewJobs.map(job => (
          <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <Link to={`/jobs/${job._id}`} className="text-base sm:text-xl font-semibold text-blue-700 hover:text-blue-900 block">
                {job.title}
              </Link>
            </div>
            {/* Desktop view */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-x-4 gap-y-4 p-4">
              <div>
                <p className="text-gray-600">
                  <span className="font-medium">Vendor:</span> {job.vendor}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <span className="font-medium">Client:</span> {job.client}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <span className="font-medium">Marketing Team:</span> {job.marketingTeam}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <span className="font-medium">End Client:</span> {job.endClient}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {job.jobLocation}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <span className="font-medium">Last Updated:</span> {job.updatedAt 
                    ? new Date(job.updatedAt).toLocaleDateString() 
                    : "N/A"}
                </p>
              </div>
            </div>
            {/* Mobile view with horizontal scroll */}
            <div className="sm:hidden w-full overflow-x-auto">
              <div className="flex whitespace-nowrap p-4 gap-6">
                <div className="text-gray-600 inline-block">
                  <span className="font-medium">Vendor:</span> {job.vendor}
                </div>
                <div className="text-gray-600 inline-block">
                  <span className="font-medium">Client:</span> {job.client}
                </div>
                <div className="text-gray-600 inline-block">
                  <span className="font-medium">Marketing Team:</span> {job.marketingTeam}
                </div>
                <div className="text-gray-600 inline-block">
                  <span className="font-medium">End Client:</span> {job.endClient}
                </div>
                <div className="text-gray-600 inline-block">
                  <span className="font-medium">Location:</span> {job.jobLocation}
                </div>
                <div className="text-gray-600 inline-block">
                  <span className="font-medium">Last Updated:</span> {job.updatedAt 
                    ? new Date(job.updatedAt).toLocaleDateString() 
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        ))}
        {interviewJobs.length === 0 && (
          <p className="text-gray-500 text-center">No interviews scheduled yet.</p>
        )}
      </div>
    </div>
  );
}