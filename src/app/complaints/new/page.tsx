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
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { submitComplaint } from "@/lib/complaints";
import { ArrowLeft, ShieldAlert, AlertTriangle, Send } from "lucide-react";

export default function NewComplaintPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { success, error } = useToast();

  const [category, setCategory] = useState<any>("Academic");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) {
      error("Please fill in the subject and description.");
      return;
    }

    setSubmitting(true);
    try {
      const record = await submitComplaint({
        category,
        subject,
        description,
        anonymous,
        userId: anonymous ? null : user?.uid || null,
        userName: anonymous ? undefined : profile?.name || user?.email?.split("@")[0],
      });

      success(`Complaint submitted! Your tracking ID is ${record.trackingId}.`);
      router.push(`/complaints/track?id=${record.trackingId}`);
    } catch (err: any) {
      error(err.message || "Failed to submit grievance.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-2xl mx-auto space-y-6 pb-16">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <PageHeader
            title="Submit Confidential Grievance / Complaint"
            subtitle="CampusOS complaints box assigns a unique tracking ID (CU-2026-XXXXXX) for end-to-end resolution tracking."
          />

          {/* Mandatory Committee Notice per Section 7.4 */}
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-950 dark:text-rose-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-bold mb-1">
                Notice Regarding Safety & Harassment Concerns
              </strong>
              <p className="leading-relaxed">
                While CampusOS routes submissions directly to administrative handlers, sensitive matters regarding physical safety, harassment, or drug concerns must also be reported directly to the official standing university committees: <strong>Sexual Harassment Prevention Committee</strong> or <strong>Anti-Drug Vigilance Committee</strong> via the Proctorial Office (Room 108, Admin Building or 09643-234234).
              </p>
            </div>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <Select value={category} onChange={(e) => setCategory(e.target.value as any)}>
                  <option value="Academic">Academic / Departmental</option>
                  <option value="Transport">Transport / Shuttle Buses</option>
                  <option value="Campus Facilities">Campus Facilities / Labs / Washrooms</option>
                  <option value="Administration">Administration & Accounts</option>
                  <option value="Cafeteria">Cafeteria & Food Hygiene</option>
                  <option value="Other">Other Grievances</option>
                </Select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Broken projector in Room 402 / Bus delay on Mirpur route"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description *
                </label>
                <Textarea
                  placeholder="Detail the issue, location, date, and any specific circumstances..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="block text-slate-900 dark:text-slate-100">
                    Submit Anonymously
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Your name and student ID will NOT be stored with this complaint record.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-campus-gold-600 focus:ring-campus-gold-500"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gold"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Submitting..." : "Submit Grievance"}</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
