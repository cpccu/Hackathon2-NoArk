"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { CampusEvent } from "@/types/models";
import { fetchEventById, getEventStatus } from "@/lib/events";
import { getUserRegistrations } from "@/lib/registrations";
import { formatDhakaDateTime, formatDhakaTime } from "@/lib/date";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  CalendarPlus,
  Share2,
  QrCode,
  Edit,
  ArrowLeft,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { user, profile, role } = useAuth();
  const { success, error } = useToast();

  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserRegistrations(user.uid)
      .then((regs) =>
        setAlreadyRegistered(
          regs.some((r: any) => r.eventId === eventId && r.status !== "cancelled")
        )
      )
      .catch(() => {});
  }, [user, eventId]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchEventById(eventId);
      setEvent(data);
      setLoading(false);
    }
    if (eventId) {
      load();
    }
  }, [eventId]);

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-4 max-w-4xl mx-auto py-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppShell>
    );
  }

  if (!event) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto py-12">
          <ErrorState
            title="Event Not Found"
            message="The requested campus event may have been rescheduled or removed."
            onRetry={() => router.push("/events")}
          />
        </div>
      </AppShell>
    );
  }

  const status = getEventStatus(event);
  const seatsLeft = Math.max(0, event.capacity - event.registeredCount);
  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const isClubAdminOrAdmin = role === "club_admin" || role === "admin";

  // Google Calendar URL generator with Asia/Dhaka time
  const generateGoogleCalendarUrl = () => {
    const startDate = new Date(event.startAt).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(event.endAt).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description}\n\nOrganized by: ${event.clubName}\nCity University Campus-OS`);
    const location = encodeURIComponent(`${event.location}, City University, Savar, Dhaka`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}&ctz=Asia/Dhaka`;
  };

  // iCalendar (.ics) download
  const handleDownloadICS = () => {
    const startDate = new Date(event.startAt).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(event.endAt).toISOString().replace(/-|:|\.\d\d\d/g, "");

    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//City University//Campus-OS Events//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
      `LOCATION:${event.location}, City University, Savar, Dhaka`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success("Downloaded .ics calendar file with Dhaka time");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Join ${event.title} at City University!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      success("Event link copied to clipboard!");
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto pb-12">
        {/* Back Link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Events</span>
        </Link>

        {/* Header Block */}
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <Badge variant="default">{event.type}</Badge>
            {event.source === "demo" && <DemoBadge size="md" />}
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Organized by <strong>{event.clubName}</strong>
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
            {event.title}
          </h1>
          {event.title_bn && (
            <p className="mt-1 text-sm font-bengali text-slate-500 dark:text-slate-400">
              {event.title_bn}
            </p>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                Event Overview
              </h2>
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>

              {event.description_bn && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm font-bengali text-slate-600 dark:text-slate-400 leading-relaxed">
                  {event.description_bn}
                </div>
              )}
            </Card>

            {/* Quick Logistics */}
            <Card>
              <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
                Schedule & Venue Logistics
              </h2>
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <Calendar className="w-5 h-5 text-campus-gold-600 dark:text-campus-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-slate-100">Date & Time (Asia/Dhaka)</strong>
                    <span>{formatDhakaDateTime(event.startAt)} – {formatDhakaTime(event.endAt)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-5 h-5 text-campus-navy-700 dark:text-campus-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-slate-100">Physical Location</strong>
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-slate-100">Registration Deadline</strong>
                    <span>{formatDhakaDateTime(event.registrationDeadline)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar CTA Card */}
          <div className="space-y-6">
            <Card className="border-2 border-campus-navy-200 dark:border-campus-navy-800">
              <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Seat Reservation
              </h3>

              {/* Progress bar */}
              <div className="space-y-1.5 my-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Seats Taken</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {event.registeredCount} / {event.capacity} ({percentFilled}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all rounded-full ${
                      percentFilled >= 100
                        ? "bg-amber-500"
                        : percentFilled > 80
                        ? "bg-campus-gold-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${percentFilled}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {seatsLeft > 0 ? `${seatsLeft} seats remaining` : "Full capacity reached — waitlist active"}
                </p>
              </div>

              {/* Registration CTA button (leads to registration in Phase 5) */}
              {!isClubAdminOrAdmin && (<Link href={alreadyRegistered ? "/my/events" : `/events/${event.id}/register`} className="block">
                <Button
                  variant={seatsLeft > 0 ? "gold" : "secondary"}
                  className="w-full"
                  disabled={status === "past" || status === "closed"}
                >
                  {alreadyRegistered ? "✓ Registered – View Ticket" : status === "past" ? "Event Concluded"
                    : status === "closed"
                    ? "Registration Closed"
                    : seatsLeft > 0
                    ? "Register Seat (Free)"
                    : "Join Waitlist"}
                </Button>
              </Link>)}

              {/* Calendar export buttons */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <a
                  href={generateGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-campus-gold-600" />
                  <span>Google Calendar</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <button
                  onClick={handleDownloadICS}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-campus-navy-700 dark:text-slate-300" />
                  <span>Download .ICS file</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Event</span>
                </button>
              </div>
            </Card>

            {/* Admin Management Widget */}
            {isClubAdminOrAdmin && (
              <Card className="bg-campus-navy-50/50 dark:bg-campus-navy-950/40 border border-campus-navy-200 dark:border-campus-navy-800">
                <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-campus-navy-800 dark:text-campus-gold-400 mb-3">
                  Organizer Controls
                </h3>
                <div className="space-y-2">
                  <Link href={`/events/${event.id}/checkin`} className="block">
                    <Button variant="primary" size="sm" className="w-full flex items-center justify-center gap-2">
                      <QrCode className="w-4 h-4" />
                      <span>QR Check-in Scanner</span>
                    </Button>
                  </Link>

                  <Link href={`/events/${event.id}/edit`} className="block">
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      <span>Edit Event Details</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
