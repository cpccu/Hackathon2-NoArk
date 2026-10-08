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
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  Users,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Clock,
  Sparkles,
} from "lucide-react";

interface UnansweredQuestion {
  id: string;
  question: string;
  timestamp: string;
  userLanguage?: string;
}

const FALLBACK_UNANSWERED: UnansweredQuestion[] = [
  { id: "uq-1", question: "What is the campus shuttle timing during the Ramadan trimester?", timestamp: "2026-10-07T14:30:00+06:00", userLanguage: "en" },
  { id: "uq-2", question: "ডিপ্লোমা ইন ইঞ্জিনিয়ারিং পাস করা শিক্ষার্থীরা কি ক্রেডিট ছাড় পাবে?", timestamp: "2026-10-06T11:15:00+06:00", userLanguage: "bn" },
  { id: "uq-3", question: "How can female students apply for campus adjacent residential hostel accommodation?", timestamp: "2026-10-05T16:45:00+06:00", userLanguage: "en" },
];

export default function AdminDashboardPage() {
  const { user, profile, role } = useAuth();

  const [unanswered, setUnanswered] = useState<UnansweredQuestion[]>(FALLBACK_UNANSWERED);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUnanswered() {
      try {
        if (!db) return;
        const q = query(collection(db, "unansweredQuestions"), orderBy("timestamp", "desc"), limit(10));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list: UnansweredQuestion[] = [];
          snap.forEach((d) => {
            const data = d.data();
            list.push({
              id: d.id,
              question: data.question || "",
              timestamp: data.timestamp || new Date().toISOString(),
              userLanguage: data.userLanguage || "en",
            });
          });
          setUnanswered(list);
        }
      } catch (e) {
        console.warn("Unanswered questions fetch fallback:", e);
      } finally {
        setLoading(false);
      }
    }
    loadUnanswered();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AppShell>
        <PageHeader
          title="CampusOS System Administration"
          subtitle="Real-time institutional oversight, resource moderation queues, grievance workflows, and AI log analysis."
          badge={
            <Badge variant="gold" size="md">
              Root Authority
            </Badge>
          }
        />

        {/* High-Level Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4 bg-campus-navy-950 text-white border-campus-navy-800">
            <div className="text-xs text-campus-gold-400 font-semibold uppercase">Total Users</div>
            <div className="text-2xl font-bold font-serif mt-1">1,248</div>
            <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>+18% this month</span>
            </div>
          </Card>

          <Card className="p-4 bg-slate-900 text-white border-slate-800">
            <div className="text-xs text-blue-400 font-semibold uppercase">Active Events</div>
            <div className="text-2xl font-bold font-serif mt-1">15</div>
            <div className="text-[11px] text-slate-400 mt-1">Across 12 clubs</div>
          </Card>

          <Card className="p-4 bg-slate-900 text-white border-slate-800">
            <div className="text-xs text-emerald-400 font-semibold uppercase">Registrations</div>
            <div className="text-2xl font-bold font-serif mt-1">842</div>
            <div className="text-[11px] text-slate-400 mt-1">94% Check-in rate</div>
          </Card>

          <Card className="p-4 bg-slate-900 text-white border-slate-800">
            <div className="text-xs text-amber-400 font-semibold uppercase">Pending Resources</div>
            <div className="text-2xl font-bold font-serif mt-1">4</div>
            <div className="text-[11px] text-amber-300 mt-1">Awaiting moderation</div>
          </Card>

          <Card className="p-4 bg-slate-900 text-white border-slate-800">
            <div className="text-xs text-rose-400 font-semibold uppercase">Open Grievances</div>
            <div className="text-2xl font-bold font-serif mt-1">2</div>
            <div className="text-[11px] text-rose-300 mt-1">1 In review</div>
          </Card>

          <Card className="p-4 bg-slate-900 text-white border-slate-800">
            <div className="text-xs text-purple-400 font-semibold uppercase">Items Returned</div>
            <div className="text-2xl font-bold font-serif mt-1">19</div>
            <div className="text-[11px] text-emerald-300 mt-1">82% resolved</div>
          </Card>
        </div>

        {/* Quick Management Consoles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link href="/admin/resources">
            <Card variant="interactive" className="p-6 h-full flex flex-col justify-between hover:border-campus-navy-600 dark:hover:border-campus-gold-400">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    <FileText className="w-5 h-5" />
                  </div>
                  <Badge variant="warning">Action Required</Badge>
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  Resource Moderation Console
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Review student uploaded lecture notes, past exam papers, and assign &ldquo;Verified by Department&rdquo; gold badges.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-campus-navy-700 dark:text-campus-gold-400 font-semibold">
                <span>Manage Study Resources</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/complaints">
            <Card variant="interactive" className="p-6 h-full flex flex-col justify-between hover:border-campus-navy-600 dark:hover:border-campus-gold-400">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <Badge variant="danger">High Priority</Badge>
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  Complaints & Grievance Console
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Update investigation statuses (received &rarr; in_review &rarr; resolved), append official resolution notes, and ensure harassment policy escalations.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-rose-700 dark:text-rose-400 font-semibold">
                <span>Manage Grievances</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>
          </Link>
        </div>

        {/* Operational Analytics & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Chart 1: Event Capacity Utilization */}
          <Card className="p-6">
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-campus-navy-700 dark:text-campus-gold-400" />
              <span>Event Capacity & Registration Volume</span>
            </h3>

            <div className="space-y-4">
              {[
                { name: "CPCCU Hackathon 2026", registered: 120, cap: 120, pct: 100 },
                { name: "Robotics Workshop (ROS2)", registered: 45, cap: 50, pct: 90 },
                { name: "Inter-Uni Debate Fest", registered: 78, cap: 100, pct: 78 },
                { name: "Cybersecurity Hands-on Drill", registered: 40, cap: 40, pct: 100 },
                { name: "Annual Cultural Gala", registered: 210, cap: 250, pct: 84 },
              ].map((ev, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{ev.name}</span>
                    <span className="font-mono text-slate-500">{ev.registered} / {ev.cap} ({ev.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ev.pct >= 100 ? "bg-rose-500" : ev.pct >= 80 ? "bg-campus-gold-500" : "bg-campus-navy-600"
                      }`}
                      style={{ width: `${ev.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chart 2: Academic Department Distribution */}
          <Card className="p-6">
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-campus-navy-700 dark:text-campus-gold-400" />
              <span>Student Engagement by Department</span>
            </h3>

            <div className="space-y-4">
              {[
                { dept: "Computer Science & Engineering (CSE)", count: 520, pct: 42 },
                { dept: "Electrical & Electronic Engineering (EEE)", count: 230, pct: 18 },
                { dept: "Business Administration (BBA)", count: 210, pct: 17 },
                { dept: "Department of Law", count: 140, pct: 11 },
                { dept: "Pharmacy & Public Health", count: 95, pct: 8 },
                { dept: "Textile & Civil Engineering", count: 53, pct: 4 },
              ].map((d, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{d.dept}</span>
                    <span className="font-mono text-slate-500">{d.count} ({d.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-campus-navy-800 dark:bg-campus-gold-400 h-full rounded-full"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Assistant Unanswered Inquiries Log */}
        <Card className="p-6 border-campus-gold-300 dark:border-campus-gold-800/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-campus-gold-500" />
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                Chatbot Unanswered Inquiries Log
              </h3>
            </div>
            <Badge variant="outline" size="sm">
              RAG Guardrail Telemetry
            </Badge>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
            Questions that the Gemini RAG model refused due to missing grounding context in official facts. Admins can update FAQs to answer these in future iterations.
          </p>

          <div className="space-y-3">
            {unanswered.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    &ldquo;{item.question}&rdquo;
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
                  <Badge variant="outline" size="sm">{item.userLanguage?.toUpperCase() || "EN"}</Badge>
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </AppShell>
    </ProtectedRoute>
  );
}
