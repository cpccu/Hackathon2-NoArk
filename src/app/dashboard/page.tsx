"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataNotice } from "@/components/ui/DataNotice";
import {
  Calendar,
  Bus,
  FileText,
  HelpCircle,
  AlertCircle,
  Bell,
  ArrowRight,
  Sparkles,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const { user, profile, role } = useAuth();
  const { t } = useLanguage();

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
        />

        <DataNotice
          className="mb-8"
          message="CampusOS is synchronized to Asia/Dhaka time. Notice and schedule changes reflect official department postings."
        />

        {/* Quick Hub Grid */}
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
