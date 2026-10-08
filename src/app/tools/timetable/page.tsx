"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataNotice } from "@/components/ui/DataNotice";
import { useAuth } from "@/context/AuthContext";
import { fetchAllEvents } from "@/lib/events";
import { CampusEvent } from "@/types/models";
import { formatDhakaDateTime, formatDhakaTime } from "@/lib/date";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Filter,
} from "lucide-react";

interface ClassRoutineSlot {
  id: string;
  day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday";
  startTime: string; // "09:30"
  endTime: string;   // "11:00"
  courseCode: string;
  courseTitle: string;
  room: string;
  instructor: string;
}

const SAMPLE_WEEKLY_ROUTINE: ClassRoutineSlot[] = [
  { id: "c1", day: "Sunday", startTime: "09:30", endTime: "11:00", courseCode: "CSE 2101", courseTitle: "Data Structures", room: "Room 402", instructor: "Engr. Mahmudul Hasan" },
  { id: "c2", day: "Sunday", startTime: "11:30", endTime: "13:00", courseCode: "MATH 2103", courseTitle: "Linear Algebra & Matrices", room: "Room 301", instructor: "Dr. Nazmul Huq" },
  { id: "c3", day: "Monday", startTime: "10:00", endTime: "13:00", courseCode: "CSE 2102", courseTitle: "Data Structures Lab", room: "Lab 2 (Academic Bldg 1)", instructor: "Farhana Ahmed" },
  { id: "c4", day: "Tuesday", startTime: "11:30", endTime: "13:00", courseCode: "EEE 2105", courseTitle: "Electronic Devices", room: "Room 404", instructor: "Prof. Dr. Rahman" },
  { id: "c5", day: "Tuesday", startTime: "14:00", endTime: "16:00", courseCode: "CSE 2101", courseTitle: "Data Structures Tutorial", room: "Room 402", instructor: "Engr. Mahmudul Hasan" },
  { id: "c6", day: "Wednesday", startTime: "09:30", endTime: "11:00", courseCode: "ENG 1101", courseTitle: "Technical Writing", room: "Room 205", instructor: "Razia Sultana" },
  { id: "c7", day: "Thursday", startTime: "10:00", endTime: "11:30", courseCode: "CSE 2103", courseTitle: "Discrete Mathematics", room: "Room 402", instructor: "Engr. M. Haque" },
];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"] as const;

export default function TimetableCheckerPage() {
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const ev = await fetchAllEvents();
        setEvents(ev);
      } catch (e) {
        console.warn("Failed to load events for timetable:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Conflict detection algorithm
  // Checks if any event occurs on the same weekday within matching hours
  const conflicts: { classSlot: ClassRoutineSlot; event: CampusEvent }[] = [];

  events.forEach((ev) => {
    try {
      const evDate = new Date(ev.startAt);
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const evDay = dayNames[evDate.getDay()];

      // Check if event falls on Sun-Thu
      const matchedSlots = SAMPLE_WEEKLY_ROUTINE.filter((slot) => slot.day === evDay);
      matchedSlots.forEach((slot) => {
        // Compare hours
        const evHour = evDate.getHours();
        const slotStartHour = parseInt(slot.startTime.split(":")[0], 10);
        const slotEndHour = parseInt(slot.endTime.split(":")[0], 10);

        if (evHour >= slotStartHour && evHour <= slotEndHour) {
          conflicts.push({ classSlot: slot, event: ev });
        }
      });
    } catch {
      // ignore date errors
    }
  });

  return (
    <AppShell>
      <PageHeader
        title="Weekly Timetable & Conflict Checker"
        subtitle="Cross-check your academic lectures and lab schedules against registered club workshops to eliminate attendance clashes."
        badge={
          <Badge variant="gold" size="md">
            Academic Guard
          </Badge>
        }
      />

      <DataNotice
        className="mb-8"
        message="City University operates on a Sunday–Thursday official academic timetable. Lab sessions require 75% mandatory attendance."
      />

      {/* Clashes Alert Banner */}
      {conflicts.length > 0 ? (
        <div className="mb-8 p-5 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h3 className="font-serif font-bold text-base text-rose-900 dark:text-rose-200">
              Schedule Clashes Detected ({conflicts.length})
            </h3>
            <Badge variant="danger" size="sm">Action Recommended</Badge>
          </div>

          <div className="space-y-3">
            {conflicts.map((c, idx) => (
              <div
                key={idx}
                className="p-3 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {c.classSlot.courseCode} ({c.classSlot.day} {c.classSlot.startTime}–{c.classSlot.endTime})
                  </span>
                  <span className="text-slate-500"> overlaps with </span>
                  <strong className="text-rose-600 dark:text-rose-400">{c.event.title}</strong>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Class in {c.classSlot.room} • Event at {c.event.location}
                  </div>
                </div>

                <Link href={`/events/${c.event.id}`}>
                  <Button variant="outline" size="sm" className="shrink-0 text-xs text-rose-600">
                    Inspect Event
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>No schedule clashes detected between your weekly class routine and registered campus events.</span>
        </div>
      )}

      {/* Weekly Schedule Matrix */}
      <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-campus-navy-700 dark:text-campus-gold-400" />
        <span>Weekly Class Timetable (Department of {profile?.department || "CSE"})</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
        {DAYS.map((day) => {
          const slotsForDay = SAMPLE_WEEKLY_ROUTINE.filter((s) => s.day === day);

          return (
            <Card key={day} className="p-4 flex flex-col justify-between">
              <div>
                <div className="font-serif font-bold text-sm text-campus-navy-900 dark:text-campus-gold-400 pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
                  {day}
                </div>

                {slotsForDay.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center italic">No scheduled lectures</p>
                ) : (
                  <div className="space-y-3">
                    {slotsForDay.map((slot) => (
                      <div
                        key={slot.id}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                      >
                        <div className="flex items-center justify-between text-[11px] text-campus-navy-700 dark:text-campus-gold-400 font-mono mb-1">
                          <span>{slot.startTime} – {slot.endTime}</span>
                        </div>
                        <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          {slot.courseCode}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {slot.courseTitle}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {slot.room}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
