"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Tabs } from "@/components/ui/Tabs";
import { INITIAL_CLUBS } from "@/data/initialClubs";
import { Club } from "@/types/models";
import { Users, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function ClubsDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Clubs", badge: INITIAL_CLUBS.length },
    { id: "technology", label: "Technology & Computing" },
    { id: "academic", label: "Academic & Research" },
    { id: "cultural", label: "Cultural & Arts" },
    { id: "sports", label: "Sports" },
    { id: "social", label: "Social & Leadership" },
  ];

  const filteredClubs = INITIAL_CLUBS.filter((club) => {
    if (selectedCategory === "all") return true;
    return club.category === selectedCategory;
  });

  return (
    <AppShell>
      <PageHeader
        title="Student Organizations & Clubs"
        subtitle="Explore the 12 active student clubs and leadership societies at City University."
      />

      {/* Category Tabs */}
      <Tabs
        tabs={categories}
        activeTab={selectedCategory}
        onChange={(cat) => setSelectedCategory(cat)}
        className="mb-8"
      />

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => (
          <Link key={club.id} href={`/clubs/${club.id}`} className="group">
            <Card variant="interactive" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif font-black text-sm text-campus-navy-800 dark:text-campus-gold-400 bg-campus-navy-50 dark:bg-campus-navy-950 px-2.5 py-1 rounded border border-campus-navy-200 dark:border-campus-navy-800">
                    {club.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {club.source === "demo" ? <DemoBadge size="sm" /> : <Badge variant="official">Official</Badge>}
                  </div>
                </div>

                <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-campus-navy-700 dark:group-hover:text-campus-gold-400 transition leading-snug">
                  {club.name}
                </h2>

                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {club.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Lead: <strong>{club.leadName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{club.contactEmail}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-campus-navy-800 dark:text-campus-gold-400 font-bold group-hover:underline">
                <span>View Club Profile</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
