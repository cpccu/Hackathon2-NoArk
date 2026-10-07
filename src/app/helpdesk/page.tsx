"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { DataNotice } from "@/components/ui/DataNotice";
import { FAQ, FAQCategory } from "@/types/models";
import { fetchAllFaqs } from "@/lib/faqs";
import { useLanguage } from "@/context/LanguageContext";
import {
  HelpCircle,
  Search,
  ExternalLink,
  GraduationCap,
  Calculator,
  BookOpen,
  Bus,
  Phone,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const CATEGORIES: FAQCategory[] = [
  "Admission",
  "Registration and Courses",
  "Exams",
  "Fees and Waivers",
  "Transport",
  "Campus Facilities",
  "Contacts",
  "Rules and Discipline",
];

export default function HelpdeskPage() {
  const { language } = useLanguage();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchAllFaqs();
      setFaqs(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCategory = selectedCategory === "All" || faq.category === selectedCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchEn =
        faq.question_en.toLowerCase().includes(q) || faq.answer_en.toLowerCase().includes(q);
      const matchBn =
        faq.question_bn.includes(q) || faq.answer_bn.includes(q);
      return matchEn || matchBn;
    });
  }, [faqs, selectedCategory, searchQuery]);

  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        <PageHeader
          title={language === "bn" ? "স্মার্ট হেল্পডেস্ক ও ক্যাম্পাস তথ্য" : "Smart Campus Helpdesk & FAQs"}
          subtitle={
            language === "bn"
              ? "ভর্তি, ওয়েভার, পরীক্ষা, পরিবহন এবং জরুরি প্রশাসনিক যোগাযোগ সংক্রান্ত নিয়মিত তথ্য।"
              : "Official answers, fee waiver tables, examination guidelines, and transport contacts for City University."
          }
          actions={
            <Link href="/assistant">
              <Button variant="gold" size="sm" className="flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "এআই সহকারীকে প্রশ্ন করুন" : "Ask AI Assistant"}</span>
              </Button>
            </Link>
          }
        />

        {/* Quick Deep Link Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/helpdesk/admission">
            <Card className="hover:border-campus-navy-400 dark:hover:border-campus-gold-500 transition p-3.5 flex flex-col justify-between h-full bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between mb-2">
                <GraduationCap className="w-5 h-5 text-campus-navy-800 dark:text-campus-gold-400" />
                <Badge variant="official">Official</Badge>
              </div>
              <div>
                <strong className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                  Admission Guide
                </strong>
                <span className="text-[11px] text-slate-500">Eligibility & Steps</span>
              </div>
            </Card>
          </Link>

          <Link href="/helpdesk/fees">
            <Card className="hover:border-campus-navy-400 dark:hover:border-campus-gold-500 transition p-3.5 flex flex-col justify-between h-full bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between mb-2">
                <Calculator className="w-5 h-5 text-campus-navy-800 dark:text-campus-gold-400" />
                <Badge variant="gold">Waiver Table</Badge>
              </div>
              <div>
                <strong className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                  Fees & Waivers
                </strong>
                <span className="text-[11px] text-slate-500">Up to 100% policy</span>
              </div>
            </Card>
          </Link>

          <Link href="/helpdesk/exams">
            <Card className="hover:border-campus-navy-400 dark:hover:border-campus-gold-500 transition p-3.5 flex flex-col justify-between h-full bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-5 h-5 text-campus-navy-800 dark:text-campus-gold-400" />
                <Badge variant="official">Official</Badge>
              </div>
              <div>
                <strong className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                  Exam Guidelines
                </strong>
                <span className="text-[11px] text-slate-500">75% attendance rule</span>
              </div>
            </Card>
          </Link>

          <Link href="/helpdesk/contacts">
            <Card className="hover:border-campus-navy-400 dark:hover:border-campus-gold-500 transition p-3.5 flex flex-col justify-between h-full bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between mb-2">
                <Phone className="w-5 h-5 text-campus-navy-800 dark:text-campus-gold-400" />
                <Badge variant="official">09643-234234</Badge>
              </div>
              <div>
                <strong className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                  Campus Directory
                </strong>
                <span className="text-[11px] text-slate-500">Offices & Hotlines</span>
              </div>
            </Card>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder={
              language === "bn"
                ? "প্রশ্ন বা কিওয়ার্ড দিয়ে খুঁজুন (যেমন: 'waiver', 'GPA', 'মিডটার্ম', 'হোস্টেল')..."
                : "Search FAQs by keywords (e.g., 'waiver policy', 'GPA requirements', 'midterm', 'hostel')..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
              selectedCategory === "All"
                ? "bg-campus-navy-950 text-white border-campus-navy-950 dark:bg-campus-gold-600 dark:text-campus-navy-950"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
            }`}
          >
            All Categories ({faqs.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? "bg-campus-navy-950 text-white border-campus-navy-950 dark:bg-campus-gold-600 dark:text-campus-navy-950"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Loading official and verified FAQs...
          </div>
        ) : filteredFaqs.length === 0 ? (
          <Card className="text-center py-12">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="font-serif font-bold text-sm text-slate-800 dark:text-slate-200">
              No matching questions found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              We couldn’t find an FAQ entry matching your query. Ask the AI Assistant or consult the hotline.
            </p>
            <Link href="/assistant">
              <Button variant="outline" size="sm">
                Ask Campus AI Assistant
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((item) => (
              <Card key={item.id} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="default">{item.category}</Badge>
                    {item.source === "official" ? (
                      <Badge variant="official">Official Fact</Badge>
                    ) : (
                      <DemoBadge size="sm" />
                    )}
                  </div>
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-campus-navy-700 dark:hover:text-campus-gold-400 font-medium shrink-0"
                    >
                      <span>Source Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {language === "bn" ? item.question_bn : item.question_en}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {language === "bn" ? item.answer_bn : item.answer_en}
                </p>

                {/* Sub-accordion translation switch preview */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    {language === "bn" ? "English Version: " : "বাংলা সংস্করণ: "}
                  </span>
                  <span>{language === "bn" ? item.answer_en : item.answer_bn}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
