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
import { Complaint } from "@/types/models";
import { fetchUserComplaints } from "@/lib/complaints";
import { formatDhakaDateTime } from "@/lib/date";
import { ShieldCheck, PlusCircle, ArrowRight, Clock } from "lucide-react";

export default function MyComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      const list = await fetchUserComplaints(user.uid);
      setComplaints(list);
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-4xl mx-auto space-y-6 pb-16">
          <PageHeader
            title="My Submitted Grievances"
            subtitle="Follow updates, department assignments, and resolutions for your reported campus complaints."
            actions={
              <Link href="/complaints/new">
                <Button variant="gold" size="sm" className="flex items-center gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Submit New</span>
                </Button>
              </Link>
            }
          />

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading your complaints...</div>
          ) : complaints.length === 0 ? (
            <Card className="text-center py-12">
              <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="font-serif font-bold text-sm">No grievances recorded</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                You haven&apos;t filed any complaints under this account.
              </p>
              <Link href="/complaints/new">
                <Button variant="outline" size="sm">
                  Report Campus Issue
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {complaints.map((c) => (
                <Card key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-campus-navy-700 dark:text-campus-gold-400">
                        {c.trackingId}
                      </span>
                      <Badge variant="default">{c.category}</Badge>
                      <Badge
                        variant={
                          c.status === "resolved"
                            ? "success"
                            : c.status === "in_review"
                            ? "warning"
                            : "neutral"
                        }
                      >
                        {c.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100">
                      {c.subject}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Submitted: {formatDhakaDateTime(c.createdAt)} • {c.timeline.length} updates recorded
                    </p>
                  </div>

                  <Link href={`/complaints/track?id=${c.trackingId}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs flex items-center gap-1">
                      <span>Timeline</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
