"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { ArrowLeft, ExternalLink, Award, DollarSign } from "lucide-react";

export default function FeesAndWaiverPage() {
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
          title="Tuition Fees & Merit Waiver Policy"
          subtitle="Official undergraduate scholarship criteria and estimated department-wise credit fees."
        />

        {/* 1. Official Undergraduate Waiver Policy Table */}
        <Card className="border-2 border-campus-navy-300 dark:border-campus-navy-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-campus-gold-600 dark:text-campus-gold-400" />
              <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                Official Undergraduate Tuition Waiver Policy
              </h2>
            </div>
            <Badge variant="official">Official Policy</Badge>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
            Tuition waivers are granted at admission based on SSC and HSC results. To retain the waiver from the 2nd trimester onwards, students must maintain the stipulated minimum trimester CGPA.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                  <th className="py-2.5 px-3 font-semibold">SSC & HSC Combined Result</th>
                  <th className="py-2.5 px-3 font-semibold">Tuition Waiver (%)</th>
                  <th className="py-2.5 px-3 font-semibold">Min CGPA to Retain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="bg-campus-gold-50/50 dark:bg-campus-gold-950/20 font-semibold">
                  <td className="py-2.5 px-3 text-campus-gold-900 dark:text-campus-gold-300">
                    Golden GPA 5.00 in both SSC & HSC
                  </td>
                  <td className="py-2.5 px-3 text-campus-gold-900 dark:text-campus-gold-300 font-mono text-sm">
                    100%
                  </td>
                  <td className="py-2.5 px-3 font-mono">3.60</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">GPA 5.00 in both SSC & HSC</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-sm">75%</td>
                  <td className="py-2.5 px-3 font-mono">3.50</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Total GPA 9.00 – 9.99</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-sm">30%</td>
                  <td className="py-2.5 px-3 font-mono">3.20</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Total GPA 8.00 – 8.99</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-sm">25%</td>
                  <td className="py-2.5 px-3 font-mono">3.00</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Total GPA 7.00 – 7.99</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-sm">20%</td>
                  <td className="py-2.5 px-3 font-mono">3.00</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Total GPA 6.00 – 6.99</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-sm">15%</td>
                  <td className="py-2.5 px-3 font-mono">3.00</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Total GPA 5.00 – 5.99</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-sm">10%</td>
                  <td className="py-2.5 px-3 font-mono">3.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <p>
              • <strong>Special Categories:</strong> Siblings, husband-wife couples, Hafiz of the Holy Quran, freedom fighters&apos; descendants, physically challenged students, and sports quota receive up to <strong>50% waiver</strong>.
            </p>
            <p>• Only the highest single waiver applies. Waivers apply strictly to tuition credits.</p>
          </div>
        </Card>

        {/* 2. Department-wise Tuition Structure (Demo Data per spec) */}
        <Card>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                Department-wise Tuition Fee Structure
              </h2>
            </div>
            <DemoBadge size="sm" />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
            Illustrative sample fee benchmarks for hackathon planning. Check with Accounts for official fee slips.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                  <th className="py-2.5 px-3 font-semibold">Programme / Department</th>
                  <th className="py-2.5 px-3 font-semibold">Per Credit (BDT)</th>
                  <th className="py-2.5 px-3 font-semibold">Total Credits</th>
                  <th className="py-2.5 px-3 font-semibold">Estimated 4-Year Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                <tr>
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    B.Sc. in Computer Science & Engineering (CSE)
                  </td>
                  <td className="py-2.5 px-3">3,800 – 4,500</td>
                  <td className="py-2.5 px-3">~140</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">5.5 – 6.2 Lakh</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    B.Sc. in Electrical & Electronic Engineering (EEE)
                  </td>
                  <td className="py-2.5 px-3">3,800 – 4,200</td>
                  <td className="py-2.5 px-3">~140</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">5.4 – 6.0 Lakh</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    Bachelor of Business Administration (BBA)
                  </td>
                  <td className="py-2.5 px-3">2,600 – 3,200</td>
                  <td className="py-2.5 px-3">~126</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">3.8 – 4.5 Lakh</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    Bachelor of Pharmacy (B.Pharm)
                  </td>
                  <td className="py-2.5 px-3">4,200 – 5,000</td>
                  <td className="py-2.5 px-3">~160</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">6.8 – 7.5 Lakh</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                    LL.B. (Hons) in Law
                  </td>
                  <td className="py-2.5 px-3">2,800</td>
                  <td className="py-2.5 px-3">~134</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">4.0 – 4.4 Lakh</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <p>• One-time admission fee: 15,000 – 20,000 BDT.</p>
            <p>• Trimester administrative/laboratory/ICT development fee: 8,000 – 12,000 BDT per term.</p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
