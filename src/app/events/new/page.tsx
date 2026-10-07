"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { INITIAL_CLUBS } from "@/data/initialClubs";
import { saveEvent } from "@/lib/events";
import { EventType, RecordSource } from "@/types/models";
import { ArrowLeft, Save, Calendar } from "lucide-react";

export default function NewEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [description, setDescription] = useState("");
  const [clubId, setClubId] = useState(INITIAL_CLUBS[0].id);
  const [type, setType] = useState<EventType>("workshop");
  const [startDate, setStartDate] = useState("2026-10-15");
  const [startTime, setStartTime] = useState("10:00");
  const [endDate, setEndDate] = useState("2026-10-15");
  const [endTime, setEndTime] = useState("13:00");
  const [deadlineDate, setDeadlineDate] = useState("2026-10-14");
  const [deadlineTime, setDeadlineTime] = useState("23:59");
  const [location, setLocation] = useState("Main Auditorium, Permanent Campus");
  const [capacity, setCapacity] = useState(60);
  const [source, setSource] = useState<RecordSource>("demo");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      error("Please complete all required fields.");
      return;
    }

    setLoading(true);
    try {
      const selectedClubObj = INITIAL_CLUBS.find((c) => c.id === clubId);
      const newEventId = `evt-${Date.now()}`;

      const startAt = `${startDate}T${startTime}:00+06:00`;
      const endAt = `${endDate}T${endTime}:00+06:00`;
      const registrationDeadline = `${deadlineDate}T${deadlineTime}:00+06:00`;

      await saveEvent({
        id: newEventId,
        title: title.trim(),
        title_bn: titleBn.trim() || undefined,
        description: description.trim(),
        clubId,
        clubName: selectedClubObj?.name || "City University Club",
        type,
        startAt,
        endAt,
        location: location.trim(),
        capacity: Number(capacity),
        registeredCount: 0,
        registrationOpen: true,
        registrationDeadline,
        createdBy: user?.uid || "admin",
        source,
        createdAt: new Date().toISOString(),
      });

      success("Event successfully created!");
      router.push(`/events/${newEventId}`);
    } catch (err: any) {
      console.error("Save event error:", err);
      error(err.message || "Failed to save event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["club_admin", "admin"]}>
      <AppShell>
        <div className="max-w-3xl mx-auto pb-12">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel and return</span>
          </Link>

          <PageHeader
            title="Create Campus Event"
            subtitle="Publish a workshop, hackathon, seminar, or competition for City University students."
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
                General Information
              </h2>
              <div className="space-y-4">
                <Input
                  label="Event Title (English) *"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Web Development Masterclass"
                />

                <Input
                  label="Event Title (Bangla) (Optional)"
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder="e.g. নেক্সট-জেন ওয়েব ডেভেলপমেন্ট কর্মশালা"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Organizing Club *"
                    value={clubId}
                    onChange={(e) => setClubId(e.target.value)}
                  >
                    {INITIAL_CLUBS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} – {c.name.split("(")[0]}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Event Category *"
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                  >
                    <option value="workshop">Workshop</option>
                    <option value="contest">Contest / Hackathon</option>
                    <option value="seminar">Seminar</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                    <option value="general">General</option>
                  </Select>
                </div>

                <Textarea
                  label="Detailed Description *"
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline the session agenda, prerequisite tools, eligibility, and learning outcomes..."
                />
              </div>
            </Card>

            <Card>
              <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
                Schedule & Capacity (Asia/Dhaka)
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Start Date *"
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <Input
                    label="Start Time (Dhaka) *"
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="End Date *"
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <Input
                    label="End Time (Dhaka) *"
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Registration Deadline Date *"
                    type="date"
                    required
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                  />
                  <Input
                    label="Deadline Time (Dhaka) *"
                    type="time"
                    required
                    value={deadlineTime}
                    onChange={(e) => setDeadlineTime(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Physical Location / Venue *"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Computer Lab 3, Permanent Campus"
                  />
                  <Input
                    label="Seat Capacity *"
                    type="number"
                    min={1}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Select
                    label="Data Origin (Rule 3) *"
                    value={source}
                    onChange={(e) => setSource(e.target.value as RecordSource)}
                  >
                    <option value="demo">Demo Data (Hackathon Simulation)</option>
                    <option value="official">Official City University Event</option>
                  </Select>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Records marked &apos;demo&apos; will automatically display an amber DEMO DATA badge.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Link href="/events">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button variant="gold" type="submit" isLoading={loading} className="gap-2">
                <Save className="w-4 h-4" />
                <span>Publish Event</span>
              </Button>
            </div>
          </form>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
