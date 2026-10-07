"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { AcademicResource } from "@/types/models";
import { fetchAllResourcesForAdmin, moderateResource } from "@/lib/resources";
import { formatDhakaDateTime } from "@/lib/date";
import {
  Shield,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  Search,
  BadgeCheck,
} from "lucide-react";

export default function AdminResourcesModerationPage() {
  const { role } = useAuth();
  const { success, error } = useToast();

  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [targetResource, setTargetResource] = useState<AcademicResource | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const loadData = async () => {
    setLoading(true);
    const list = await fetchAllResourcesForAdmin();
    setResources(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await moderateResource(id, { status: "approved" });
      success("Resource approved and published to the student hub!");
      setResources((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
      );
    } catch {
      error("Failed to approve resource.");
    }
  };

  const handleToggleVerified = async (id: string, currentVal: boolean) => {
    try {
      await moderateResource(id, { verified: !currentVal });
      success(!currentVal ? "Marked as Faculty Verified!" : "Removed verified mark.");
      setResources((prev) =>
        prev.map((r) => (r.id === id ? { ...r, verified: !currentVal } : r))
      );
    } catch {
      error("Failed to update verified status.");
    }
  };

  const openRejectModal = (res: AcademicResource) => {
    setTargetResource(res);
    setRejectReason("Document contents do not match City University syllabus or course curriculum.");
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!targetResource) return;
    try {
      await moderateResource(targetResource.id, {
        status: "rejected",
        rejectionReason: rejectReason,
      });
      success("Resource marked as rejected.");
      setResources((prev) =>
        prev.map((r) =>
          r.id === targetResource.id
            ? { ...r, status: "rejected", rejectionReason: rejectReason }
            : r
        )
      );
      setRejectModalOpen(false);
    } catch {
      error("Failed to reject resource.");
    }
  };

  const filtered = resources.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AppShell>
        <div className="space-y-6 pb-16">
          <PageHeader
            title="Academic Resources Moderation Queue"
            subtitle="Review pending student submissions, verify syllabus authenticity, or reject non-compliant documents."
            actions={
              <Link href="/resources">
                <Button variant="outline" size="sm">
                  View Public Hub
                </Button>
              </Link>
            }
          />

          {/* Status filter tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            {(["pending", "approved", "rejected", "all"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition ${
                  filterStatus === s
                    ? "bg-campus-navy-950 text-white dark:bg-campus-gold-600 dark:text-campus-navy-950"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {s} ({resources.filter((r) => (s === "all" ? true : r.status === s)).length})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading moderation queue...</div>
          ) : filtered.length === 0 ? (
            <Card className="text-center py-12">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-serif font-bold text-sm">No items in this queue</h3>
              <p className="text-xs text-slate-500 mt-1">All student submissions have been reviewed.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <Card key={item.id} className="p-4 sm:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                          {item.courseCode}
                        </span>
                        <Badge variant="default">{item.type.replace("_", " ")}</Badge>
                        <Badge
                          variant={
                            item.status === "approved"
                              ? "success"
                              : item.status === "rejected"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {item.status}
                        </Badge>
                        {item.verified && (
                          <Badge variant="official" className="flex items-center gap-1">
                            <BadgeCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Course: {item.courseTitle} • {item.department} ({item.semester} Trimester)
                      </p>

                      <p className="text-[11px] text-slate-500">
                        Uploader: <strong>{item.uploaderName}</strong> • Submitted: {formatDhakaDateTime(item.createdAt)}
                      </p>

                      {item.rejectionReason && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                          Reason: {item.rejectionReason}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap lg:justify-end">
                      <a
                        href={item.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        <span>Inspect File</span>
                      </a>

                      {item.status !== "approved" && (
                        <Button
                          variant="gold"
                          size="sm"
                          onClick={() => handleApprove(item.id)}
                          className="flex items-center gap-1 text-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleVerified(item.id, item.verified)}
                        className="text-xs"
                      >
                        {item.verified ? "Unverify" : "Mark Verified"}
                      </Button>

                      {item.status !== "rejected" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openRejectModal(item)}
                          className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Rejection Modal */}
          <Modal
            isOpen={rejectModalOpen}
            onClose={() => setRejectModalOpen(false)}
            title="Reject Academic Submission"
          >
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                Specify the reason for rejection for document &ldquo;{targetResource?.title}&rdquo;. This will be visible to the student in their My Uploads dashboard.
              </p>
              <Input
                type="text"
                placeholder="Reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setRejectModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={confirmReject} className="bg-rose-600 hover:bg-rose-700 text-white">
                  Confirm Rejection
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
