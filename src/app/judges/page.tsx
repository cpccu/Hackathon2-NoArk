"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DemoBadge } from "@/components/ui/DemoBadge";
import {
  Award,
  CheckCircle2,
  ExternalLink,
  Shield,
  User,
  Users,
  Compass,
  Zap,
  ArrowRight,
  BookOpen,
  Bus,
  Calendar,
  AlertTriangle,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function JudgesPortalPage() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        <PageHeader
          title="Judges' Evaluation Portal & Live Walkthrough"
          subtitle="Guided 2-minute rubric evaluation path for CPCCU AI-Powered Web App Development & Deployment Hackathon 2026."
          actions={
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/cpccu/Hackathon2-NoArk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
              <Link href="/dashboard">
                <Button variant="gold" size="sm">
                  Go to Student Hub
                </Button>
              </Link>
            </div>
          }
        />

        {/* 1. Evaluation Credentials Block */}
        <Card className="border-2 border-campus-navy-300 dark:border-campus-navy-800 bg-white dark:bg-slate-900 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-campus-gold-600 dark:text-campus-gold-400" />
              <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                1. Demo Evaluation Credentials (By Role)
              </h2>
            </div>
            <Badge variant="official">All Free-Tier Gated</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Student */}
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase tracking-wider text-campus-navy-800 dark:text-campus-gold-400">
                  Student Role
                </span>
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <div className="font-mono space-y-1 mb-2">
                <p>student@cityuniversity.edu.bd</p>
                <p className="text-slate-500">CampusOS@2026</p>
              </div>
              <p className="text-[11px] text-slate-500">
                Ticket registration, QR view (`/my/events`), upvoting notes, filing complaints.
              </p>
            </div>

            {/* Club Executive */}
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase tracking-wider text-campus-navy-800 dark:text-campus-gold-400">
                  Club Executive
                </span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <div className="font-mono space-y-1 mb-2">
                <p>cpc.admin@cityuniversity.edu.bd</p>
                <p className="text-slate-500">CampusOS@2026</p>
              </div>
              <p className="text-[11px] text-slate-500">
                Camera QR check-in scanner (`/events/[id]/checkin`), attendee CSV export, event creation.
              </p>
            </div>

            {/* Administrator */}
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase tracking-wider text-campus-navy-800 dark:text-campus-gold-400">
                  System Admin
                </span>
                <Shield className="w-4 h-4 text-slate-400" />
              </div>
              <div className="font-mono space-y-1 mb-2">
                <p>admin@cityuniversity.edu.bd</p>
                <p className="text-slate-500">CampusOS@2026</p>
              </div>
              <p className="text-[11px] text-slate-500">
                Academic resource moderation queue (`/admin/resources`), complaint updates & public notes.
              </p>
            </div>
          </div>
        </Card>

        {/* 2. 2-Minute Guided Evaluation Path */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-campus-navy-700 dark:text-campus-gold-400" />
            <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
              2. Recommended 2-Minute Guided Evaluation Path
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="font-mono font-bold text-campus-gold-600 text-sm">01</span>
              <div>
                <strong className="block text-slate-900 dark:text-slate-100 mb-0.5">
                  Events & QR Passes: <Link href="/events" className="text-campus-navy-700 dark:text-campus-gold-400 underline">/events</Link> → <Link href="/my/events" className="text-campus-navy-700 dark:text-campus-gold-400 underline">/my/events</Link>
                </strong>
                <p className="text-xs text-slate-500">
                  Register for any workshop, immediately view your rendered QR pass on `/my/events`, and test organizer scanner on `/events/evt-cpc-programming-camp/checkin`.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="font-mono font-bold text-campus-gold-600 text-sm">02</span>
              <div>
                <strong className="block text-slate-900 dark:text-slate-100 mb-0.5">
                  Bus Routes & Dhaka-Time Countdown: <Link href="/bus" className="text-campus-navy-700 dark:text-campus-gold-400 underline">/bus</Link>
                </strong>
                <p className="text-xs text-slate-500">
                  Search &ldquo;Mirpur&rdquo; or &ldquo;Uttara&rdquo;. Notice the real-time next-bus departure countdown strictly computed against Asia/Dhaka standard time with next-day fallback.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="font-mono font-bold text-campus-gold-600 text-sm">03</span>
              <div>
                <strong className="block text-slate-900 dark:text-slate-100 mb-0.5">
                  Grounded AI Assistant: <Link href="/assistant" className="text-campus-navy-700 dark:text-campus-gold-400 underline">/assistant</Link> or Floating Widget
                </strong>
                <p className="text-xs text-slate-500">
                  Ask in English or বাংলা: &ldquo;Golden GPA 5 পেলে ওয়েভার কত?&rdquo;. The AI cites official rules and strictly refuses out-of-scope queries with helpline (09643-234234).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="font-mono font-bold text-campus-gold-600 text-sm">04</span>
              <div>
                <strong className="block text-slate-900 dark:text-slate-100 mb-0.5">
                  Resource Hub & Moderation: <Link href="/resources" className="text-campus-navy-700 dark:text-campus-gold-400 underline">/resources</Link> → <Link href="/admin/resources" className="text-campus-navy-700 dark:text-campus-gold-400 underline">/admin/resources</Link>
                </strong>
                <p className="text-xs text-slate-500">
                  Search course code &ldquo;CSE 2101&rdquo;, test transaction upvoting, inspect PDF preview, and generate bilingual AI summaries.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="font-mono font-bold text-campus-gold-600 text-sm">05</span>
              <div>
                <strong className="block text-slate-900 dark:text-slate-100 mb-0.5">
                  Complaints Tracking & Lost-Found Claims: <Link href="/complaints/track?id=CU-2026-784912" className="text-campus-navy-700 dark:text-campus-gold-400 underline">/complaints/track</Link> & <Link href="/lost-found" className="text-campus-navy-700 dark:text-campus-gold-400 underline">/lost-found</Link>
                </strong>
                <p className="text-xs text-slate-500">
                  Inspect the public timeline audit trail for grievance `CU-2026-784912` and test &ldquo;This is mine&rdquo; verification claim flow.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. Judging Criteria Mapping Table (100 Marks) */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-campus-gold-600 dark:text-campus-gold-400" />
            <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
              3. Judging Criteria Mapping Table (100 Marks)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                  <th className="py-2.5 px-3 font-semibold">Criterion</th>
                  <th className="py-2.5 px-3 font-semibold">Marks</th>
                  <th className="py-2.5 px-3 font-semibold">How Campus-OS Satisfies It</th>
                  <th className="py-2.5 px-3 font-semibold">Where to Verify</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                    Problem Understanding
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold">15</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    Directly addresses all 6 City University student frictions: fragmented messenger notices, bus timing panic, scattered study notes, unmonitored lost items, unrecorded grievances.
                  </td>
                  <td className="py-2.5 px-3">
                    <Link href="/dashboard" className="text-campus-navy-700 dark:text-campus-gold-400 underline">Dashboard</Link> & README
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                    Innovation & Value
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold">20</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    Grounded Gemini RAG with zero-hallucination guardrails, camera QR ticket check-in scanner with CSV export, real-time Dhaka-time bus countdown, automated ownership claim matching.
                  </td>
                  <td className="py-2.5 px-3">
                    <Link href="/assistant" className="text-campus-navy-700 dark:text-campus-gold-400 underline">/assistant</Link>, <Link href="/bus" className="text-campus-navy-700 dark:text-campus-gold-400 underline">/bus</Link>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                    Functionality & Completeness
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold">25</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    All core modules functional end-to-end: Auth, Events, Tickets, Bus, Helpdesk, Gemini Assistant, Resource Hub with uploads & moderation, Lost & Found with claims, Complaints with tracking.
                  </td>
                  <td className="py-2.5 px-3">
                    Every navigation tab
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                    UI/UX & Accessibility
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold">15</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    Editorial academic design system, native dark/light mode toggle, instant English/Bangla language switch, responsive mobile drawer, WCAG AA contrast.
                  </td>
                  <td className="py-2.5 px-3">
                    Header switches & theme
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                    Technical Implementation
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold">15</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    Next.js 14 App Router, TypeScript strict mode, Cloud Firestore rules, 100% free-tier architecture (Zero Cost guarantee), Cloudinary file pipeline, clean git history.
                  </td>
                  <td className="py-2.5 px-3">
                    <a href="https://github.com/cpccu/Hackathon2-NoArk" target="_blank" rel="noopener noreferrer" className="text-campus-navy-700 dark:text-campus-gold-400 underline">GitHub Codebase</a>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                    Presentation & Integrity
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold">10</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    Rigorous labeling: every record carries `source: official | demo`, demo data badges everywhere, zero dead buttons, persistent disclaimer notices.
                  </td>
                  <td className="py-2.5 px-3">
                    All pages & badges
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* 4. Student Friction vs Feature Resolution Matrix */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-campus-gold-600 dark:text-campus-gold-400" />
            <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
              4. Six Student Frictions Solved by Campus-OS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                1. Missed Events & Deadlines
              </span>
              <p className="text-slate-500 mb-2">
                Unified cross-club feed across all 12 clubs, seat reservation with waitlist, Google Calendar export, and .ICS downloads.
              </p>
              <Link href="/events" className="text-campus-navy-700 dark:text-campus-gold-400 font-semibold underline">
                Test /events →
              </Link>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                2. Bus Timetable Panic
              </span>
              <p className="text-slate-500 mb-2">
                5 routes (R1–R5), instant stop search, and real-time next-bus departure countdown synchronized with Asia/Dhaka time.
              </p>
              <Link href="/bus" className="text-campus-navy-700 dark:text-campus-gold-400 font-semibold underline">
                Test /bus →
              </Link>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                3. Scattered Academic Notes
              </span>
              <p className="text-slate-500 mb-2">
                Searchable Resource Hub with course code filtering (&ldquo;CSE 2101&rdquo;), upvoting, PDF viewer, and Gemini AI summarizer.
              </p>
              <Link href="/resources" className="text-campus-navy-700 dark:text-campus-gold-400 font-semibold underline">
                Test /resources →
              </Link>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                4. Lost Items with No Recovery
              </span>
              <p className="text-slate-500 mb-2">
                Lost & Found board with verification question protection and an interactive &ldquo;This is mine&rdquo; claim approval workflow.
              </p>
              <Link href="/lost-found" className="text-campus-navy-700 dark:text-campus-gold-400 font-semibold underline">
                Test /lost-found →
              </Link>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                5. Unheard Grievances & Bureaucracy
              </span>
              <p className="text-slate-500 mb-2">
                Anonymous grievance box generating tracking IDs (`CU-2026-XXXXXX`) with timestamped public resolution timeline.
              </p>
              <Link href="/complaints/track?id=CU-2026-784912" className="text-campus-navy-700 dark:text-campus-gold-400 font-semibold underline">
                Test /complaints/track →
              </Link>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                6. No Central Information Portal
              </span>
              <p className="text-slate-500 mb-2">
                Smart Helpdesk with official waiver policy tables, exam rules, 09643-234234 hotlines, and Gemini RAG Chatbot.
              </p>
              <Link href="/helpdesk" className="text-campus-navy-700 dark:text-campus-gold-400 font-semibold underline">
                Test /helpdesk →
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
