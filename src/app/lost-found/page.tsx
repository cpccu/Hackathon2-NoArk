"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { LostFoundItem, LostFoundKind } from "@/types/models";
import { fetchAllLostFound, submitClaim, updateLostFoundStatus } from "@/lib/lostFound";
import { formatDhakaDate, formatDhakaDateTime } from "@/lib/date";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Search,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Tag,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function LostFoundPage() {
  const { user, profile } = useAuth();
  const { success, error } = useToast();

  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs & filters
  const [activeTab, setActiveTab] = useState<"all" | "lost" | "found" | "returned">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Claim modal state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null);
  const [claimAnswer, setClaimAnswer] = useState("");
  const [claimContact, setClaimContact] = useState("");
  const [submittingClaim, setSubmittingClaim] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllLostFound();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openClaimModal = (item: LostFoundItem) => {
    if (!user) {
      error("Please sign in to submit an ownership claim.");
      return;
    }
    setSelectedItem(item);
    setClaimAnswer("");
    setClaimContact(profile?.department || "");
    setClaimModalOpen(true);
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !user) return;
    setSubmittingClaim(true);

    try {
      await submitClaim({
        itemId: selectedItem.id,
        itemTitle: selectedItem.title,
        claimantId: user.uid,
        claimantName: profile?.name || user.email?.split("@")[0] || "Student",
        claimantDept: profile?.department || "CSE",
        claimantBatch: profile?.batch || "50th",
        claimantContact: claimContact,
        answer: claimAnswer,
        posterId: selectedItem.createdBy,
      });

      success("Claim submitted successfully! The finder will review your verification answer.");
      setClaimModalOpen(false);
    } catch (err: any) {
      error(err.message || "Failed to submit claim.");
    } finally {
      setSubmittingClaim(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tab filter
      if (activeTab === "lost" && item.kind !== "lost") return false;
      if (activeTab === "found" && (item.kind !== "found" || item.status === "returned")) return false;
      if (activeTab === "returned" && item.status !== "returned") return false;

      // Category
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchLoc;
      }

      return true;
    });
  }, [items, activeTab, selectedCategory, searchQuery]);

  // Suggested matches for lost items
  const suggestedMatches = useMemo(() => {
    if (activeTab !== "lost" || items.length === 0) return [];
    const lostItems = items.filter((i) => i.kind === "lost" && i.status === "open");
    const foundItems = items.filter((i) => i.kind === "found" && i.status === "open");

    const matches: { lost: LostFoundItem; found: LostFoundItem }[] = [];
    for (const l of lostItems) {
      for (const f of foundItems) {
        if (l.category === f.category) {
          // simple keyword overlap
          const lWords = l.title.toLowerCase().split(/\s+/);
          const fWords = f.title.toLowerCase().split(/\s+/);
          if (lWords.some((w) => w.length > 3 && fWords.includes(w))) {
            matches.push({ lost: l, found: f });
          }
        }
      }
    }
    return matches;
  }, [items, activeTab]);

  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        <PageHeader
          title="Lost & Found Registry"
          subtitle="Community retrieval hub for lost student cards, calculators, electronics, and keys across City University campus."
          actions={
            <Link href="/lost-found/new">
              <Button variant="gold" size="sm" className="flex items-center gap-1.5 shadow-sm">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Item</span>
              </Button>
            </Link>
          }
        />

        {/* Suggested Matches Notification */}
        {suggestedMatches.length > 0 && (
          <div className="p-3.5 rounded-xl bg-campus-gold-50 dark:bg-campus-gold-950/40 border border-campus-gold-300 dark:border-campus-gold-800 text-xs text-campus-gold-950 dark:text-campus-gold-200">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-campus-gold-600 dark:text-campus-gold-400" />
              <strong className="font-bold">Potential Suggested Match Found!</strong>
            </div>
            <p>
              We detected a found item &ldquo;{suggestedMatches[0].found.title}&rdquo; that closely matches lost report &ldquo;{suggestedMatches[0].lost.title}&rdquo; in {suggestedMatches[0].lost.category}.
            </p>
          </div>
        )}

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by item title, description, or campus building..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs"
          >
            <option value="all">All Categories</option>
            <option value="ID Card / Documents">ID Card / Documents</option>
            <option value="Electronics">Electronics</option>
            <option value="Keys">Keys</option>
            <option value="Bag / Wallet">Bag / Wallet</option>
            <option value="Clothing">Clothing</option>
            <option value="Other">Other Items</option>
          </Select>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition ${
              activeTab === "all"
                ? "bg-campus-navy-950 text-white dark:bg-campus-gold-600 dark:text-campus-navy-950"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            All Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab("lost")}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition ${
              activeTab === "lost"
                ? "bg-rose-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Lost ({items.filter((i) => i.kind === "lost").length})
          </button>
          <button
            onClick={() => setActiveTab("found")}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition ${
              activeTab === "found"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Found ({items.filter((i) => i.kind === "found" && i.status !== "returned").length})
          </button>
          <button
            onClick={() => setActiveTab("returned")}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition ${
              activeTab === "returned"
                ? "bg-campus-navy-900 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Recently Returned ({items.filter((i) => i.status === "returned").length})
          </button>
        </div>

        {/* Items Listing */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading lost and found items...</div>
        ) : filteredItems.length === 0 ? (
          <Card className="text-center py-12">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-sm">No items matching criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Have you misplaced something or found a student card? Post a report to alert campus peers!
            </p>
            <Link href="/lost-found/new">
              <Button variant="outline" size="sm">
                Report an Item
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const isFound = item.kind === "found";
              const isReturned = item.status === "returned";
              const isClaimed = item.status === "claimed";

              return (
                <Card
                  key={item.id}
                  className="flex flex-col justify-between p-4 sm:p-5 hover:border-campus-navy-300 dark:hover:border-campus-gold-500 transition shadow-sm"
                >
                  <div className="space-y-3">
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isReturned
                              ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              : isFound
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {isReturned ? "Returned to Owner" : isFound ? "FOUND" : "LOST"}
                        </span>
                        <Badge variant="default">{item.category}</Badge>
                        {isClaimed && !isReturned && (
                          <Badge variant="warning">Claim Under Review</Badge>
                        )}
                      </div>
                      <DemoBadge size="sm" />
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Logistics */}
                    <div className="space-y-1 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-campus-navy-700 dark:text-campus-gold-400 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Reported on {formatDhakaDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Claiming */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">By {item.createdByName}</span>

                    {isFound && !isReturned && item.status === "open" && (
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => openClaimModal(item)}
                        className="text-xs"
                      >
                        This is Mine (Claim)
                      </Button>
                    )}

                    {!isFound && item.contactPhone && (
                      <a
                        href={`tel:${item.contactPhone}`}
                        className="text-xs font-semibold text-campus-navy-700 dark:text-campus-gold-400 hover:underline"
                      >
                        Contact: {item.contactPhone}
                      </a>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Claim Modal with Verification Question */}
        <Modal
          isOpen={claimModalOpen}
          onClose={() => setClaimModalOpen(false)}
          title="Claim Found Campus Property"
        >
          {selectedItem && (
            <form onSubmit={handleClaimSubmit} className="space-y-3.5 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                You are claiming: <strong>{selectedItem.title}</strong> found at {selectedItem.location}.
              </p>

              {selectedItem.verificationQuestion && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                  <strong className="block font-semibold mb-1">
                    Finder&apos;s Verification Question:
                  </strong>
                  <p>{selectedItem.verificationQuestion}</p>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Answer / Identifying Details *
                </label>
                <Input
                  type="text"
                  placeholder="Provide precise details to prove ownership..."
                  value={claimAnswer}
                  onChange={(e) => setClaimAnswer(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Department / Contact Phone *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. CSE Batch 50 / 01700-XXXXXX"
                  value={claimContact}
                  onChange={(e) => setClaimContact(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setClaimModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="gold" size="sm" disabled={submittingClaim}>
                  {submittingClaim ? "Submitting..." : "Send Claim to Finder"}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </AppShell>
  );
}
