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
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { DirectoryEntry, DirectoryKind } from "@/types/models";
import { fetchDirectoryEntries, addDirectoryEntry } from "@/lib/directory";
import { formatDhakaDateTime } from "@/lib/date";
import {
  ExternalLink,
  Search,
  PlusCircle,
  FileSpreadsheet,
  Globe,
  Users,
  MessageCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Compass,
} from "lucide-react";

export default function DirectoryPage() {
  const { user, profile } = useAuth();
  const { t, language } = useLanguage();

  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Suggest Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestTitle, setSuggestTitle] = useState("");
  const [suggestKind, setSuggestKind] = useState<DirectoryKind>("google_form");
  const [suggestUrl, setSuggestUrl] = useState("");
  const [suggestDescription, setSuggestDescription] = useState("");
  const [suggestDeadline, setSuggestDeadline] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  useEffect(() => {
    loadDirectory();
  }, []);

  async function loadDirectory() {
    setLoading(true);
    try {
      const data = await fetchDirectoryEntries();
      setEntries(data);
    } catch (err) {
      console.error("Failed to load directory entries:", err);
    } finally {
      setLoading(false);
    }
  }

  // Filter entries
  const filteredEntries = entries.filter((item) => {
    // Kind filter
    if (activeFilter !== "all" && item.kind !== activeFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchTitleBn = item.title_bn?.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchClub = item.ownerClub?.toLowerCase().includes(q);
      if (!matchTitle && !matchTitleBn && !matchDesc && !matchClub) {
        return false;
      }
    }

    return true;
  });

  // Calculate closing soon items (deadline exists and within next 5 days, and isOpen)
  const now = new Date();
  const closingSoonItems = entries.filter((item) => {
    if (!item.deadline || !item.isOpen) return false;
    const deadlineDate = new Date(item.deadline);
    const diffHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 120; // within 5 days
  });

  // Start here items (Official Links)
  const startHereItems = entries.filter((item) => item.kind === "official_link");

  function getKindIcon(kind: DirectoryKind) {
    switch (kind) {
      case "official_link":
        return <Globe className="w-5 h-5 text-campus-navy-700 dark:text-campus-gold-400" />;
      case "google_form":
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case "facebook_group":
        return <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "messenger_group":
        return <MessageCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  }

  function getKindLabel(kind: DirectoryKind) {
    switch (kind) {
      case "official_link":
        return "Official Portal";
      case "google_form":
        return "Google Form";
      case "facebook_group":
        return "Facebook Group";
      case "messenger_group":
        return "Messenger Chat";
    }
  }

  async function handleSuggest(e: React.FormEvent) {
    e.preventDefault();
    if (!suggestTitle || !suggestUrl || !suggestDescription) return;

    setSuggesting(true);
    try {
      await addDirectoryEntry({
        title: suggestTitle,
        kind: suggestKind,
        url: suggestUrl,
        description: suggestDescription,
        deadline: suggestDeadline || undefined,
        isOpen: true,
        source: "demo",
      });

      setSuggestSuccess(true);
      setTimeout(() => {
        setSuggestSuccess(false);
        setIsModalOpen(false);
        setSuggestTitle("");
        setSuggestUrl("");
        setSuggestDescription("");
        setSuggestDeadline("");
        loadDirectory();
      }, 1500);
    } catch (err) {
      console.error("Failed to suggest entry:", err);
      alert("Submission failed. Please check network connection.");
    } finally {
      setSuggesting(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title={t.directory.title}
        subtitle={t.directory.subtitle}
        badge={
          <Badge variant="gold" size="md">
            Verified Links
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {t.directory.suggestLink}
          </Button>
        }
      />

      <DataNotice
        className="mb-8"
        message="Official institutional web portals link directly to City University servers. Student community groups are managed by verified club executives and CRs."
      />

      {/* Start Here: Essential University Portals */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-5 h-5 text-campus-navy-700 dark:text-campus-gold-400" />
          <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
            {t.directory.startHere}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {startHereItems.map((item) => {
            const isBangla = language === "bn" && item.title_bn;
            const title = isBangla ? item.title_bn : item.title;

            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Card variant="interactive" className="h-full flex flex-col justify-between border-slate-200 dark:border-slate-800 hover:border-campus-navy-600 dark:hover:border-campus-gold-500">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                        {getKindIcon(item.kind)}
                      </div>
                      <Badge variant="outline" size="sm">
                        {item.source === "official" ? "Official" : "Demo"}
                      </Badge>
                    </div>

                    <h3 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-campus-navy-700 dark:group-hover:text-campus-gold-400 transition flex items-center justify-between">
                      <span>{title}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
                    </h3>

                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-campus-navy-700 dark:text-campus-gold-400 truncate">
                    {item.url.replace(/^https?:\/\//, "")}
                  </div>
                </Card>
              </a>
            );
          })}
        </div>
      </section>

      {/* Closing Soon Strip */}
      {closingSoonItems.length > 0 && (
        <section className="mb-10 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <h2 className="font-serif text-base font-bold text-amber-900 dark:text-amber-200">
              {t.directory.closingSoon}
            </h2>
            <Badge variant="danger" size="sm">Urgent</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {closingSoonItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-lg p-3.5 flex items-start justify-between gap-3 shadow-xs hover:border-amber-500 transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mb-2">
                      {item.description}
                    </p>
                    <div className="text-[11px] text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Closes: {formatDhakaDateTime(item.deadline!)}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 text-xs">
                    Open Form
                  </Button>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Search and Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "all", label: t.common.all },
            { id: "official_link", label: "Official" },
            { id: "google_form", label: "Google Forms" },
            { id: "facebook_group", label: "Facebook" },
            { id: "messenger_group", label: "Messenger" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                activeFilter === f.id
                  ? "bg-campus-navy-950 text-white dark:bg-campus-gold-400 dark:text-slate-950"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.directory.searchPlaceholder}
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-campus-navy-600 dark:focus:ring-campus-gold-400"
          />
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-slate-500 text-sm">{t.common.empty}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((item) => {
            const isBangla = language === "bn" && item.title_bn;
            const title = isBangla ? item.title_bn : item.title;

            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Card variant="interactive" className="h-full flex flex-col justify-between hover:border-campus-navy-600 dark:hover:border-campus-gold-400">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getKindIcon(item.kind)}
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {getKindLabel(item.kind)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.isOpen ? (
                          <Badge variant="success" size="sm">
                            {t.directory.openStatus}
                          </Badge>
                        ) : (
                          <Badge variant="danger" size="sm">
                            {t.directory.closedStatus}
                          </Badge>
                        )}
                        {item.source === "demo" && <DemoBadge />}
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-campus-navy-700 dark:group-hover:text-campus-gold-400 transition flex items-center justify-between">
                      <span>{title}</span>
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
                    </h3>

                    {item.ownerClub && (
                      <div className="text-xs font-medium text-campus-navy-700 dark:text-campus-gold-400 mt-1">
                        Hosted by: {item.ownerClub}
                      </div>
                    )}

                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[200px] font-mono text-[11px]">
                      {item.url.replace(/^https?:\/\//, "")}
                    </span>
                    {item.deadline && (
                      <span className="text-amber-700 dark:text-amber-400 font-medium">
                        Due: {formatDhakaDateTime(item.deadline)}
                      </span>
                    )}
                  </div>
                </Card>
              </a>
            );
          })}
        </div>
      )}

      {/* Suggest Link Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={t.directory.suggestLink}
        >
          {suggestSuccess ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Link Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your resource has been logged and published to the directory.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSuggest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title or Organization *
                </label>
                <Input
                  value={suggestTitle}
                  onChange={(e) => setSuggestTitle(e.target.value)}
                  placeholder="e.g. CSE Batch 51st Official Chat"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  aria-label="Category"
                  value={suggestKind}
                  onChange={(e) => setSuggestKind(e.target.value as DirectoryKind)}
                  className="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                >
                  <option value="google_form">Google Form</option>
                  <option value="facebook_group">Facebook Community Group</option>
                  <option value="messenger_group">Messenger Chat</option>
                  <option value="official_link">Official Portal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL / Web Link *
                </label>
                <Input
                  type="url"
                  value={suggestUrl}
                  onChange={(e) => setSuggestUrl(e.target.value)}
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Response Deadline (If applicable)
                </label>
                <Input
                  type="datetime-local"
                  value={suggestDeadline}
                  onChange={(e) => setSuggestDeadline(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Purpose / Description *
                </label>
                <Textarea
                  rows={3}
                  value={suggestDescription}
                  onChange={(e) => setSuggestDescription(e.target.value)}
                  placeholder="Explain what this form collects or who should join this group..."
                  required
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
                <Button type="submit" variant="primary" size="sm" disabled={suggesting}>
                  {suggesting ? t.common.loading : t.common.submit}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </AppShell>
  );
}
