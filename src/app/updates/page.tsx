"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { DataNotice } from "@/components/ui/DataNotice";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ClassUpdate, Department, UpdateKind } from "@/types/models";
import { fetchClassUpdates, createClassUpdate } from "@/lib/updates";
import { formatDhakaDateTime, formatDhakaTime } from "@/lib/date";
import {
  Bell,
  Calendar,
  Clock,
  PlusCircle,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Download,
} from "lucide-react";

const DEPARTMENTS: (Department | "All")[] = [
  "All",
  "CSE",
  "EEE",
  "Mechanical",
  "Civil",
  "Textile",
  "Pharmacy",
  "Public Health",
  "DSH",
  "BBA",
  "English",
  "Law",
  "Agriculture",
];

export default function ClassUpdatesPage() {
  const { user, profile, role } = useAuth();
  const { t, language } = useLanguage();

  const [updates, setUpdates] = useState<ClassUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedBatch, setSelectedBatch] = useState<string>("All");
  const [selectedKind, setSelectedKind] = useState<string>("All");

  // Post Update Modal (Club Admin / Admin)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTitleBn, setNewTitleBn] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newBodyBn, setNewBodyBn] = useState("");
  const [newKind, setNewKind] = useState<UpdateKind>("class_rescheduled");
  const [newDept, setNewDept] = useState<Department | "All">("CSE");
  const [newBatch, setNewBatch] = useState("50th");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newEffectiveAt, setNewEffectiveAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // If student has a profile, default to their dept and batch
    if (profile?.department) {
      setSelectedDept(profile.department);
    }
  }, [profile]);

  useEffect(() => {
    loadUpdates();
  }, []);

  async function loadUpdates() {
    setLoading(true);
    try {
      const data = await fetchClassUpdates();
      setUpdates(data);
    } catch (err) {
      console.error("Failed to load updates:", err);
    } finally {
      setLoading(false);
    }
  }

  // Filtered list
  const filteredUpdates = updates.filter((u) => {
    if (selectedDept !== "All" && u.department !== "All" && u.department !== selectedDept) {
      return false;
    }
    if (selectedBatch !== "All" && u.batch !== "All" && u.batch !== selectedBatch) {
      return false;
    }
    if (selectedKind !== "All" && u.kind !== selectedKind) {
      return false;
    }
    return true;
  });

  // Calculate day label relative to Asia/Dhaka time
  function getDayLabel(dateStr: string) {
    try {
      const target = new Date(dateStr);
      const now = new Date();
      const targetDhaka = new Date(target.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
      const nowDhaka = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));

      const isSameDay =
        targetDhaka.getFullYear() === nowDhaka.getFullYear() &&
        targetDhaka.getMonth() === nowDhaka.getMonth() &&
        targetDhaka.getDate() === nowDhaka.getDate();

      const tomorrowDhaka = new Date(nowDhaka);
      tomorrowDhaka.setDate(tomorrowDhaka.getDate() + 1);
      const isTomorrow =
        targetDhaka.getFullYear() === tomorrowDhaka.getFullYear() &&
        targetDhaka.getMonth() === tomorrowDhaka.getMonth() &&
        targetDhaka.getDate() === tomorrowDhaka.getDate();

      if (isSameDay) return { text: language === "bn" ? "আজ" : "Today", variant: "danger" as const };
      if (isTomorrow) return { text: language === "bn" ? "আগামীকাল" : "Tomorrow", variant: "warning" as const };
      return { text: language === "bn" ? "আসন্ন" : "Upcoming", variant: "default" as const };
    } catch {
      return { text: "Notice", variant: "default" as const };
    }
  }

  function getKindBadge(kind: UpdateKind) {
    switch (kind) {
      case "class_cancelled":
        return <Badge variant="danger">{t.updates.cancelled}</Badge>;
      case "class_rescheduled":
        return <Badge variant="warning">{t.updates.rescheduled}</Badge>;
      case "exam":
        return <Badge variant="info">{t.updates.exam}</Badge>;
      case "general":
      default:
        return <Badge variant="default">{t.updates.general}</Badge>;
    }
  }

  // Generate .ics download
  function downloadIcs(update: ClassUpdate) {
    const title = language === "bn" && update.title_bn ? update.title_bn : update.title;
    const body = language === "bn" && update.body_bn ? update.body_bn : update.body;
    const startDate = new Date(update.effectiveAt);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour

    const formatIcsTime = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//City University//Campus-OS Class Updates//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DESCRIPTION:${body.replace(/\n/g, "\\n")}`,
      `DTSTART:${formatIcsTime(startDate)}`,
      `DTEND:${formatIcsTime(endDate)}`,
      "LOCATION:City University, Birulia, Savar",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CU-Update-${update.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleCreateUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle || !newBody || !newEffectiveAt) return;

    setSubmitting(true);
    try {
      await createClassUpdate({
        title: newTitle,
        title_bn: newTitleBn || undefined,
        body: newBody,
        body_bn: newBodyBn || undefined,
        kind: newKind,
        department: newDept,
        batch: newBatch || "All",
        courseCode: newCourseCode || undefined,
        effectiveAt: new Date(newEffectiveAt).toISOString(),
        authorId: user?.uid || "admin",
        authorName: profile?.name || "Department Executive",
        source: "demo",
      });

      setIsModalOpen(false);
      setNewTitle("");
      setNewTitleBn("");
      setNewBody("");
      setNewBodyBn("");
      setNewCourseCode("");
      await loadUpdates();
    } catch (err) {
      console.error("Failed to post update:", err);
      alert("Error posting class update. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const canPost = role === "admin" || role === "club_admin";

  return (
    <AppShell>
      <PageHeader
        title={t.updates.title}
        subtitle={t.updates.subtitle}
        badge={
          <Badge variant="gold" size="md">
            Live Feed
          </Badge>
        }
        actions={
          canPost && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {t.updates.postUpdate}
            </Button>
          )
        }
      />

      <DataNotice
        className="mb-6"
        message="Class schedule modifications and cancellations are posted by academic course coordinators and synchronized to Asia/Dhaka time."
      />

      {/* Filter Toolbar */}
      <Card className="mb-8 p-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Filter className="w-4 h-4 text-campus-navy-600 dark:text-campus-gold-400" />
            <span>{t.common.filter}:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {/* Department */}
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                {t.updates.filterByDept}
              </label>
              <select
                aria-label={t.updates.filterByDept}
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "All" ? t.updates.allDepts : dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch */}
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                {t.updates.filterByBatch}
              </label>
              <select
                aria-label={t.updates.filterByBatch}
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              >
                <option value="All">{t.common.all}</option>
                <option value="48th">Batch 48th</option>
                <option value="49th">Batch 49th</option>
                <option value="50th">Batch 50th</option>
                <option value="51st">Batch 51st</option>
                <option value="52nd">Batch 52nd</option>
              </select>
            </div>

            {/* Category / Kind */}
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Notice Category
              </label>
              <select
                aria-label="Notice Category"
                value={selectedKind}
                onChange={(e) => setSelectedKind(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              >
                <option value="All">{t.common.all}</option>
                <option value="class_rescheduled">{t.updates.rescheduled}</option>
                <option value="class_cancelled">{t.updates.cancelled}</option>
                <option value="exam">{t.updates.exam}</option>
                <option value="general">{t.updates.general}</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Updates Stream */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredUpdates.length === 0 ? (
        <Card className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
            No Active Schedule Disruptions
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
            All classes for the selected filter criteria are proceeding according to the regular timetable.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredUpdates.map((item) => {
            const dayLabel = getDayLabel(item.effectiveAt);
            const isBangla = language === "bn" && item.title_bn;
            const title = isBangla ? item.title_bn : item.title;
            const body = isBangla && item.body_bn ? item.body_bn : item.body;

            return (
              <Card
                key={item.id}
                className={`border-l-4 transition hover:shadow-md ${
                  item.kind === "class_cancelled"
                    ? "border-l-rose-500"
                    : item.kind === "class_rescheduled"
                    ? "border-l-amber-500"
                    : item.kind === "exam"
                    ? "border-l-blue-500"
                    : "border-l-slate-400"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant={dayLabel.variant} size="sm">
                        {dayLabel.text}
                      </Badge>
                      {getKindBadge(item.kind)}
                      <Badge variant="outline" size="sm">
                        {item.department === "All" ? "All Departments" : item.department}
                        {item.batch && item.batch !== "All" ? ` • ${item.batch}` : ""}
                      </Badge>
                      {item.courseCode && (
                        <Badge variant="default" size="sm">
                          {item.courseCode}
                        </Badge>
                      )}
                      {item.source === "demo" && <DemoBadge />}
                    </div>

                    <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                      {title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {body}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-campus-navy-600 dark:text-campus-gold-400" />
                        Effective: {formatDhakaDateTime(item.effectiveAt)}
                      </span>
                      <span>Posted by: {item.authorName}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadIcs(item)}
                      className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300"
                      title="Download iCalendar format (.ics)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.events.addToCalendar}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Authorised Post Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={t.updates.postUpdate}
        >
          <form onSubmit={handleCreateUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notice Title (English) *
              </label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. CSE 2101: Lab Rescheduled"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notice Title (Bangla - Optional)
              </label>
              <Input
                value={newTitleBn}
                onChange={(e) => setNewTitleBn(e.target.value)}
                placeholder="বাংলা শিরোনাম"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Type of Update *
                </label>
                <select
                  aria-label="Type of Update"
                  value={newKind}
                  onChange={(e) => setNewKind(e.target.value as UpdateKind)}
                  className="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                >
                  <option value="class_rescheduled">Class Rescheduled</option>
                  <option value="class_cancelled">Class Cancelled</option>
                  <option value="exam">Exam Schedule</option>
                  <option value="general">General Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Code (Optional)
                </label>
                <Input
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  placeholder="e.g. CSE 2101"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Department *
                </label>
                <select
                  aria-label="Target Department"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value as Department | "All")}
                  className="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Batch *
                </label>
                <Input
                  value={newBatch}
                  onChange={(e) => setNewBatch(e.target.value)}
                  placeholder="e.g. 50th or All"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Effective Date & Time (Asia/Dhaka) *
              </label>
              <Input
                type="datetime-local"
                value={newEffectiveAt}
                onChange={(e) => setNewEffectiveAt(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Details / Instructions (English) *
              </label>
              <Textarea
                rows={3}
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Specify the reason, new room number, or make-up schedule details..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Details (Bangla - Optional)
              </label>
              <Textarea
                rows={2}
                value={newBodyBn}
                onChange={(e) => setNewBodyBn(e.target.value)}
                placeholder="বাংলায় বিস্তারিত..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                {t.common.cancel}
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                {submitting ? t.common.loading : t.common.submit}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}
