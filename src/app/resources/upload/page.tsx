"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FileUploader } from "@/components/ui/FileUploader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { createAcademicResource } from "@/lib/resources";
import { Department, ResourceType } from "@/types/models";
import { ArrowLeft, Upload, CheckCircle2, AlertCircle } from "lucide-react";

export default function UploadResourcePage() {
  const router = useRouter();
  const { user, profile, role } = useAuth();
  const { success, error } = useToast();

  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [department, setDepartment] = useState<Department>("CSE");
  const [semester, setSemester] = useState("1st");
  const [type, setType] = useState<ResourceType>("notes");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  const [uploadedFile, setUploadedFile] = useState<{
    url: string;
    publicId?: string;
    name: string;
    size: number;
    mimeType: string;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseCode || !courseTitle || !uploadedFile) {
      error("Please fill all required fields and upload a valid document.");
      return;
    }

    setSubmitting(true);
    try {
      const parsedKeywords = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      // Student uploads are pending; admin uploads are automatically approved per Section 7.2
      const isAutoApproved = role === "admin";

      await createAcademicResource({
        title,
        description,
        courseCode: courseCode.toUpperCase().trim(),
        courseTitle: courseTitle.trim(),
        department,
        semester,
        type,
        file: uploadedFile,
        uploaderId: user?.uid || "anon",
        uploaderName: profile?.name || user?.email?.split("@")[0] || "City Student",
        status: isAutoApproved ? "approved" : "pending",
        verified: isAutoApproved,
        keywords: [courseCode.toUpperCase(), ...parsedKeywords],
        source: "demo",
      });

      if (isAutoApproved) {
        success("Resource published immediately with verified status.");
      } else {
        success("Resource submitted for academic moderation. View under My Uploads.");
      }

      router.push("/my/uploads");
    } catch (err: any) {
      error(err.message || "Failed to submit resource.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-2xl mx-auto space-y-6 pb-16">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Resource Hub</span>
          </Link>

          <PageHeader
            title="Upload Academic Resource"
            subtitle="Share notes, solved question papers, and manuals with fellow City University students."
          />

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Resource Title *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Data Structures Midterm Handwritten Lecture Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course Code *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. CSE 2101"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course Title *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Data Structures"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department *
                  </label>
                  <Select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Department)}
                  >
                    <option value="CSE">CSE</option>
                    <option value="EEE">EEE</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Textile">Textile</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="BBA">Business Administration (BBA)</option>
                    <option value="English">English</option>
                    <option value="Law">Law</option>
                    <option value="Agriculture">Agriculture</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Semester *
                  </label>
                  <Select value={semester} onChange={(e) => setSemester(e.target.value)}>
                    <option value="1st">1st Trimester</option>
                    <option value="2nd">2nd Trimester</option>
                    <option value="3rd">3rd Trimester</option>
                    <option value="4th">4th Trimester</option>
                    <option value="5th">5th Trimester</option>
                    <option value="6th">6th Trimester</option>
                    <option value="7th">7th Trimester</option>
                    <option value="8th">8th Trimester</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Resource Type *
                  </label>
                  <Select value={type} onChange={(e) => setType(e.target.value as ResourceType)}>
                    <option value="notes">Lecture Notes</option>
                    <option value="question_paper">Question Paper</option>
                    <option value="lab_manual">Lab Manual</option>
                    <option value="notice">Academic Notice</option>
                    <option value="other">Other</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Topics Covered
                </label>
                <Textarea
                  placeholder="Outline key topics covered in this document..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Keywords (comma separated)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. binary tree, sorting, avl, mid exam"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

              {/* File Upload Pipeline */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Upload Document (PDF, DOCX, PPTX, PNG, JPG; Max 10MB) *
                </label>
                <FileUploader
                  accept=".pdf,.docx,.pptx,.png,.jpg,.jpeg"
                  maxSizeMB={10}
                  onUploadComplete={(file) => setUploadedFile(file)}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gold"
                  disabled={submitting || !uploadedFile}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{submitting ? "Uploading Document..." : "Submit Resource"}</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
