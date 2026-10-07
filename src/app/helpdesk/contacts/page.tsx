"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Phone, MapPin, Mail, Globe, Clock, ShieldAlert } from "lucide-react";

export default function ContactsHelpdeskPage() {
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
          title="Official Campus Directory & Emergency Helplines"
          subtitle="Verified contacts for City University administrative offices, admissions, transport, and proctorial safety."
        />

        {/* Central IP & Query Hotlines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-campus-navy-300 dark:border-campus-navy-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Central Campus Exchange
              </span>
              <Badge variant="official">Primary Line</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-campus-gold-600 dark:text-campus-gold-400 shrink-0" />
              <div>
                <a
                  href="tel:09643234234"
                  className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100 hover:underline"
                >
                  09643-234234
                </a>
                <p className="text-xs text-slate-500 mt-0.5">Central IP PABX Hotline</p>
              </div>
            </div>
          </Card>

          <Card className="border-2 border-campus-navy-300 dark:border-campus-navy-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Mobile Query Lines
              </span>
              <Badge variant="official">Admission & General</Badge>
            </div>
            <div className="space-y-1 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200">
              <p>📱 +8801322917670 / +8801322917671</p>
              <p>📱 +8801322917672 / +8801322917673</p>
            </div>
          </Card>
        </div>

        {/* Location & Key Offices */}
        <Card>
          <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-campus-navy-700 dark:text-campus-gold-400" />
            <span>Permanent Campus Location</span>
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              City University Permanent Campus
            </p>
            <p>Khagan, Birulia, Savar, Dhaka-1340, Bangladesh.</p>
            <p className="text-slate-500 text-xs">
              Located approximately 10 km from Gabtoli Inter-District Bus Terminal.
            </p>
          </div>
        </Card>

        {/* Essential Offices Directory */}
        <Card>
          <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
            Key Departmental Offices
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <strong className="text-slate-900 dark:text-slate-100">Admission Office</strong>
                <p className="text-slate-500">Ground Floor, Administrative Building</p>
              </div>
              <span className="font-mono text-slate-700 dark:text-slate-300">Ext: 101, 102</span>
            </div>

            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <strong className="text-slate-900 dark:text-slate-100">Controller of Examinations</strong>
                <p className="text-slate-500">2nd Floor, Academic Block A</p>
              </div>
              <span className="font-mono text-slate-700 dark:text-slate-300">Ext: 204</span>
            </div>

            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <strong className="text-slate-900 dark:text-slate-100">Transport & Vehicle Section</strong>
                <p className="text-slate-500">Behind Main Playground Parking</p>
              </div>
              <span className="font-mono text-slate-700 dark:text-slate-300">Ext: 310</span>
            </div>

            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <strong className="text-slate-900 dark:text-slate-100">
                  Proctor Office (Safety & Discipline)
                </strong>
                <p className="text-slate-500">Administrative Building, Room 108</p>
              </div>
              <span className="font-mono text-slate-700 dark:text-slate-300">01322-917670 (Proctor)</span>
            </div>
          </div>
        </Card>

        {/* Official Web Resources */}
        <Card className="bg-slate-50 dark:bg-slate-800/40">
          <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-500" />
            <span>Official University Portals</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <a
              href="https://cityuniversity.ac.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-campus-navy-400 flex items-center justify-between text-slate-700 dark:text-slate-300"
            >
              <span>Main Website</span>
              <span className="text-[11px] font-mono text-slate-400">cityuniversity.ac.bd</span>
            </a>

            <a
              href="https://iems.cityuniversity.ac.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-campus-navy-400 flex items-center justify-between text-slate-700 dark:text-slate-300"
            >
              <span>iEMS Student Portal</span>
              <span className="text-[11px] font-mono text-slate-400">iems.cityuniversity.ac.bd</span>
            </a>

            <a
              href="https://library.cityuniversity.ac.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-campus-navy-400 flex items-center justify-between text-slate-700 dark:text-slate-300"
            >
              <span>Central Library Portal</span>
              <span className="text-[11px] font-mono text-slate-400">library.cityuniversity.ac.bd</span>
            </a>

            <a
              href="https://outlook.office.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-campus-navy-400 flex items-center justify-between text-slate-700 dark:text-slate-300"
            >
              <span>Official Student Webmail</span>
              <span className="text-[11px] font-mono text-slate-400">outlook.office.com</span>
            </a>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
