"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { CampusEvent } from "@/types/models";
import { fetchEventById, getEventStatus } from "@/lib/events";
import { registerForEvent } from "@/lib/registrations";
import { formatDhakaDateTime } from "@/lib/date";
import { ArrowLeft, CheckCircle2, AlertCircle, Calendar, MapPin, Users } from "lucide-react";

export default function EventRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { user, profile } = useAuth();
  const { success, error } = useToast();

  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchEventById(eventId);
      setEvent(data);
      setLoading(false);
    }
    if (eventId) load();
  }, [eventId]);

  const handleRegister = async () => {
    if (!event || !user) return;

    setSubmitting(true);
    try {
      const { registration, status } = await registerForEvent(
        event,
        { uid: user.uid, email: user.email || "" },
        profile
      );
      if (status === "waitlisted") {
        success("Event is at capacity. You have been placed on the priority waitlist.");
      } else {
        success("Registration confirmed! Your QR ticket is ready.");
      }
      router.push("/my/events");
    } catch (err: any) {
      console.error("Registration error:", err);
      error(err.message || "Failed to complete registration.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AppShell>
          <div className="max-w-xl mx-auto py-12 text-center text-xs text-slate-500">
            Loading event details...
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute>
        <AppShell>
          <div className="max-w-xl mx-auto py-12 text-center text-xs text-slate-500">
            Event not found.
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  const isFull = event.registeredCount >= event.capacity;

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-2xl mx-auto pb-12">
          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel and return</span>
          </Link>

          <PageHeader
            title="Confirm Event Registration"
            subtitle="Verify your academic profile and reserve your seat."
          />

          <div className="space-y-6">
            {/* Event Summary Card */}
            <Card>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-500">{event.clubName}</span>
                <Badge variant={isFull ? "warning" : "success"}>
                  {isFull ? "Waitlist Active" : "Seats Available"}
                </Badge>
              </div>

              <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {event.title}
              </h2>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-campus-gold-600 shrink-0" />
                  <span>{formatDhakaDateTime(event.startAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    Capacity: {event.registeredCount}/{event.capacity} registered
                  </span>
                </div>
              </div>
            </Card>

            {/* Attendee Details Card */}
            <Card>
              <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                Attendee Student Information
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-md space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <strong className="text-slate-900 dark:text-slate-100">{profile?.name || "Student"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email Address:</span>
                  <span className="text-slate-900 dark:text-slate-100">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department & Batch:</span>
                  <span className="text-slate-900 dark:text-slate-100">
                    {profile?.department || "CSE"} • Batch {profile?.batch || "50th"}
                  </span>
                </div>
                {profile?.studentId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student ID:</span>
                    <span className="text-slate-900 dark:text-slate-100">{profile.studentId}</span>
                  </div>
                )}
              </div>

              {isFull ? (
                <div className="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    The regular capacity has been reached. Confirming will place you on the waitlist.
                    If another attendee cancels, your ticket will automatically be promoted to confirmed.
                  </span>
                </div>
              ) : (
                <div className="mt-4 p-3 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Admission is completely free of charge for City University students.</span>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <Link href={`/events/${eventId}`}>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button
                  variant="gold"
                  onClick={handleRegister}
                  isLoading={submitting}
                  className="font-semibold"
                >
                  {isFull ? "Confirm Waitlist Entry" : "Confirm Seat Reservation"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
