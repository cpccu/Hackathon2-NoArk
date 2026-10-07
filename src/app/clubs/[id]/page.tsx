"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { EventCard } from "@/components/events/EventCard";
import { INITIAL_CLUBS } from "@/data/initialClubs";
import { INITIAL_EVENTS } from "@/data/initialEvents";
import { Users, Mail, Globe, ArrowLeft, Calendar, ShieldCheck } from "lucide-react";

export default function ClubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clubId = params.id as string;

  const club = INITIAL_CLUBS.find((c) => c.id === clubId);

  if (!club) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <h1 className="font-serif text-2xl font-bold text-slate-900">Club Not Found</h1>
          <p className="mt-2 text-sm text-slate-600">The requested club profile does not exist.</p>
          <button
            onClick={() => router.push("/clubs")}
            className="mt-4 px-4 py-2 bg-campus-navy-800 text-white rounded text-xs font-semibold"
          >
            Back to Clubs
          </button>
        </div>
      </AppShell>
    );
  }

  const clubEvents = INITIAL_EVENTS.filter((e) => e.clubId === club.id);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto pb-12">
        <Link
          href="/clubs"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Clubs</span>
        </Link>

        {/* Club Header Card */}
        <div className="bg-campus-navy-950 text-white rounded-xl p-6 sm:p-8 border border-campus-navy-800 shadow-lg mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-serif font-bold text-xs uppercase tracking-widest text-campus-gold-400 bg-campus-navy-900 px-2.5 py-1 rounded border border-campus-navy-700">
                  {club.code}
                </span>
                <Badge variant="default">{club.category}</Badge>
                {club.source === "demo" ? <DemoBadge size="sm" /> : <Badge variant="official">Official Club</Badge>}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {club.name}
              </h1>

              <p className="mt-3 text-sm text-slate-300 max-w-2xl leading-relaxed">
                {club.description}
              </p>
              {club.description_bn && (
                <p className="mt-1 text-sm font-bengali text-slate-400">
                  {club.description_bn}
                </p>
              )}
            </div>

            <div className="bg-campus-navy-900/90 border border-campus-navy-800 rounded-lg p-4 text-xs space-y-2 shrink-0 sm:min-w-[220px]">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Total Members:</span>
                <strong className="text-white font-semibold">{club.memberCount} active</strong>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Leadership:</span>
                <span className="text-white truncate max-w-[120px]">{club.leadName}</span>
              </div>
              <div className="pt-2 border-t border-campus-navy-800">
                <a
                  href={`mailto:${club.contactEmail}`}
                  className="flex items-center gap-1.5 text-campus-gold-400 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{club.contactEmail}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Club Events Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
                Events Organized by {club.code}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Upcoming workshops, contests, and sessions.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              {clubEvents.length} event{clubEvents.length !== 1 ? "s" : ""}
            </span>
          </div>

          {clubEvents.length === 0 ? (
            <Card className="text-center py-10 text-xs text-slate-500">
              No public events currently scheduled for this club. Check back soon!
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
