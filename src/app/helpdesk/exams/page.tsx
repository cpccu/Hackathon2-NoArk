"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, BookOpen, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function ExamsHelpdeskPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        <Link
          href="/helpdesk"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Helpdesk</span>
        </Link>

        <PageHeader
          title="Examination Regulations & Attendance Rules"
          subtitle="Controller of Examinations guidelines for Midterm, Final, and Make-up assessments."
        />

        {/* 75% Attendance Banner */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-sm font-bold mb-1">
              Mandatory 75% Class Attendance Requirement
            </strong>
            <p className="leading-relaxed">
              As per university academic regulations, every student must attend a minimum of 75% of scheduled lectures and laboratory classes in each registered course to be eligible for Midterm and Final Trimester examinations. Students failing this threshold without approved medical leave cannot receive exam admit cards.
            </p>
          </div>
        </div>

        {/* Exam Hall Protocols */}
        <Card>
          <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Hall Entry & Examination Protocols</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <p>
              1. <strong>Student ID & Admit Card:</strong> Students must present a printed valid Admit Card and their physical Student ID Card to the hall invigilator.
            </p>
            <p>
              2. <strong>Reporting Time:</strong> Examinees must enter the hall at least 15 minutes before exam commencement. Entry after 30 minutes is strictly prohibited.
            </p>
            <p>
              3. <strong>Prohibited Devices:</strong> Mobile phones, smartwatches, programmable calculators (unless specifically approved by the course teacher), and unauthorised notes are strictly forbidden.
            </p>
            <p>
              4. <strong>Fee Clearance:</strong> Exam admit cards can be generated from the iEMS portal only after clearing all due trimester tuition installments.
            </p>
          </div>
        </Card>

        {/* Make-up Exam Window */}
        <Card>
          <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-campus-navy-700 dark:text-campus-gold-400" />
            <span>Make-up Examination Policy</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
            If a student is unable to attend an exam due to serious medical emergencies or force majeure, an application for a Make-up Exam must be submitted to the Department Head along with certified hospital discharge papers within <strong>7 working days</strong> of the exam date.
          </p>
          <span className="text-xs text-slate-500">
            Make-up exam schedule announcements are published on the official notice board.
          </span>
        </Card>
      </div>
    </AppShell>
  );
}
