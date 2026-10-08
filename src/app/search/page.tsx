"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import {
  Search,
  Calendar,
  Bus,
  FileText,
  HelpCircle,
  AlertCircle,
  Globe,
  Bell,
  ArrowRight,
} from "lucide-react";

interface SearchIndexItem {
  id: string;
  category: "Events" | "Bus" | "Resources" | "Helpdesk" | "Lost & Found" | "Updates" | "Directory";
  title: string;
  subtitle: string;
  href: string;
  tags?: string[];
}

const EXTENDED_INDEX: SearchIndexItem[] = [
  // Events
  { id: "e1", category: "Events", title: "CPCCU Hackathon 2026", subtitle: "Main Auditorium • 8 Oct", href: "/events", tags: ["cpc", "hackathon", "contest", "coding"] },
  { id: "e2", category: "Events", title: "Robotics Workshop on ROS2", subtitle: "CSE Lab 3 • Robotics Club", href: "/events", tags: ["robotics", "ros", "workshop"] },
  { id: "e3", category: "Events", title: "Inter-University Debate Championship", subtitle: "Seminar Hall • Debate Society", href: "/events", tags: ["debate", "cuds", "speech"] },
  { id: "e4", category: "Events", title: "Cybersecurity Hands-on Drill", subtitle: "Lab 2 • CSE Club", href: "/events", tags: ["security", "ctf", "ethical hacking"] },
  { id: "e5", category: "Events", title: "Annual Cultural Gala & Fresher Reception", subtitle: "Open Amphitheatre • Cultural Club", href: "/events", tags: ["music", "drama", "cultural"] },
  // Bus
  { id: "b1", category: "Bus", title: "Route 1 (R1): Gabtoli ↔ Campus", subtitle: "Via Savar Bus Stand • Departs 07:00, 08:00, 09:00", href: "/bus", tags: ["gabtoli", "bus", "transport", "shuttle", "savar"] },
  { id: "b2", category: "Bus", title: "Route 2 (R2): Mirpur-10 ↔ Campus", subtitle: "Via Mirpur-1 & Gabtoli • Departs 06:45, 07:45", href: "/bus", tags: ["mirpur", "bus", "transport", "shuttle"] },
  { id: "b3", category: "Bus", title: "Route 3 (R3): Uttara (Abdullahpur) ↔ Campus", subtitle: "Via Ashulia • Departs 06:30, 07:30", href: "/bus", tags: ["uttara", "abdullahpur", "ashulia", "bus", "shuttle"] },
  { id: "b4", category: "Bus", title: "Route 4 (R4): Dhanmondi (Asad Gate) ↔ Campus", subtitle: "Via Gabtoli • Departs 07:00", href: "/bus", tags: ["dhanmondi", "asad gate", "bus"] },
  { id: "b5", category: "Bus", title: "Route 5 (R5): Savar / Nabinagar Local Shuttle", subtitle: "Every 30 mins • 07:30 to 18:00", href: "/bus", tags: ["savar", "nabinagar", "shuttle", "bus"] },
  // Resources
  { id: "r1", category: "Resources", title: "CSE 2101: Data Structures Lecture Slides & Notes", subtitle: "Department of CSE • Trimester Fall", href: "/resources", tags: ["cse 2101", "data structures", "slides", "cse"] },
  { id: "r2", category: "Resources", title: "CSE 3105: Algorithm Design & Analysis Midterm Papers", subtitle: "Department of CSE • Archive", href: "/resources", tags: ["cse 3105", "algorithm", "question paper"] },
  { id: "r3", category: "Resources", title: "EEE 1101: Electrical Circuits I Lab Manual", subtitle: "Department of EEE • Semester 1", href: "/resources", tags: ["eee 1101", "circuits", "lab manual", "eee"] },
  { id: "r4", category: "Resources", title: "BBA 2201: Principles of Financial Accounting Slides", subtitle: "Faculty of Business Administration", href: "/resources", tags: ["bba 2201", "accounting", "bba"] },
  { id: "r5", category: "Resources", title: "LAW 1103: Constitutional Law of Bangladesh Notes", subtitle: "Department of Law", href: "/resources", tags: ["law 1103", "constitution", "law"] },
  // Helpdesk
  { id: "h1", category: "Helpdesk", title: "Undergraduate Tuition Waiver Policy Matrix", subtitle: "Golden GPA 5.00 (100% waiver) & criteria", href: "/helpdesk/fees", tags: ["waiver", "scholarship", "gpa 5", "discount"] },
  { id: "h2", category: "Helpdesk", title: "Admission Eligibility, Requirements & Steps", subtitle: "Minimum GPA 2.5 SSC & HSC • Document checklist", href: "/helpdesk/admission", tags: ["admission", "eligibility", "requirements", "apply"] },
  { id: "h3", category: "Helpdesk", title: "Examination Protocol & 75% Attendance Rule", subtitle: "Admit cards, make-up exam window", href: "/helpdesk/exams", tags: ["attendance", "75%", "exam", "admit card"] },
  { id: "h4", category: "Helpdesk", title: "Official Telephone & Hotline Directory", subtitle: "Exchange 09643-234234 • Queries +8801322917670", href: "/helpdesk/contacts", tags: ["phone", "contact", "hotline", "office"] },
  // Lost & Found
  { id: "l1", category: "Lost & Found", title: "Lost: Student ID Card (Batch 50, CSE)", subtitle: "Reported near central cafeteria", href: "/lost-found", tags: ["id card", "lost", "cafeteria"] },
  { id: "l2", category: "Lost & Found", title: "Found: Casio fx-991EX ClassWiz Calculator", subtitle: "Located in Room 402 Academic Building", href: "/lost-found", tags: ["calculator", "casio", "found"] },
  // Updates
  { id: "u1", category: "Updates", title: "CSE 2101: Data Structures Lab Room Shift", subtitle: "Moved to Lab 4 (3rd Floor)", href: "/updates", tags: ["cse 2101", "lab shift", "update"] },
  { id: "u2", category: "Updates", title: "EEE 3105: Microprocessor Lecture Cancellation", subtitle: "Make-up scheduled for Sunday", href: "/updates", tags: ["eee 3105", "cancelled"] },
  // Directory
  { id: "d1", category: "Directory", title: "Integrated Educational Management System (iEMS)", subtitle: "Official Student Ledger & Registration Portal", href: "/directory", tags: ["iems", "portal", "grades", "admit card"] },
  { id: "d2", category: "Directory", title: "Central Library Management System (Kohaa)", subtitle: "Book renew & research catalog", href: "/directory", tags: ["library", "books", "research"] },
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams ? searchParams.get("q") || "" : "";
  const { t } = useLanguage();

  const [query, setQuery] = useState(initialQ);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = EXTENDED_INDEX.filter((item) => {
    if (activeCategory !== "all" && item.category !== activeCategory) {
      return false;
    }
    if (!query.trim()) return true;

    const q = query.toLowerCase();
    const matchTitle = item.title.toLowerCase().includes(q);
    const matchSubtitle = item.subtitle.toLowerCase().includes(q);
    const matchTag = item.tags?.some((t) => t.toLowerCase().includes(q));
    return matchTitle || matchSubtitle || matchTag;
  });

  const getCategoryIcon = (category: SearchIndexItem["category"]) => {
    switch (category) {
      case "Events":
        return <Calendar className="w-4 h-4 text-campus-gold-600 dark:text-campus-gold-400" />;
      case "Bus":
        return <Bus className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "Resources":
        return <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "Helpdesk":
        return <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case "Lost & Found":
        return <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case "Updates":
        return <Bell className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case "Directory":
        return <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Campus Global Search"
        subtitle="Zero-quota indexed search across events, bus routes, course materials, FAQs, and institutional directories."
      />

      {/* Search Input Bar */}
      <div className="relative mb-6">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses (e.g. CSE 2101), bus stops (e.g. Mirpur), waivers, or events..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs focus:outline-none focus:ring-2 focus:ring-campus-navy-600 dark:focus:ring-campus-gold-400 text-sm sm:text-base"
          autoFocus
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {[
          "all",
          "Events",
          "Bus",
          "Resources",
          "Helpdesk",
          "Updates",
          "Directory",
          "Lost & Found",
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeCategory === cat
                ? "bg-campus-navy-950 text-white dark:bg-campus-gold-400 dark:text-slate-950 shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {cat === "all" ? "All Categories" : cat}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-500 text-sm">No campus records matched your search query.</p>
          </Card>
        ) : (
          filtered.map((item) => (
            <Link key={item.id} href={item.href}>
              <Card variant="interactive" className="p-4 flex items-center justify-between gap-4 hover:border-campus-navy-600 dark:hover:border-campus-gold-400 transition">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" size="sm">{item.category}</Badge>
                    </div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-campus-navy-600 dark:text-campus-gold-400 shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </AppShell>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading search...</div>}>
      <SearchPageContent />
    </React.Suspense>
  );
}
