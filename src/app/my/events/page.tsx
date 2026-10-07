"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { QRCodeDisplay } from "@/components/events/QRCodeDisplay";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { EventRegistration } from "@/types/models";
import { getUserRegistrations, cancelRegistration } from "@/lib/registrations";
import { formatDhakaDateTime } from "@/lib/date";
import { Ticket, Calendar, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react";

export default function MyTicketsPage() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      const data = await getUserRegistrations(user.uid);
      setRegistrations(data);
      setLoading(false);
    }
    load();
  }, [user]);

  const handleCancel = async (reg: EventRegistration) => {
    if (!confirm(`Are you sure you want to cancel your registration for "${reg.eventTitle}"?`)) {
      return;
    }

    try {
      await cancelRegistration(reg.id, reg.eventId);
      success("Registration cancelled. If any waitlist existed, the next student was promoted.");
      if (user) {
        const updated = await getUserRegistrations(user.uid);
        setRegistrations(updated);
      }
    } catch (err: any) {
      console.error("Cancel error:", err);
      error(err.message || "Failed to cancel registration.");
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <PageHeader
          title="My Event Passes & QR Tickets"
          subtitle="All confirmed and waitlisted campus passes associated with your student ID."
          actions={
            <Link href="/events">
              <Button variant="outline" size="sm">
                Browse More Events
              </Button>
            </Link>
          }
        />

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Loading your student passes...
          </div>
        ) : registrations.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title="No event tickets registered"
            description="You haven't signed up for any club events or workshops yet."
            actionLabel="Discover Upcoming Events"
            onAction={() => (window.location.href = "/events")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            {registrations.map((reg) => {
              const isConfirmed = reg.status === "registered";
              const isWaitlisted = reg.status === "waitlisted";
              const isCancelled = reg.status === "cancelled";

              return (
                <Card
                  key={reg.id}
                  className={`flex flex-col justify-between border-2 ${
                    isCancelled
                      ? "border-slate-200 dark:border-slate-800 opacity-60"
                      : isWaitlisted
                      ? "border-amber-300 dark:border-amber-800"
                      : "border-campus-navy-300 dark:border-campus-navy-700"
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        PASS ID: {reg.id}
                      </span>
                      {isConfirmed && <Badge variant="success">Confirmed Ticket</Badge>}
                      {isWaitlisted && <Badge variant="warning">Waitlisted</Badge>}
                      {isCancelled && <Badge variant="neutral">Cancelled</Badge>}
                    </div>

                    <Link href={`/events/${reg.eventId}`}>
                      <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 hover:text-campus-navy-700 dark:hover:text-campus-gold-400 transition leading-snug">
                        {reg.eventTitle}
                      </h3>
                    </Link>

                    {/* Attendee Info */}
                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <p>
                        Attendee: <strong>{reg.userName}</strong> ({reg.userDept} - Batch {reg.userBatch})
                      </p>
                      <p className="text-slate-500">
                        Registered on: {formatDhakaDateTime(reg.createdAt)}
                      </p>
                      {reg.checkedIn && (
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Checked in at venue ({formatDhakaDateTime(reg.checkedInAt || "")})</span>
                        </p>
                      )}
                    </div>

                    {/* QR Code Section (Only for confirmed active passes) */}
                    {isConfirmed && !isCancelled && (
                      <div className="my-5 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                        <QRCodeDisplay value={reg.qrToken} size={160} />
                        <p className="mt-2 text-[10px] font-mono text-slate-500 text-center">
                          {reg.qrToken}
                        </p>
                        <p className="text-[11px] text-slate-400 text-center mt-1">
                          Present this digital pass at the entrance scanner
                        </p>
                      </div>
                    )}

                    {isWaitlisted && (
                      <div className="my-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">Currently on Waitlist</strong>
                          <span>
                            If an existing registrant cancels, your pass will automatically upgrade to confirmed and generate an entrance QR code.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <Link
                      href={`/events/${reg.eventId}`}
                      className="text-xs font-semibold text-campus-navy-700 dark:text-campus-gold-400 hover:underline flex items-center gap-1"
                    >
                      <span>Event Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {!isCancelled && !reg.checkedIn && (
                      <button
                        onClick={() => handleCancel(reg)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 dark:hover:text-rose-400 transition"
                      >
                        Cancel Ticket
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
