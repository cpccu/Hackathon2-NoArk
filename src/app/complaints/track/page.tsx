"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Complaint } from "@/types/models";
import { fetchComplaintByTrackingId } from "@/lib/complaints";
import { formatDhakaDateTime } from "@/lib/date";
import { Search, ShieldAlert, CheckCircle2, Clock, FileText, ArrowRight } from "lucide-react";

function TrackComplaintContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [trackingInput, setTrackingInput] = useState(initialId);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = React.useCallback(async (overrideId?: string) => {
    const idToSearch = overrideId || trackingInput;
    if (!idToSearch.trim()) return;

    setLoading(true);
    setSearched(true);
    const result = await fetchComplaintByTrackingId(idToSearch);
    setComplaint(result);
    setLoading(false);
  }, [trackingInput]);

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId, handleSearch]);

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6 pb-16">
        <PageHeader
          title="Track Grievance Resolution"
          subtitle="Enter your tracking ID (e.g. CU-2026-784912) to inspect status updates and administrative notes."
          actions={
            <Link href="/complaints/new">
              <Button variant="gold" size="sm">
                Submit New Complaint
              </Button>
            </Link>
          }
        />

        {/* Search input form */}
        <Card className="p-4 sm:p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Enter Tracking ID (e.g. CU-2026-784912)..."
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="pl-9 font-mono text-xs"
              />
            </div>
            <Button type="submit" variant="primary" disabled={loading} className="shrink-0 text-xs">
              {loading ? "Searching..." : "Track Status"}
            </Button>
          </form>
        </Card>

        {/* Search result display */}
        {searched && !loading && !complaint && (
          <Card className="text-center py-12">
            <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-sm">No record found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              We could not find a complaint associated with &ldquo;{trackingInput}&rdquo;. Please verify the tracking number.
            </p>
          </Card>
        )}

        {complaint && (
          <div className="space-y-6">
            {/* Overview Card */}
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2 mb-4">
                <div>
                  <span className="text-slate-400 font-mono text-xs block">
                    Tracking ID: <strong className="text-slate-900 dark:text-slate-100">{complaint.trackingId}</strong>
                  </span>
                  <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {complaint.subject}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{complaint.category}</Badge>
                  <Badge
                    variant={
                      complaint.status === "resolved"
                        ? "success"
                        : complaint.status === "in_review"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {complaint.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {complaint.description}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  Submitted: {formatDhakaDateTime(complaint.createdAt)}
                </span>
                <span>
                  {complaint.anonymous ? "Anonymous Submitter" : `Submitted by: ${complaint.userName || "Student"}`}
                </span>
              </div>
            </Card>

            {/* Status Timeline */}
            <Card>
              <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-campus-navy-700 dark:text-campus-gold-400" />
                <span>Resolution Audit Trail & Timeline</span>
              </h3>

              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {complaint.timeline.map((entry, idx) => {
                  const isResolved = entry.status === "resolved";
                  return (
                    <div key={idx} className="relative flex items-start gap-3">
                      <div
                        className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 bg-white dark:bg-slate-900 ${
                          isResolved
                            ? "border-emerald-600 ring-2 ring-emerald-200 dark:ring-emerald-900"
                            : "border-campus-navy-600 ring-2 ring-campus-navy-200"
                        }`}
                      />
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold uppercase tracking-wider text-[11px] text-slate-800 dark:text-slate-200">
                            {entry.status.replace("_", " ")}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formatDhakaDateTime(entry.timestamp)}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {entry.note}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function TrackComplaintPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="max-w-3xl mx-auto py-12 text-center text-xs text-slate-500">
            Loading complaint tracking portal...
          </div>
        </AppShell>
      }
    >
      <TrackComplaintContent />
    </Suspense>
  );
}
