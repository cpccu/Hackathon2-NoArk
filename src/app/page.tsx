"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Bus,
  FileText,
  HelpCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Phone,
} from "lucide-react";

export default function HomePage() {
  const { user, profile } = useAuth();

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Academic Banner */}
      <header className="bg-campus-navy-900 text-white border-b border-campus-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-white p-2 shadow"><img src="/logo.png" alt="City University" className="h-14 w-auto" /></div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block">City University</span>
              <span className="text-xs uppercase tracking-widest text-campus-gold-400 font-semibold">
                CampusOS Portal
              </span>
            </div>
          </div>

          <nav className="flex items-center space-x-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-campus-gold-500 hover:bg-campus-gold-400 text-campus-navy-950 text-xs sm:text-sm font-semibold transition shadow-sm"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:bg-campus-navy-800 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-2 rounded-md bg-campus-gold-500 hover:bg-campus-gold-400 text-campus-navy-950 text-xs sm:text-sm font-semibold transition shadow-sm"
                >
                  Student Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-campus-navy-950 via-campus-navy-900 to-campus-navy-800 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-campus-navy-800 border border-campus-navy-700 text-campus-gold-400 text-xs font-medium uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4" /> Official City University Digital Campus
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-slate-100">
            Creating a Culture of Excellence.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The single source of truth for campus life at City University. Unifying club events,
            real-time shuttle bus countdowns, academic resources, instant class updates, and smart student helpdesk.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-md bg-campus-gold-500 hover:bg-campus-gold-400 text-campus-navy-950 font-semibold text-sm transition shadow-md flex items-center gap-2"
              >
                Access Student Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-6 py-3 rounded-md bg-campus-gold-500 hover:bg-campus-gold-400 text-campus-navy-950 font-semibold text-sm transition shadow-md flex items-center gap-2"
                >
                  Create Student Account <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-md border border-slate-600 bg-campus-navy-800/80 hover:bg-campus-navy-800 text-slate-200 text-sm font-medium transition"
                >
                  Sign In to CampusOS
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Six Core Frictions Solved */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Built Specifically for City University
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Directly addressing the six daily campus frictions with dedicated, real-time modules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-campus-navy-400 transition">
              <div className="w-10 h-10 rounded-md bg-campus-navy-50 text-campus-navy-700 flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Unified Event Feed</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Discover workshops and competitions across all 12 clubs. Instant seat reservation with waitlist support and QR ticket passes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-campus-navy-400 transition">
              <div className="w-10 h-10 rounded-md bg-campus-navy-50 text-campus-navy-700 flex items-center justify-center mb-4">
                <Bus className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Campus Bus & Countdown</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Gabtoli, Mirpur, Uttara & Dhanmondi shuttle routes with live Asia/Dhaka next-bus countdown and favourite stop saving.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-campus-navy-400 transition">
              <div className="w-10 h-10 rounded-md bg-campus-navy-50 text-campus-navy-700 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Academic Resource Hub</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Course notes, question papers, and lab manuals organized by department & semester. Upvotes and AI bilingual summaries.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-campus-navy-400 transition">
              <div className="w-10 h-10 rounded-md bg-campus-navy-50 text-campus-navy-700 flex items-center justify-center mb-4">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Smart Helpdesk & Chatbot</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Official waiver policies, tuition calculator, exam rules, and an AI campus advisor grounded in verified facts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-campus-navy-400 transition">
              <div className="w-10 h-10 rounded-md bg-campus-navy-50 text-campus-navy-700 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Lost & Found Verification</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Claim verification questions protect valuable items before student contact details are shared.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-campus-navy-400 transition">
              <div className="w-10 h-10 rounded-md bg-campus-navy-50 text-campus-navy-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Confidential Complaints</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Anonymous grievance box with tracking IDs (CU-2026-XXXXXX) and timestamped administration responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Official University Footer */}
      <footer className="mt-auto bg-campus-navy-950 text-white border-t border-campus-navy-800 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="rounded bg-white p-1 shadow"><img src="/logo-mark.png" alt="City University" className="h-7 w-auto" /></div>
              <span className="font-serif font-bold text-sm text-slate-100">City University</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Khagan, Birulia, Savar, Dhaka-1340, Bangladesh.<br />
              Telephone: 09643-234234 | Cell: +8801322917670-73
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-3">Official University Links</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a href="https://cityuniversity.ac.bd" target="_blank" rel="noreferrer" className="hover:text-campus-gold-400 flex items-center gap-1">
                  cityuniversity.ac.bd <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://iems.cityuniversity.ac.bd/" target="_blank" rel="noreferrer" className="hover:text-campus-gold-400 flex items-center gap-1">
                  iEMS Student Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://outlook.office.com/" target="_blank" rel="noreferrer" className="hover:text-campus-gold-400 flex items-center gap-1">
                  Webmail <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://cityuniversity.ac.bd/iqac" target="_blank" rel="noreferrer" className="hover:text-campus-gold-400 flex items-center gap-1">
                  IQAC <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-3">CampusOS System</h4>
            <p className="text-slate-400 leading-relaxed">
              Developed for CPCCU AI-Powered Web App Hackathon 2026.
              Fully compliant with zero-cost free-tier architecture and Asia/Dhaka timezone.
            </p>
            <p className="mt-3 text-campus-gold-400 font-medium">
              &copy; {new Date().getFullYear()} City University CampusOS. MIT Licensed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
