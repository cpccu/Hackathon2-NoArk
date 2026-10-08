"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { DataNotice } from "@/components/ui/DataNotice";
import { Button } from "@/components/ui/Button";
import { fetchAllBusRoutes, fetchAllBusTrips, calculateNextBus, NextBusResult } from "@/lib/bus";
import { fetchAllEvents } from "@/lib/events";
import { fetchClassUpdates } from "@/lib/updates";
import { fetchDirectoryEntries } from "@/lib/directory";
import { CampusEvent, ClassUpdate, DirectoryEntry } from "@/types/models";
import { formatDhakaDateTime, formatDhakaTime, isDhakaToday } from "@/lib/date";
import {
  Calendar,
  Bus,
  FileText,
  HelpCircle,
  AlertCircle,
  Bell,
  ArrowRight,
  Clock,
  Sparkles,
  CheckSquare,
  Square,
  MessageSquare,
  ExternalLink,
  MapPin,
  Ticket,
} from "lucide-react";

const CHECKLIST_STORAGE_KEY = "campusos_first_week_checklist";

interface ChecklistItem {
  id: string;
  title: string;
  desc: string;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "id_card", title: "Collect Student ID Card", desc: "Visit Admission Office (Ground Floor) with attested photos." },
  { id: "iems_login", title: "Activate iEMS & Student Portal", desc: "Login to iEMS and verify course registrations for this trimester." },
  { id: "bus_route", title: "Select Daily Shuttle Route", desc: "Identify your nearest pickup stop along routes R1 to R5." },
  { id: "dept_group", title: "Join Batch Messenger Broadcast", desc: "Stay connected with class representatives for room updates." },
  { id: "join_club", title: "Explore Campus Clubs", desc: "Connect with CPCCU, Robotics, Debate, or Cultural societies." },
  { id: "exam_rules", title: "Review 75% Attendance Policy", desc: "Read official university examination and waiver criteria." },
];

export default function DashboardPage() {
  const { user, profile, role } = useAuth();
  const { t, language } = useLanguage();

  // Next Bus State
  const [nextBus, setNextBus] = useState<NextBusResult | null>(null);

  // Today & Tomorrow Events
  const [todayEvents, setTodayEvents] = useState<CampusEvent[]>([]);

  // Class Updates
  const [updates, setUpdates] = useState<ClassUpdate[]>([]);

  // Closing Soon Forms
  const [closingForms, setClosingForms] = useState<DirectoryEntry[]>([]);

  // Checklist
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    // Load persisted checklist
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
        if (saved) setCompletedTasks(JSON.parse(saved));
      } catch (e) {
        console.warn("Checklist load error:", e);
      }
    }

    async function loadDashboardData() {
      try {
        // 1. Next Bus
        const [routes, trips] = await Promise.all([fetchAllBusRoutes(), fetchAllBusTrips()]);
        const nb = calculateNextBus(trips, routes, profile?.savedBusRoute || "R1");
        setNextBus(nb);

        // 2. Events
        const allEv = await fetchAllEvents();
        const relevantEvents = allEv.filter((e) => {
          if (isDhakaToday(e.startAt)) return true;
          // or tomorrow
          const target = new Date(e.startAt);
          const now = new Date();
          const diffHours = (target.getTime() - now.getTime()) / (1000 * 60 * 60);
          return diffHours >= 0 && diffHours <= 48;
        });
        setTodayEvents(relevantEvents.slice(0, 3));

        // 3. Class Updates (filtered by user dept if available)
        const allUp = await fetchClassUpdates();
        const filteredUp = allUp.filter((u) => {
          if (!profile?.department) return true;
          return u.department === "All" || u.department === profile.department;
        });
        setUpdates(filteredUp.slice(0, 3));

        // 4. Directory Closing Soon
        const allDir = await fetchDirectoryEntries();
        const now = new Date();
        const urgent = allDir.filter((d) => {
          if (!d.deadline || !d.isOpen) return false;
          const dl = new Date(d.deadline);
          const hours = (dl.getTime() - now.getTime()) / (1000 * 60 * 60);
          return hours > 0 && hours <= 120;
        });
        setClosingForms(urgent.slice(0, 2));
      } catch (err) {
        console.warn("Dashboard data loading error:", err);
      }
    }

    loadDashboardData();
  }, [profile]);

  function toggleChecklist(id: string) {
    setCompletedTasks((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <PageHeader
          title={`Welcome back, ${profile?.name || "Student"}`}
          subtitle={`Department of ${profile?.department || "CSE"} • Batch ${profile?.batch || "50th"}${
            profile?.studentId ? ` • Student ID: ${profile.studentId}` : ""
          }`}
          badge={
            <Badge variant="gold" size="md">
              {role}
            </Badge>
          }
          actions={
            <div className="flex items-center gap-2">
              {role === "student" && (<Link href="/my/events">
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
                  <Ticket className="w-3.5 h-3.5 text-campus-navy-600 dark:text-campus-gold-400" />
                  <span>My QR Passes</span>
                </Button>
              </Link>)}
              <Link href="/assistant">
                <Button variant="primary" size="sm" className="flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Campus AI</span>
                </Button>
              </Link>
            </div>
          }
        />

        <DataNotice
          className="mb-8"
          message="CampusOS is synchronized to Asia/Dhaka time. Notice and schedule changes reflect official department postings."
        />

        {role === "admin" && (
          <div className="mb-8 rounded-xl border border-campus-navy-200 bg-campus-navy-50 p-5">
            <h2 className="font-serif text-lg font-bold text-campus-navy-800">Administrator Console</h2>
            <p className="text-sm text-slate-600 mt-1">Moderate content and resolve student issues.</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/admin/resources" className="rounded-lg bg-white border border-slate-200 p-4 hover:border-campus-navy-600 transition"><div className="text-sm font-semibold">Resource Moderation</div><div className="text-xs text-slate-500 mt-1">Approve, reject or verify uploads</div></Link>
              <Link href="/admin/complaints" className="rounded-lg bg-white border border-slate-200 p-4 hover:border-campus-navy-600 transition"><div className="text-sm font-semibold">Complaints Desk</div><div className="text-xs text-slate-500 mt-1">Add resolution notes and audit trail</div></Link>
              <Link href="/events" className="rounded-lg bg-white border border-slate-200 p-4 hover:border-campus-navy-600 transition"><div className="text-sm font-semibold">All Events</div><div className="text-xs text-slate-500 mt-1">Oversee every club event</div></Link>
            </div>
          </div>
        )}
        {role === "club_admin" && (
          <div className="mb-8 rounded-xl border border-campus-gold-200 bg-campus-gold-50 p-5">
            <h2 className="font-serif text-lg font-bold text-campus-gold-800">Club Executive Panel</h2>
            <p className="text-sm text-slate-600 mt-1">Run your club events: registrations, QR check-in and attendee exports.</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/events" className="rounded-lg bg-white border border-slate-200 p-4 hover:border-campus-gold-600 transition"><div className="text-sm font-semibold">Manage Club Events</div><div className="text-xs text-slate-500 mt-1">Open an event, then use QR Check-in Scanner</div></Link>
              <Link href="/events/evt-hackathon-2026/checkin" className="rounded-lg bg-white border border-slate-200 p-4 hover:border-campus-gold-600 transition"><div className="text-sm font-semibold">Hackathon Check-in</div><div className="text-xs text-slate-500 mt-1">Scan or enter ticket tokens</div></Link>
            </div>
          </div>
        )}


        {/* Live Banner: Next Bus Countdown */}
        {nextBus && (
          <div className="mb-8 bg-gradient-to-r from-campus-navy-950 via-campus-navy-900 to-slate-900 text-white rounded-xl p-5 border border-campus-navy-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-campus-gold-500/20 text-campus-gold-400 border border-campus-gold-500/30">
                  <Bus className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-campus-gold-400">
                      {nextBus.isToday ? "Next Campus Departure Today" : "First Bus Tomorrow Morning"}
                    </span>
                    <Badge variant="warning" size="sm">
                      {nextBus.route.routeNumber}
                    </Badge>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white mt-0.5">
                    {nextBus.route.name} ({nextBus.trip.direction === "to_campus" ? "To Campus" : "From Campus"})
                  </h3>
                  <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                    <span>Departure Time: <strong className="text-campus-gold-300">{nextBus.trip.departureTime}</strong></span>
                    <span>•</span>
                    <span>Via: {nextBus.route.via}</span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-campus-navy-800 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Time Remaining</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-campus-gold-400">
                    {nextBus.minutesRemaining > 0
                      ? `${Math.floor(nextBus.minutesRemaining / 60)}h ${nextBus.minutesRemaining % 60}m`
                      : "Boarding now"}
                  </div>
                </div>
                <Link href="/bus" className="mt-2 text-xs text-campus-gold-400 hover:underline flex items-center gap-1">
                  <span>Full Schedule</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Main Section: Class Updates & Campus Agenda */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Left Column (2 spans): Today/Tomorrow Events & Class Updates */}
          <div className="lg:col-span-2 space-y-8">
            {/* Class Updates Widget */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-campus-navy-700 dark:text-campus-gold-400" />
                  <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                    Schedule Updates ({profile?.department || "CSE"})
                  </h2>
                </div>
                <Link href="/updates" className="text-xs text-campus-navy-700 dark:text-campus-gold-400 font-semibold hover:underline flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {updates.length === 0 ? (
                <Card className="p-4 text-center text-xs text-slate-500">
                  No active schedule changes for your department.
                </Card>
              ) : (
                <div className="space-y-3">
                  {updates.map((u) => (
                    <Card key={u.id} className="p-4 hover:shadow-xs border-l-4 border-l-campus-gold-500">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" size="sm">
                              {u.department} {u.batch ? `• ${u.batch}` : ""}
                            </Badge>
                            <Badge variant={u.kind === "class_cancelled" ? "danger" : "warning"} size="sm">
                              {u.kind === "class_cancelled" ? "Cancelled" : "Rescheduled"}
                            </Badge>
                            {u.source === "demo" && <DemoBadge />}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {u.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                            {u.body}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                          {formatDhakaTime(u.effectiveAt)}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Today and Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-campus-navy-700 dark:text-campus-gold-400" />
                  <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                    Upcoming Campus Events
                  </h2>
                </div>
                <Link href="/events" className="text-xs text-campus-navy-700 dark:text-campus-gold-400 font-semibold hover:underline flex items-center gap-1">
                  <span>Browse Events</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {todayEvents.length === 0 ? (
                <Card className="p-4 text-center text-xs text-slate-500">
                  No campus events scheduled for the next 48 hours.
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {todayEvents.map((ev) => (
                    <Link key={ev.id} href={`/events/${ev.id}`}>
                      <Card variant="interactive" className="h-full p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="default" size="sm">{ev.clubName}</Badge>
                            <span className="text-[11px] text-campus-navy-700 dark:text-campus-gold-400 font-semibold">
                              {formatDhakaDateTime(ev.startAt)}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                            {ev.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {ev.location}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-campus-navy-700 dark:text-campus-gold-400 flex items-center justify-between">
                          <span>Register Seat</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Closing Soon Forms (Directory) */}
            {closingForms.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      Forms & Registrations Closing Soon
                    </h3>
                  </div>
                  <Link href="/directory" className="text-xs text-amber-800 dark:text-amber-300 underline">
                    All Forms
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {closingForms.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 hover:border-amber-500 transition text-xs"
                    >
                      <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-amber-800 dark:text-amber-400 mt-1">
                        Closes: {formatDhakaDateTime(item.deadline!)}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (1 span): First-Week Orientation Checklist */}
          <div className={`space-y-6 ${role !== "student" ? "hidden" : ""}`}>
            <Card className="p-5 border-campus-navy-200 dark:border-campus-navy-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-campus-gold-500" />
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                    Orientation Checklist
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-campus-navy-700 dark:text-campus-gold-400">
                  {completedTasks.length} / {DEFAULT_CHECKLIST.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-campus-gold-500 h-full transition-all duration-300"
                  style={{ width: `${(completedTasks.length / DEFAULT_CHECKLIST.length) * 100}%` }}
                />
              </div>

              <div className="space-y-3">
                {DEFAULT_CHECKLIST.map((task) => {
                  const isDone = completedTasks.includes(task.id);
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleChecklist(task.id)}
                      className={`w-full text-left p-2.5 rounded-lg border transition flex items-start gap-2.5 ${
                        isDone
                          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-slate-400"
                          : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-campus-navy-400"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0 text-campus-navy-700 dark:text-campus-gold-400">
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-xs font-bold ${
                            isDone
                              ? "line-through text-slate-500 dark:text-slate-400"
                              : "text-slate-900 dark:text-slate-100"
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {task.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Quick Actions Card */}
            <Card className="p-5">
              <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100 mb-3">
                Direct Services
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/lost-found/new"
                  className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-300 text-center transition"
                >
                  Report Lost Item
                </Link>
                <Link
                  href="/complaints/new"
                  className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-300 text-center transition"
                >
                  File Grievance
                </Link>
                <Link
                  href="/resources/upload"
                  className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-300 text-center transition"
                >
                  Upload Notes
                </Link>
                <Link
                  href="/helpdesk/contacts"
                  className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-300 text-center transition"
                >
                  Emergency Contacts
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Hub Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Link href="/events" className="group">
            <Card variant="interactive" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-campus-navy-100 dark:bg-campus-navy-900 text-campus-navy-800 dark:text-campus-gold-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <Badge variant="default">Events</Badge>
                </div>
                <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-campus-navy-700 dark:group-hover:text-campus-gold-400 transition">
                  {t.events.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Browse verified club workshops, contests, and register with instant QR pass issuance.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-campus-navy-700 dark:text-campus-gold-400 font-semibold">
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link href="/bus" className="group">
            <Card variant="interactive" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    <Bus className="w-5 h-5" />
                  </div>
                  <Badge variant="warning">Bus Schedule</Badge>
                </div>
                <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-campus-navy-700 dark:group-hover:text-campus-gold-400 transition">
                  {t.bus.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Permanent campus shuttle schedules with live countdown to your next departure.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-700 dark:text-blue-400 font-semibold">
                <span>View Timetable</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link href="/resources" className="group">
            <Card variant="interactive" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    <FileText className="w-5 h-5" />
                  </div>
                  <Badge variant="success">Resource Hub</Badge>
                </div>
                <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-campus-navy-700 dark:group-hover:text-campus-gold-400 transition">
                  {t.resources.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Search lecture notes, question archives, and lab manuals organized by department and course code.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>Access Repository</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link href="/helpdesk" className="group">
            <Card variant="interactive" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <Badge variant="default">Helpdesk</Badge>
                </div>
                <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-campus-navy-700 dark:group-hover:text-campus-gold-400 transition">
                  {t.helpdesk.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Authoritative guides on tuition waivers, semester fees, exams, and AI campus advisor.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-purple-700 dark:text-purple-400 font-semibold">
                <span>Open Helpdesk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link href="/lost-found" className="group">
            <Card variant="interactive" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <Badge variant="warning">Lost & Found</Badge>
                </div>
                <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-campus-navy-700 dark:group-hover:text-campus-gold-400 transition">
                  Lost & Found Center
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Report missing items or claim discovered belongings using security verification questions.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-semibold">
                <span>Check Registry</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link href="/complaints" className="group">
            <Card variant="interactive" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                    <Bell className="w-5 h-5" />
                  </div>
                  <Badge variant="danger">Grievance</Badge>
                </div>
                <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-campus-navy-700 dark:group-hover:text-campus-gold-400 transition">
                  Confidential Complaint Box
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Submit confidential feedback with tracking ID (CU-2026-XXXXXX) and status timeline.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-rose-700 dark:text-rose-400 font-semibold">
                <span>Submit Grievance</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
