"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { CampusEvent, EventType } from "@/types/models";
import { fetchAllEvents, getEventStatus } from "@/lib/events";
import { INITIAL_CLUBS } from "@/data/initialClubs";
import { formatDhakaDate, isDhakaToday } from "@/lib/date";
import { Plus, Search, Calendar, Filter, Sparkles } from "lucide-react";

export default function EventsFeedPage() {
  const { role } = useAuth();
  const { t } = useLanguage();

  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "this_week" | "this_month">("all");

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const data = await fetchAllEvents();
      setEvents(data);
      setLoading(false);
    }
    loadEvents();
  }, []);

  const isClubAdminOrAdmin = role === "club_admin" || role === "admin";

  // Filter logic
  const now = new Date().getTime();
  const filteredEvents = events.filter((evt) => {
    const isPast = new Date(evt.endAt).getTime() < now;
    if (activeTab === "upcoming" && isPast) return false;
    if (activeTab === "past" && !isPast) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchClub = evt.clubName.toLowerCase().includes(q);
      const matchDesc = evt.description.toLowerCase().includes(q);
      if (!matchTitle && !matchClub && !matchDesc) return false;
    }

    // Club filter
    if (selectedClub !== "all" && evt.clubId !== selectedClub) return false;

    // Type filter
    if (selectedType !== "all" && evt.type !== selectedType) return false;

    // Date range filter
    if (dateFilter === "today" && !isDhakaToday(evt.startAt)) return false;
    if (dateFilter === "this_week") {
      const diffDays = (new Date(evt.startAt).getTime() - now) / (1000 * 60 * 60 * 24);
      if (diffDays < 0 || diffDays > 7) return false;
    }
    if (dateFilter === "this_month") {
      const evtDate = new Date(evt.startAt);
      const today = new Date();
      if (evtDate.getMonth() !== today.getMonth() || evtDate.getFullYear() !== today.getFullYear()) return false;
    }

    return true;
  });

  // "This week on campus" highlight strip
  const thisWeekHighlights = events.filter((e) => {
    const diffDays = (new Date(e.startAt).getTime() - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  });

  return (
    <AppShell>
      <PageHeader
        title={t.events.title}
        subtitle={t.events.subtitle}
        actions={
          <div className="flex items-center gap-3">
            <Link href="/my/events">
              <Button variant="outline" size="sm">
                {t.events.myTickets}
              </Button>
            </Link>
            {isClubAdminOrAdmin && (
              <Link href="/events/new">
                <Button variant="gold" size="sm" className="flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Create Event</span>
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* "This Week on Campus" Banner Strip */}
      {thisWeekHighlights.length > 0 && activeTab === "upcoming" && (
        <div className="mb-8 rounded-lg bg-campus-navy-900 text-white p-5 border border-campus-navy-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-campus-gold-400" />
            <h2 className="text-xs uppercase font-bold tracking-widest text-campus-gold-300">
              This Week on Campus
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {thisWeekHighlights.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/events/${item.id}`}
                className="p-3 rounded-md bg-campus-navy-800/80 hover:bg-campus-navy-800 border border-campus-navy-700/60 transition group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] text-campus-gold-400 font-semibold block">
                    {formatDhakaDate(item.startAt)} • {item.clubName.split("(")[0].trim()}
                  </span>
                  <h3 className="font-serif text-xs font-bold text-slate-100 group-hover:text-campus-gold-300 transition line-clamp-1 mt-1">
                    {item.title}
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  {item.capacity - item.registeredCount} seats remaining
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tabs: Upcoming vs Past */}
      <Tabs
        tabs={[
          {
            id: "upcoming",
            label: "Upcoming Events",
            badge: events.filter((e) => new Date(e.endAt).getTime() >= now).length,
          },
          {
            id: "past",
            label: "Past Events",
            badge: events.filter((e) => new Date(e.endAt).getTime() < now).length,
          },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as "upcoming" | "past")}
        className="mb-6"
      />

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800 mb-8 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, topic, or club name..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-campus-navy-700 dark:focus:ring-campus-gold-400"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          {/* Club Filter */}
          <select
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none"
            aria-label="Filter by club"
          >
            <option value="all">All Clubs</option>
            {INITIAL_CLUBS.map((club) => (
              <option key={club.id} value={club.id}>
                {club.code}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none"
            aria-label="Filter by event type"
          >
            <option value="all">All Types</option>
            <option value="workshop">Workshops</option>
            <option value="contest">Contests & Hackathons</option>
            <option value="seminar">Seminars</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="general">General</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none col-span-2 sm:col-span-1"
            aria-label="Filter by date range"
          >
            <option value="all">Any Date</option>
            <option value="today">Today Only</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
          </select>
        </div>
      </div>

      {/* Events Grid / Loading / Empty */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events match your criteria"
          description="Try broadening your search or switching the filter to all clubs and categories."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setSelectedClub("all");
            setSelectedType("all");
            setDateFilter("all");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
