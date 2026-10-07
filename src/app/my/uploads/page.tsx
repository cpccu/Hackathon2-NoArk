"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { AcademicResource } from "@/types/models";
import { fetchUserUploads } from "@/lib/resources";
import { formatDhakaDateTime } from "@/lib/date";
import { Upload, FileText, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";

export default function MyUploadsPage() {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<AcademicResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      const list = await fetchUserUploads(user.uid);
      setUploads(list);
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-4xl mx-auto space-y-6 pb-16">
          <PageHeader
            title="My Uploaded Resources"
            subtitle="Track the moderation and publication status of materials you shared with City University students."
            actions={
              <Link href="/resources/upload">
                <Button variant="gold" size="sm" className="flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Another</span>
                </Button>
              </Link>
            }
          />

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading your uploads...</div>
          ) : uploads.length === 0 ? (
            <Card className="text-center py-12">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="font-serif font-bold text-sm">No materials uploaded yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                You haven&apos;t shared any notes or question papers yet. Help your peers by uploading your study materials!
              </p>
              <Link href="/resources/upload">
                <Button variant="outline" size="sm">
                  Upload First Resource
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {uploads.map((item) => {
                const isApproved = item.status === "approved";
                const isPending = item.status === "pending";
                const isRejected = item.status === "rejected";

                return (
                  <Card key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-900 text-white dark:bg-campus-gold-600 dark:text-campus-navy-950 px-2 py-0.5 rounded">
                          {item.courseCode}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {item.department} • Uploaded on {formatDhakaDateTime(item.createdAt)}
                      </p>
                      {isRejected && item.rejectionReason && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                          Rejection note: {item.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Approved
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Pending Review
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          Rejected
                        </span>
                      )}

                      <Link href={`/resources/${item.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          View
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
