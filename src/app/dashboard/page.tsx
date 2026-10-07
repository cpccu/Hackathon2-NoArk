"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LogOut, User as UserIcon, Shield, Mail, Calendar, Bus, FileText, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { user, profile, role, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Navigation bar */}
        <header className="bg-campus-navy-900 text-white border-b border-campus-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded bg-campus-gold-500 text-campus-navy-950 flex items-center justify-center font-serif font-bold text-sm">
                CU
              </div>
              <span className="font-serif font-bold text-slate-100">CampusOS</span>
            </div>

            <div className="flex items-center space-x-4 text-xs">
              <div className="hidden sm:flex items-center gap-2 bg-campus-navy-800 px-3 py-1.5 rounded-full border border-campus-navy-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-300 font-medium">{profile?.name || user?.email}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-campus-gold-500/20 text-campus-gold-400 border border-campus-gold-500/30">
                  {role}
                </span>
              </div>

              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-campus-navy-800 hover:bg-campus-navy-700 text-slate-200 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-campus-gold-600 font-bold">
                  Active Session
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  Welcome back, {profile?.name || "Student"}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Department of {profile?.department || "CSE"} • Batch {profile?.batch || "50th"}
                  {profile?.studentId && ` • ID: ${profile.studentId}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-campus-navy-50 text-campus-navy-800 border border-campus-navy-200">
                  Role: {role}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded bg-campus-navy-50 text-campus-navy-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <h2 className="font-serif font-bold text-slate-900">Events & Tickets</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse upcoming university club workshops, hackathons, and seminars.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500">Phase 4 module</span>
                <span className="text-campus-gold-600 font-semibold">Configured</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded bg-campus-navy-50 text-campus-navy-700">
                  <Bus className="w-5 h-5" />
                </div>
                <h2 className="font-serif font-bold text-slate-900">Campus Shuttle</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check schedule for Gabtoli, Mirpur, Uttara & Dhanmondi with countdown.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500">Phase 6 module</span>
                <span className="text-campus-gold-600 font-semibold">Configured</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded bg-campus-navy-50 text-campus-navy-700">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="font-serif font-bold text-slate-900">Academic Resources</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Course notes, exam question archives, and lab manuals organized by semester.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500">Phase 9 module</span>
                <span className="text-campus-gold-600 font-semibold">Configured</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
