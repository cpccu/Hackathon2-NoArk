"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ExternalLink, CheckCircle, FileText, UserCheck } from "lucide-react";

export default function AdmissionHelpdeskPage() {
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
          title="Undergraduate & Graduate Admission"
          subtitle="Official eligibility criteria, required documents, and step-by-step application instructions (City University Khagan Campus)."
        />

        {/* Official Badge & Source */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="official">Official University Policy</Badge>
            <span className="text-emerald-900 dark:text-emerald-200 font-medium">
              Verified from City University Admission Portal
            </span>
          </div>
          <a
            href="https://admission.cityuniversity.ac.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-800 dark:text-emerald-300 hover:underline"
          >
            <span>admission.cityuniversity.ac.bd</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Eligibility Criteria Grid */}
        <Card>
          <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-campus-navy-700 dark:text-campus-gold-400" />
            <span>Undergraduate Minimum Eligibility</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-slate-100 mb-1">
                Engineering, Science, Business & Law Programmes
              </strong>
              <p>
                Minimum GPA of <strong>2.50</strong> each in SSC (or equivalent) and HSC (or equivalent) with a total combined GPA of at least <strong>6.00</strong>.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-slate-100 mb-1">
                Music, Fashion Design, Fine Arts & Graphic Design
              </strong>
              <p>
                Minimum GPA of <strong>2.00</strong> in SSC / O-Level and HSC / A-Level separately.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-slate-100 mb-1">
                Graduate & Executive Programmes (MBA, EMBA)
              </strong>
              <p>
                Undergraduate degree from any UGC-recognized institution with a minimum CGPA of 2.00. For Executive MBA (EMBA), a job experience certificate is additionally required.
              </p>
            </div>
          </div>
        </Card>

        {/* Required Documents */}
        <Card>
          <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-campus-gold-600 dark:text-campus-gold-400" />
            <span>Mandatory Documents Checklist</span>
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Two attested photocopies of all academic mark sheets and certificates (Original documents must be brought during physical verification).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Four attested passport-size colour photographs.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Attested copy of National ID card or Digital Birth Certificate.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Attested Union Parishad Chairman / Ward Commissioner nationality certificate.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Job experience certificate for EMBA applicants (if applicable).</span>
            </li>
          </ul>
        </Card>

        {/* 6 Step Process */}
        <Card>
          <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
            Step-by-Step Admission Procedure
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-mono font-bold text-campus-navy-700 dark:text-campus-gold-400 block mb-1">
                STEP 01
              </span>
              <strong className="block text-slate-900 dark:text-slate-100 mb-1">Form Collection</strong>
              <p className="text-slate-500">Obtain the admission form online or from the Admission Desk at Khagan campus.</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-mono font-bold text-campus-navy-700 dark:text-campus-gold-400 block mb-1">
                STEP 02
              </span>
              <strong className="block text-slate-900 dark:text-slate-100 mb-1">Submission & Fee</strong>
              <p className="text-slate-500">Submit completed form with 4 photos and pay the application fee before deadline.</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-mono font-bold text-campus-navy-700 dark:text-campus-gold-400 block mb-1">
                STEP 03
              </span>
              <strong className="block text-slate-900 dark:text-slate-100 mb-1">Admission Test</strong>
              <p className="text-slate-500">Attend the written admission test / oral interview on the designated date.</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-mono font-bold text-campus-navy-700 dark:text-campus-gold-400 block mb-1">
                STEP 04
              </span>
              <strong className="block text-slate-900 dark:text-slate-100 mb-1">Certificate Verification</strong>
              <p className="text-slate-500">Submit attested copies of certificates and present original board papers.</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-mono font-bold text-campus-navy-700 dark:text-campus-gold-400 block mb-1">
                STEP 05
              </span>
              <strong className="block text-slate-900 dark:text-slate-100 mb-1">Fee Payment</strong>
              <p className="text-slate-500">Pay the admission fee and first trimester registration fees through bank / portal.</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-mono font-bold text-campus-navy-700 dark:text-campus-gold-400 block mb-1">
                STEP 06
              </span>
              <strong className="block text-slate-900 dark:text-slate-100 mb-1">ID Card Collection</strong>
              <p className="text-slate-500">Collect your official RFID Student ID card from the Admission Office.</p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
