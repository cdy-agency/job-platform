"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { fetchRequests } from "@/lib/api/admin";

// Employee interface
interface Employee {
  _id: string;
  name: string;
  email: string;
  dateOfBirth?: string;
  profileImage?: { url?: string };
  about?: string;
  education?: string;
  experience?: string;
  jobPreferences?: string;
  skills?: string[];
  district?: string;
  province?: string;
  gender?: string;
  documents?: { url: string; name?: string }[];
}

// WorkRequest interface
interface WorkRequest {
  _id: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  employeeId: Employee;
  companyId: { companyName: string; email: string };
}

export default function WorkRequestsPage() {
  const [requests, setRequests] = useState<WorkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    useEffect(() => {
      const getRequests = async () => {
        try {
          const res = await fetchRequests();
          setRequests(res.requests ?? []);
        } catch (error) {
          console.log("failed to fetch companies", error);
        } finally {
          setLoading(false);
        }
      };
      getRequests();
    }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="border border-purple-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-purple-700">
            Work Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No work requests found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-purple-50 text-left text-sm text-gray-700">
                    <th className="p-3">Employee</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req._id}
                      className="border-b hover:bg-purple-50 transition"
                    >
                      <td className="p-3 font-medium text-gray-800">
                        {req.employeeId.name}
                      </td>
                      <td className="p-3 text-gray-600">
                        {req.employeeId.email}
                      </td>
                      <td className="p-3">
                        <Badge
                          className={`${
                            req.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : req.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {req.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="outline"
                          className="border-purple-500 text-purple-600 hover:bg-purple-100"
                          onClick={() => setSelectedEmployee(req.employeeId)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Details Modal */}
      <Dialog
        open={!!selectedEmployee}
        onOpenChange={() => setSelectedEmployee(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-purple-700 text-lg">
              Employee Details
            </DialogTitle>
            <DialogDescription>
              Comprehensive information about this employee
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-4 mt-3">
              {/* Profile Info */}
              <div className="flex items-center gap-3">
                <Image
                  src={
                    selectedEmployee.profileImage?.url ||
                    "/placeholder-avatar.png"
                  }
                  alt={selectedEmployee.name}
                  width={60}
                  height={60}
                  className="rounded-full border border-purple-300"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedEmployee.email}
                  </p>
                </div>
              </div>

              {/* Text Details */}
              <div className="text-sm space-y-1">
                <p>
                  <strong>Gender:</strong> {selectedEmployee.gender || "N/A"}
                </p>
                <p>
                  <strong>Province:</strong> {selectedEmployee.province || "N/A"}
                </p>
                <p>
                  <strong>District:</strong> {selectedEmployee.district || "N/A"}
                </p>
                <p>
                  <strong>Education:</strong> {selectedEmployee.education || "N/A"}
                </p>
                <p>
                  <strong>Experience:</strong> {selectedEmployee.experience || "N/A"}
                </p>
                <p>
                  <strong>About:</strong>{" "}
                  {selectedEmployee.about || "No bio provided"}
                </p>

                {/* Skills */}
                {(selectedEmployee.skills?.length ?? 0) > 0 && (
                  <div>
                    <strong>Skills:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedEmployee.skills!.map((skill, i) => (
                        <Badge
                          key={i}
                          className="bg-purple-100 text-purple-700 font-medium"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {(selectedEmployee.documents?.length ?? 0) > 0 && (
                  <div className="mt-2">
                    <strong>Documents:</strong>
                    <ul className="list-disc pl-5">
                      {selectedEmployee.documents!.map((doc, i) => (
                        <li key={i}>
                          <a
                            href={doc.url}
                            target="_blank"
                            className="text-purple-600 underline"
                            rel="noreferrer"
                          >
                            {doc.name || `Document ${i + 1}`}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
