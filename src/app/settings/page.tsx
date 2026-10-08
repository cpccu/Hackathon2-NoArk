"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Settings,
  Bell,
  Wifi,
  WifiOff,
  Moon,
  Globe,
  Bus,
  Save,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const [isOnline, setIsOnline] = useState(true);
  const [savedRoute, setSavedRoute] = useState("R1");
  const [notifyEvents, setNotifyEvents] = useState(true);
  const [notifyClasses, setNotifyClasses] = useState(true);
  const [notifyComplaints, setNotifyComplaints] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      const route = localStorage.getItem("campusos_saved_bus_route") || "R1";
      setSavedRoute(route);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  function handleSaveSettings() {
    if (typeof window !== "undefined") {
      localStorage.setItem("campusos_saved_bus_route", savedRoute);
      localStorage.setItem("campusos_notify_events", String(notifyEvents));
      localStorage.setItem("campusos_notify_classes", String(notifyClasses));
      localStorage.setItem("campusos_notify_complaints", String(notifyComplaints));
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  }

  function handleClearCache() {
    if (typeof window !== "undefined") {
      if (confirm("Reset offline caches and local settings?")) {
        localStorage.removeItem("campusos_saved_bus_route");
        localStorage.removeItem("campusos_first_week_checklist");
        alert("Cache cleared successfully.");
      }
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Preferences & App Settings"
        subtitle="Manage bilingual display, default bus route synchronization, offline storage, and reminder notifications."
      />

      <div className="max-w-3xl space-y-8 mb-16">
        {/* Offline & Network Telemetry Card */}
        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg ${
                  isOnline
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                }`}
              >
                {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                    Network Status: {isOnline ? "Connected (Online)" : "Offline Mode"}
                  </h3>
                  <Badge variant={isOnline ? "success" : "danger"} size="sm">
                    {isOnline ? "Cloud Sync Active" : "Local Cache Only"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Saved QR tickets, permanent bus schedules, and helpdesk FAQs remain instantly accessible even with spotty campus Wi-Fi.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Display & Language */}
        <Card className="p-6 space-y-6">
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Globe className="w-4 h-4 text-campus-navy-700 dark:text-campus-gold-400" />
            <span>Localization & Aesthetics</span>
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Interface Language
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Toggle between standard English and Noto Sans Bengali.
              </div>
            </div>
            <LanguageToggle />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Theme (Light / Dark Mode)
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                WCAG AA compliant contrast with deep navy academic tones.
              </div>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Primary Bus Shuttle Route
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Used to compute the real-time next-bus departure countdown on your Today dashboard.
              </div>
            </div>
            <select
              aria-label="Primary Bus Shuttle Route"
              value={savedRoute}
              onChange={(e) => setSavedRoute(e.target.value)}
              className="text-xs sm:text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
            >
              <option value="R1">Route 1 (R1): Gabtoli ↔ Campus</option>
              <option value="R2">Route 2 (R2): Mirpur-10 ↔ Campus</option>
              <option value="R3">Route 3 (R3): Uttara ↔ Campus</option>
              <option value="R4">Route 4 (R4): Dhanmondi ↔ Campus</option>
              <option value="R5">Route 5 (R5): Savar Shuttle</option>
            </select>
          </div>
        </Card>

        {/* In-App Notifications */}
        <Card className="p-6 space-y-6">
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Bell className="w-4 h-4 text-campus-navy-700 dark:text-campus-gold-400" />
            <span>Campus Notification Preferences</span>
          </h3>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyEvents}
                onChange={(e) => setNotifyEvents(e.target.checked)}
                className="mt-1 rounded border-slate-300 text-campus-navy-800 focus:ring-campus-navy-600"
              />
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Event Reminders (24h & 1h Prior)
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculated automatically on app launch for all confirmed QR tickets without external server cron jobs.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyClasses}
                onChange={(e) => setNotifyClasses(e.target.checked)}
                className="mt-1 rounded border-slate-300 text-campus-navy-800 focus:ring-campus-navy-600"
              />
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Class Schedule Disruptions
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Alerts when faculty post cancellations or room shifts for your department and batch.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyComplaints}
                onChange={(e) => setNotifyComplaints(e.target.checked)}
                className="mt-1 rounded border-slate-300 text-campus-navy-800 focus:ring-campus-navy-600"
              />
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Grievance & Claim Milestones
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Updates when administration appends notes to your complaint tracking timeline.
                </p>
              </div>
            </label>
          </div>
        </Card>

        {/* Save & Reset Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCache}
            className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Storage Cache</span>
          </Button>

          <Button
            variant="primary"
            onClick={handleSaveSettings}
            className="flex items-center gap-2"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
