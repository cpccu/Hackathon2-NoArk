"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Complaint, ComplaintStatus } from "@/types/models";
import { fetchAllComplaintsForAdmin, updateComplaintStatus } from "@/lib/complaints";
import { formatDhakaDateTime } from "@/lib/date";
import { ShieldAlert, CheckCircle2, Clock, MessageSquare, ArrowRight } from "lucide-react";

export default function AdminComplaintsPage() {
  const { success, error } = useToast();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "received" | "in_review" | "resolved">("all");

  // Update modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<ComplaintStatus>("in_review");
  const [actionNote, setActionNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const list = await fetchAllComplaintsForAdmin();
    setComplaints(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openUpdateModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setNextStatus(c.status === "received" ? "in_review" : "resolved");
    setActionNote(
      c.status === "received"
        ? "Assigned to department coordinator for immediate inspection."
        : "Matter resolved. Measures taken and verified."
    );
    setModalOpen(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setSubmitting(true);

    try {
      await updateComplaintStatus(selectedComplaint.id, nextStatus, actionNote);
      success(`Updated status for ${selectedComplaint.trackingId} to ${nextStatus}.`);
      setModalOpen(false);
      await loadData();
    } catch {
      error("Failed to update complaint status.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = complaints.filter((c) => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AppShell>
        <div className="space-y-6 pb-16">
          <PageHeader
            title="Complaints & Grievances Administration"
            subtitle="Central administrative queue for university complaints, action notes, and resolution timelines."
          />

          {/* Filter Pills */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            {(["all", "received", "in_review", "resolved"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition ${
                  filterStatus === s
                    ? "bg-campus-navy-950 text-white dark:bg-campus-gold-600 dark:text-campus-navy-950"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {s.replace("_", " ")} ({complaints.filter((c) => (s === "all" ? true : c.status === s)).length})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading complaints queue...</div>
          ) : filtered.length === 0 ? (
            <Card className="text-center py-12">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-serif font-bold text-sm">No complaints in this queue</h3>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <Card key={item.id} className="p-4 sm:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold bg-campus-navy-900 text-white px-2 py-0.5 rounded">
                          {item.trackingId}
                        </span>
                        <Badge variant="default">{item.category}</Badge>
                        <Badge
                          variant={
                            item.status === "resolved"
                              ? "success"
                              : item.status === "in_review"
                              ? "warning"
                              : "neutral"
                          }
                        >
                          {item.status.replace("_", " ")}
                        </Badge>
                        {item.anonymous ? (
                          <span className="text-[11px] text-slate-400 italic">Anonymous Submitter</span>
                        ) : (
                          <span className="text-[11px] text-slate-600 dark:text-slate-400">
                            By {item.userName || "Student"}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                        {item.subject}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Received: {formatDhakaDateTime(item.createdAt)} • {item.timeline.length} notes logged
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/complaints/track?id=${item.trackingId}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          Public View
                        </Button>
                      </Link>

                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => openUpdateModal(item)}
                        className="text-xs"
                      >
                        Update Status / Note
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Status update modal */}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Update Complaint Status & Audit Trail"
          >
            {selectedComplaint && (
              <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">
                    Grievance: <strong>{selectedComplaint.trackingId}</strong> — {selectedComplaint.subject}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    New Status *
                  </label>
                  <Select
                    value={nextStatus}
                    onChange={(e) => setNextStatus(e.target.value as ComplaintStatus)}
                  >
                    <option value="received">Received</option>
                    <option value="in_review">In Review / Under Action</option>
                    <option value="resolved">Resolved</option>
                  </Select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Public Note / Action Taken *
                  </label>
                  <Textarea
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    rows={3}
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    This note will be timestamped in Dhaka time and displayed on the student&apos;s tracking timeline.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" size="sm" disabled={submitting}>
                    {submitting ? "Saving..." : "Record Status Update"}
                  </Button>
                </div>
              </form>
            )}
          </Modal>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
