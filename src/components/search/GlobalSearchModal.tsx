"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Calendar, Bus, FileText, HelpCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SearchResultItem {
  id: string;
  category: "Events" | "Bus" | "Resources" | "Helpdesk" | "Lost & Found" | "Updates";
  title: string;
  subtitle: string;
  href: string;
}

// Client-side grounded dataset for instant, zero-quota search
const SEARCH_DATABASE: SearchResultItem[] = [
  { id: "e1", category: "Events", title: "CPCCU Hackathon 2026", subtitle: "Main Auditorium • 8 Oct", href: "/events" },
  { id: "e2", category: "Events", title: "Robotics Workshop on ROS2", subtitle: "CSE Lab 3 • Robotics Club", href: "/events" },
  { id: "e3", category: "Events", title: "Inter-University Debate Fest", subtitle: "Seminar Hall • Debate Society", href: "/events" },
  { id: "b1", category: "Bus", title: "Route 1: Gabtoli ↔ Campus", subtitle: "Departs Gabtoli: 07:00, 08:00, 09:00", href: "/bus" },
  { id: "b2", category: "Bus", title: "Route 2: Mirpur-10 ↔ Campus", subtitle: "Via Mirpur-1 & Gabtoli", href: "/bus" },
  { id: "b3", category: "Bus", title: "Route 3: Uttara ↔ Campus", subtitle: "Departs Abdullahpur: 06:30, 07:30", href: "/bus" },
  { id: "b4", category: "Bus", title: "Route 4: Dhanmondi (Asad Gate) ↔ Campus", subtitle: "Departs 07:00 via Gabtoli", href: "/bus" },
  { id: "b5", category: "Bus", title: "Route 5: Savar / Nabinagar Shuttle", subtitle: "Runs every 30 mins", href: "/bus" },
  { id: "r1", category: "Resources", title: "CSE 2101: Data Structures Notes", subtitle: "Department of CSE • Semester 3", href: "/resources" },
  { id: "r2", category: "Resources", title: "EEE 1101: Electrical Circuits Lab Manual", subtitle: "Department of EEE • Semester 1", href: "/resources" },
  { id: "r3", category: "Resources", title: "CSE 3105: Algorithm Midterm Papers", subtitle: "Department of CSE • 2025 Archive", href: "/resources" },
  { id: "h1", category: "Helpdesk", title: "Undergraduate Waiver Policy (SSC & HSC)", subtitle: "Golden GPA 5.00 gets 100% waiver", href: "/helpdesk" },
  { id: "h2", category: "Helpdesk", title: "Admission Eligibility & Requirements", subtitle: "Minimum GPA 2.5 in SSC and HSC", href: "/helpdesk" },
  { id: "h3", category: "Helpdesk", title: "Tuition Fees & Credit Calculation", subtitle: "CSE/EEE, BBA, Pharmacy fee structure", href: "/helpdesk" },
  { id: "h4", category: "Helpdesk", title: "Exam Logistics & 75% Attendance Rule", subtitle: "Midterm & Final exam regulations", href: "/helpdesk" },
  { id: "l1", category: "Lost & Found", title: "Lost: Student ID Card (CSE Batch 50)", subtitle: "Reported near Cafeteria", href: "/lost-found" },
  { id: "l2", category: "Lost & Found", title: "Found: Scientific Calculator (fx-991EX)", subtitle: "Found in Room 402", href: "/lost-found" },
  { id: "u1", category: "Updates", title: "Fall-2026 Course Registration Notice", subtitle: "Registrar Office announcement", href: "/updates" },
];

export const GlobalSearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? SEARCH_DATABASE.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_DATABASE.slice(0, 6);

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  const getCategoryIcon = (category: SearchResultItem["category"]) => {
    switch (category) {
      case "Events":
        return <Calendar className="w-4 h-4 text-campus-gold-600" />;
      case "Bus":
        return <Bus className="w-4 h-4 text-blue-600" />;
      case "Resources":
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case "Helpdesk":
        return <HelpCircle className="w-4 h-4 text-purple-600" />;
      case "Lost & Found":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case "Updates":
        return <ArrowRight className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24">
        <div
          className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Box */}
          <div className="relative border-b border-slate-200 dark:border-slate-800 flex items-center px-4">
            <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, bus stops, courses, waivers, lost items..."
              className="w-full py-4 text-base bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2"
              aria-label="Close search"
            >
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded">
                ESC
              </kbd>
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                No matching results found for &ldquo;{query}&rdquo;.
              </div>
            ) : (
              <div className="space-y-1">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.href)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-campus-navy-700 dark:group-hover:text-campus-gold-400">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Navigate with instant zero-quota client index</span>
            <span>Asia/Dhaka Standard Time</span>
          </div>
        </div>
      </div>
    </div>
  );
};
