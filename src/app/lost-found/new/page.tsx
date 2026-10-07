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
import { createLostFoundItem } from "@/lib/lostFound";
import { LostFoundKind } from "@/types/models";
import { ArrowLeft, PlusCircle } from "lucide-react";

export default function NewLostFoundPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { success, error } = useToast();

  const [kind, setKind] = useState<LostFoundKind>("lost");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<any>("ID Card / Documents");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [verificationQuestion, setVerificationQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) {
      error("Please fill in all mandatory fields.");
      return;
    }

    setSubmitting(true);
    try {
      await createLostFoundItem({
        kind,
        title,
        category,
        description,
        location,
        date: new Date().toISOString().split("T")[0],
        contactPhone,
        verificationQuestion: kind === "found" ? verificationQuestion : undefined,
        createdBy: user?.uid || "anon",
        createdByName: profile?.name || user?.email?.split("@")[0] || "Student",
        source: "demo",
      });

      success(`Successfully published ${kind.toUpperCase()} report.`);
      router.push("/lost-found");
    } catch (err: any) {
      error(err.message || "Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-xl mx-auto space-y-6 pb-16">
          <Link
            href="/lost-found"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Lost & Found</span>
          </Link>

          <PageHeader
            title="Report Lost or Found Item"
            subtitle="Broadcast an item retrieval alert across the campus registry."
          />

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Report Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setKind("lost")}
                    className={`py-2 px-3 rounded-lg font-bold border transition ${
                      kind === "lost"
                        ? "bg-rose-50 border-rose-400 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
                        : "bg-white dark:bg-slate-900 border-slate-200 text-slate-600"
                    }`}
                  >
                    I Lost an Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setKind("found")}
                    className={`py-2 px-3 rounded-lg font-bold border transition ${
                      kind === "found"
                        ? "bg-emerald-50 border-emerald-400 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                        : "bg-white dark:bg-slate-900 border-slate-200 text-slate-600"
                    }`}
                  >
                    I Found an Item
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Item Title *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Student ID Card (Batch 50) / Casio fx-991EX"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <Select value={category} onChange={(e) => setCategory(e.target.value as any)}>
                    <option value="ID Card / Documents">ID Card / Documents</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Keys">Keys</option>
                    <option value="Bag / Wallet">Bag / Wallet</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other Items</option>
                  </Select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Campus Location *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Central Library Block A / Room 302"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description *
                </label>
                <Textarea
                  placeholder="Provide distinguishing features, colors, markings, or contents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              {kind === "found" && (
                <div className="p-3 rounded-lg bg-campus-navy-50/60 dark:bg-campus-navy-950/30 border border-campus-navy-200 dark:border-campus-navy-800">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ownership Verification Question (Optional but Recommended)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. What name is written on the back / What is the lock pattern?"
                    value={verificationQuestion}
                    onChange={(e) => setVerificationQuestion(e.target.value)}
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Claimants must answer this question before their ownership is approved.
                  </span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 01700-XXXXXX"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="gold" disabled={submitting} className="w-full">
                  {submitting ? "Publishing Report..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
