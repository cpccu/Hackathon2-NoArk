"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { AcademicResource, Department, ResourceType } from "@/types/models";
import { fetchApprovedResources, upvoteResource } from "@/lib/resources";
import { formatDhakaDate } from "@/lib/date";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  BookOpen,
  Search,
  Upload,
  ThumbsUp,
  FileText,
  CheckCircle2,
  Download,
  Filter,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

const DEPARTMENTS: { label: string; value: Department | "all" }[] = [
  { label: "All Departments", value: "all" },
  { label: "Computer Science & Engineering (CSE)", value: "CSE" },
  { label: "Electrical & Electronic Engineering (EEE)", value: "EEE" },
  { label: "Mechanical Engineering", value: "Mechanical" },
  { label: "Civil Engineering", value: "Civil" },
  { label: "Textile Engineering", value: "Textile" },
  { label: "Pharmacy", value: "Pharmacy" },
  { label: "Business Administration (BBA)", value: "BBA" },
  { label: "English", value: "English" },
  { label: "Law", value: "Law" },
  { label: "Agriculture", value: "Agriculture" },
];

const RESOURCE_TYPES: { label: string; value: ResourceType | "all" }[] = [
  { label: "All Types", value: "all" },
  { label: "Lecture Notes", value: "notes" },
  { label: "Question Papers", value: "question_paper" },
  { label: "Lab Manuals", value: "lab_manual" },
  { label: "Academic Notices", value: "notice" },
  { label: "Other Study Materials", value: "other" },
];

export default function ResourcesPage() {
  const { user, role } = useAuth();
  const { success, error } = useToast();

  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "most_upvoted">("most_upvoted");

  const loadResources = async () => {
    setLoading(true);
    const data = await fetchApprovedResources();
    setResources(data);
    setLoading(false);
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleUpvote = async (resourceId: string) => {
    if (!user) {
      error("Please sign in with your student account to upvote materials.");
      return;
    }

    try {
      const res = await upvoteResource(resourceId, user.uid);
      success(res.message);
      // update state in place
      setResources((prev) =>
        prev.map((r) => (r.id === resourceId ? { ...r, upvotes: res.newCount } : r))
      );
    } catch (err: any) {
      error(err.message || "Failed to upvote resource.");
    }
  };

  const filteredResources = useMemo(() => {
    let list = resources.filter((res) => {
      // Department
      if (deptFilter !== "all" && res.department !== deptFilter) return false;
      // Type
      if (typeFilter !== "all" && res.type !== typeFilter) return false;
      // Search: course code, title, courseTitle, description, keywords
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = res.courseCode.toLowerCase().includes(q);
        const matchTitle = res.title.toLowerCase().includes(q);
        const matchCourse = res.courseTitle.toLowerCase().includes(q);
        const matchDesc = res.description ? res.description.toLowerCase().includes(q) : false;
        const matchKeywords = res.keywords.some((k) => k.toLowerCase().includes(q));
        return matchCode || matchTitle || matchCourse || matchDesc || matchKeywords;
      }
      return true;
    });

    if (sortBy === "most_upvoted") {
      list.sort((a, b) => b.upvotes - a.upvotes);
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [resources, deptFilter, typeFilter, searchQuery, sortBy]);

  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        <PageHeader
          title="Academic Resource Hub"
          subtitle="Peer-reviewed lecture notes, previous question papers, and laboratory manuals across all City University faculties."
          actions={
            <div className="flex items-center gap-2">
              <Link href="/my/uploads">
                <Button variant="outline" size="sm">
                  My Uploads
                </Button>
              </Link>
              <Link href="/resources/upload">
                <Button variant="gold" size="sm" className="flex items-center gap-1.5 shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Resource</span>
                </Button>
              </Link>
              {role === "admin" && (
                <Link href="/admin/resources">
                  <Button variant="primary" size="sm" className="bg-campus-navy-900 text-white">
                    Moderation Queue
                  </Button>
                </Link>
              )}
            </div>
          }
        />

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder='Search by Course (e.g. "CSE 2101"), title, topic...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          {/* Dept filter */}
          <Select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </Select>

          {/* Type filter */}
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs"
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>

          {/* Sort */}
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs"
          >
            <option value="most_upvoted">Most Upvoted First</option>
            <option value="newest">Recently Uploaded</option>
          </Select>
        </div>

        {/* Results Count & Tags */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{filteredResources.length}</strong> academic resource(s)
          </span>
          <span className="font-mono text-[11px]">Free Cloudinary & Firestore Cache</span>
        </div>

        {/* Resource Cards Grid */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading resources...</div>
        ) : filteredResources.length === 0 ? (
          <Card className="text-center py-12">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="font-serif font-bold text-sm text-slate-800 dark:text-slate-200">
              No matching resources found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Try searching for a different course code like &ldquo;CSE 2101&rdquo; or upload the first notes for this course!
            </p>
            <Link href="/resources/upload">
              <Button variant="outline" size="sm">
                Upload New Document
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res) => {
              const formattedSize = `${(res.file.size / (1024 * 1024)).toFixed(1)} MB`;

              return (
                <Card
                  key={res.id}
                  className="flex flex-col justify-between hover:border-campus-navy-300 dark:hover:border-campus-gold-500 transition shadow-sm p-4 sm:p-5"
                >
                  <div className="space-y-3">
                    {/* Top Row: Course badge, type, verified */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-campus-navy-950 text-white dark:bg-campus-gold-600 dark:text-campus-navy-950 px-2 py-0.5 rounded">
                          {res.courseCode}
                        </span>
                        <Badge variant="default">{res.type.replace("_", " ")}</Badge>
                        {res.verified && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Faculty Verified
                          </span>
                        )}
                      </div>
                      <DemoBadge size="sm" />
                    </div>

                    {/* Title */}
                    <div>
                      <Link href={`/resources/${res.id}`} className="hover:underline">
                        <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                          {res.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {res.courseTitle} • {res.department} ({res.semester} Semester)
                      </p>
                    </div>

                    {/* Description */}
                    {res.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {res.description}
                      </p>
                    )}

                    {/* AI Summary snippet if generated */}
                    {res.summary && (
                      <div className="p-2.5 rounded-lg bg-campus-gold-50/60 dark:bg-campus-gold-950/20 border border-campus-gold-200/50 dark:border-campus-gold-900/30 text-[11px]">
                        <div className="flex items-center gap-1 text-campus-gold-800 dark:text-campus-gold-300 font-semibold mb-1">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Summary</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-snug">
                          {res.summary.en}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Uploader, Size, Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="text-slate-400 text-[11px]">
                      <span>By {res.uploaderName}</span> • <span>{formattedSize}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Upvote button */}
                      <button
                        onClick={() => handleUpvote(res.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition"
                        title="Upvote this resource"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-campus-gold-600 dark:text-campus-gold-400" />
                        <span>{res.upvotes}</span>
                      </button>

                      <Link href={`/resources/${res.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Details & Preview
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
