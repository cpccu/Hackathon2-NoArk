"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { AcademicResource } from "@/types/models";
import { fetchResourceById, upvoteResource, moderateResource } from "@/lib/resources";
import { formatDhakaDateTime } from "@/lib/date";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  ArrowLeft,
  Download,
  ThumbsUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = params.id as string;

  const { user, role } = useAuth();
  const { success, error } = useToast();

  const [resource, setResource] = useState<AcademicResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchResourceById(resourceId);
      setResource(data);
      setLoading(false);
    }
    if (resourceId) load();
  }, [resourceId]);

  const handleUpvote = async () => {
    if (!user) {
      error("Please sign in to upvote this resource.");
      return;
    }
    if (!resource) return;

    try {
      const res = await upvoteResource(resource.id, user.uid);
      success(res.message);
      setResource((prev) => (prev ? { ...prev, upvotes: res.newCount } : prev));
    } catch (err: any) {
      error(err.message || "Failed to record upvote.");
    }
  };

  const handleGenerateSummary = async () => {
    if (!resource) return;
    setSummarizing(true);

    try {
      const res = await fetch("/api/resources/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resource.title,
          description: resource.description,
          courseCode: resource.courseCode,
          courseTitle: resource.courseTitle,
        }),
      });

      const data = await res.json();
      if (data.en && data.bn) {
        await moderateResource(resource.id, {
          summary: { en: data.en, bn: data.bn },
        });
        setResource((prev) =>
          prev ? { ...prev, summary: { en: data.en, bn: data.bn } } : prev
        );
        success("AI summary generated and cached in Firestore!");
      }
    } catch (err: any) {
      error("Could not generate AI summary at this time.");
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="py-12 text-center text-xs text-slate-500">Loading resource details...</div>
      </AppShell>
    );
  }

  if (!resource) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto py-12 text-center">
          <h2 className="font-serif text-lg font-bold mb-2">Resource Not Found</h2>
          <p className="text-xs text-slate-500 mb-4">This document may have been removed or rejected.</p>
          <Link href="/resources">
            <Button variant="outline" size="sm">
              Back to Resource Hub
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const isPdf = resource.file.mimeType.includes("pdf") || resource.file.name.endsWith(".pdf");

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Resources</span>
        </Link>

        {/* Title Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-xs bg-campus-navy-950 text-white dark:bg-campus-gold-600 dark:text-campus-navy-950 px-2 py-0.5 rounded">
              {resource.courseCode}
            </span>
            <Badge variant="default">{resource.type.replace("_", " ")}</Badge>
            {resource.verified && (
              <Badge variant="official" className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Faculty Verified</span>
              </Badge>
            )}
            <DemoBadge size="sm" />
          </div>

          <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {resource.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {resource.courseTitle} • Department of {resource.department} ({resource.semester} Semester)
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpvote}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-campus-gold-50 dark:bg-campus-gold-950/40 text-campus-gold-900 dark:text-campus-gold-300 border border-campus-gold-300 dark:border-campus-gold-800 text-xs font-bold hover:bg-campus-gold-100 transition"
            >
              <ThumbsUp className="w-4 h-4 fill-campus-gold-500 text-campus-gold-600" />
              <span>{resource.upvotes} Upvotes</span>
            </button>

            {!resource.summary && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateSummary}
                disabled={summarizing}
                className="flex items-center gap-1.5 text-xs"
              >
                {summarizing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-campus-gold-600" />
                )}
                <span>Generate AI Summary</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a href={resource.file.url} download={resource.file.name} target="_blank" rel="noopener noreferrer">
              <Button variant="gold" size="sm" className="flex items-center gap-1.5 shadow-sm">
                <Download className="w-3.5 h-3.5" />
                <span>Download ({((resource.file.size || 0) / (1024 * 1024)).toFixed(1)} MB)</span>
              </Button>
            </a>
          </div>
        </div>

        {/* AI Summary Block */}
        {resource.summary && (
          <Card className="border-2 border-campus-gold-300 dark:border-campus-gold-900/60 bg-campus-gold-50/40 dark:bg-campus-gold-950/20">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-campus-gold-200/50 dark:border-campus-gold-900/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-campus-gold-600 dark:text-campus-gold-400" />
                <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100">
                  AI Generated Executive Summary
                </h3>
              </div>
              <Badge variant="gold">AI Generated</Badge>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              <p>
                <strong>English:</strong> {resource.summary.en}
              </p>
              <p>
                <strong>বাংলা:</strong> {resource.summary.bn}
              </p>
            </div>
          </Card>
        )}

        {/* Embedded Document Preview */}
        <Card className="p-0 overflow-hidden border-2 border-slate-200 dark:border-slate-800">
          <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-campus-navy-700 dark:text-campus-gold-400" />
              <span>Document Viewer ({resource.file.name})</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">{resource.file.mimeType}</span>
          </div>

          {isPdf ? (
            <div className="w-full h-[550px] bg-slate-900">
              <iframe
                src={`${resource.file.url}#toolbar=0`}
                className="w-full h-full border-0"
                title={resource.title}
              />
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">
                In-browser preview is available for PDF files. Click below to download or view this file.
              </p>
              <a href={resource.file.url} download={resource.file.name}>
                <Button variant="outline" size="sm">
                  Download File
                </Button>
              </a>
            </div>
          )}
        </Card>

        {/* Document Metadata */}
        <Card>
          <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
            Academic Verification & Uploader Info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div>
              <span className="block text-slate-400 text-[11px]">Uploaded By</span>
              <strong className="text-slate-900 dark:text-slate-200">{resource.uploaderName}</strong>
            </div>
            <div>
              <span className="block text-slate-400 text-[11px]">Upload Date (Dhaka Time)</span>
              <strong className="text-slate-900 dark:text-slate-200">
                {formatDhakaDateTime(resource.createdAt)}
              </strong>
            </div>
            <div>
              <span className="block text-slate-400 text-[11px]">Syllabus Keywords</span>
              <div className="flex items-center gap-1 flex-wrap mt-0.5">
                {resource.keywords.map((k, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-[10px]"
                  >
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
