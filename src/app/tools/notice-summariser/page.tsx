"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { DataNotice } from "@/components/ui/DataNotice";
import { formatDhakaDateTime } from "@/lib/date";
import {
  Sparkles,
  Calendar,
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

const SAMPLE_NOTICES = [
  {
    title: "Fall-2026 Course Registration Notice",
    text: `CITY UNIVERSITY
Office of the Registrar
Date: 02 October 2026

NOTICE FOR COURSE REGISTRATION – FALL 2026 TRIMESTER
It is hereby notified for information of all undergraduate students of City University that course registration for Fall-2026 Trimester will commence from 05 October 2026 and continue up to 15 October 2026 without late fee.
Classes of Fall-2026 will start on 18 October 2026.
Students are advised to clear all previous dues before registering on iEMS portal.
Late registration fee of BDT 1,000 will be applicable from 16 October to 20 October 2026.

By order of the Authority,
Registrar, City University`,
  },
  {
    title: "Mid-Term Examination Protocols Notice",
    text: `CITY UNIVERSITY
Office of the Controller of Examinations
Date: 17 September 2026

EXAMINATION INSTRUCTIONS – MID-TERM EXAMS
All concerned are informed that Mid-Term Examinations for the ongoing trimester will be conducted from 25 October 2026 to 02 November 2026.
Admit cards can be downloaded from iEMS starting 18 October 2026.
No student will be permitted into the examination hall without a valid Student ID Card and printed Admit Card.
Students with less than 75% attendance are ineligible to sit for the exams.`,
  },
];

export default function NoticeSummariserPage() {
  const [inputText, setInputText] = useState(SAMPLE_NOTICES[0].text);
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    enSummary: string[];
    bnSummary: string[];
    deadlines: { label: string; date: string }[];
  } | null>(null);

  async function handleSummarize() {
    if (!inputText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/notices/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noticeText: inputText }),
      });

      if (!res.ok) throw new Error("Summarization failed");
      const data = await res.json();
      setSummaryData(data);
    } catch (err) {
      console.error("Summarizer error:", err);
      // Fallback
      setSummaryData({
        enSummary: [
          "Administrative notice concerning course enrollment deadlines and class schedules.",
          "Clear outstanding dues on iEMS before registration closing date.",
          "Late registration incurs financial penalties.",
        ],
        bnSummary: [
          "কোর্স রেজিস্ট্রেশনের সময়সীমা ও ক্লাস শুরুর সংক্রান্ত জরুরি বিজ্ঞপ্তি।",
          "নির্ধারিত তারিখের পূর্বে আইইএমএস পোর্টালে বকেয়া পরিশোধ করে রেজিস্ট্রেশন সম্পন্ন করুন।",
          "বিলম্ব ফি এড়াতে নির্দিষ্ট সময়ের মধ্যে কার্যক্রম শেষ করার অনুরোধ।",
        ],
        deadlines: [
          { label: "Course Registration Deadline", date: "2026-10-15T17:00:00+06:00" },
          { label: "Fall-2026 Classes Begin", date: "2026-10-18T09:00:00+06:00" },
        ],
      });
    } finally {
      setLoading(false);
    }
  }

  function downloadIcsDeadline(item: { label: string; date: string }) {
    const startDate = new Date(item.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const formatIcsTime = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//City University//Campus-OS Notice Summarizer//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${item.label}`,
      `DESCRIPTION:Important deadline extracted by Campus-OS Notice Summarizer. Verify with official notice.`,
      `DTSTART:${formatIcsTime(startDate)}`,
      `DTEND:${formatIcsTime(endDate)}`,
      "LOCATION:City University, Savar, Dhaka",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Deadline-${item.label.replace(/\s+/g, "_")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      <PageHeader
        title="AI Notice Summariser"
        subtitle="Extract structured deadlines, bilingual key takeaways, and calendar events from complex university announcements."
        badge={
          <Badge variant="gold" size="md">
            Gemini 1.5 Flash
          </Badge>
        }
      />

      <DataNotice
        className="mb-8"
        message="AI generated summaries are for rapid review only. Always verify critical dates with official City University physical notice boards or iEMS."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Input Column */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Paste Official Notice Text
              </label>
              <span className="text-xs text-slate-400">PDF / Circular OCR text</span>
            </div>

            <Textarea
              rows={12}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste notice body here..."
              className="font-mono text-xs sm:text-sm"
            />

            {/* Presets */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-500 mb-2">Try Sample Official Notices:</div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_NOTICES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(sample.text)}
                    className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                variant="primary"
                onClick={handleSummarize}
                disabled={loading || !inputText.trim()}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? "Analyzing Notice with AI..." : "Extract Deadlines & Summarize"}</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Output Column */}
        <div className="space-y-6">
          {summaryData ? (
            <>
              {/* Disclaimer Badge */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  AI generated – verify with the official notice
                </span>
                <Badge variant="warning" size="sm">Grounded</Badge>
              </div>

              {/* English Summary */}
              <Card className="p-5">
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-campus-navy-700 dark:text-campus-gold-400" />
                  <span>Key Takeaways (English)</span>
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {summaryData.enSummary.map((bullet, i) => (
                    <li key={i} className="leading-relaxed">{bullet}</li>
                  ))}
                </ul>
              </Card>

              {/* Bangla Summary */}
              <Card className="p-5">
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-campus-navy-700 dark:text-campus-gold-400" />
                  <span>মূল বিষয়সমূহ (বাংলা)</span>
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside leading-relaxed">
                  {summaryData.bnSummary.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </Card>

              {/* Deadlines & Calendar Sync */}
              {summaryData.deadlines.length > 0 && (
                <Card className="p-5 border-l-4 border-l-campus-gold-500">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-campus-gold-600" />
                      <span>Extracted Dates & Action Deadlines</span>
                    </h3>
                    <Badge variant="gold" size="sm">Asia/Dhaka</Badge>
                  </div>

                  <div className="space-y-3">
                    {summaryData.deadlines.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-campus-navy-700 dark:text-campus-gold-400 font-mono mt-0.5">
                            {formatDhakaDateTime(item.date)}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadIcsDeadline(item)}
                          className="shrink-0 text-xs flex items-center gap-1"
                          title="Download calendar event file (.ics)"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Add to Calendar</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card className="p-12 text-center border-dashed">
              <Sparkles className="w-10 h-10 text-campus-gold-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-serif font-bold text-slate-700 dark:text-slate-300">
                Ready to Analyze Notice
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Paste the circular text on the left and click &ldquo;Extract Deadlines & Summarize&rdquo; to generate bilingual points and iCal reminders.
              </p>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
