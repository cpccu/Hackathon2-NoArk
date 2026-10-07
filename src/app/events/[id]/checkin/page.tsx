"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { QRScanner } from "@/components/events/QRScanner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { CampusEvent, EventRegistration } from "@/types/models";
import { fetchEventById } from "@/lib/events";
import { getEventAttendees, verifyAndCheckInTicket } from "@/lib/registrations";
import { formatDhakaDateTime } from "@/lib/date";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Download,
  Users,
  Search,
  RefreshCw,
  QrCode,
} from "lucide-react";

export default function EventCheckInPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [attendees, setAttendees] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastScanResult, setLastScanResult] = useState<{
    success: boolean;
    message: string;
    attendee?: EventRegistration;
  } | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  const loadData = React.useCallback(async () => {
    setLoading(true);
    const ev = await fetchEventById(eventId);
    setEvent(ev);
    const list = await getEventAttendees(eventId);
    setAttendees(list);
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    if (eventId) loadData();
  }, [eventId, loadData]);

  const handleScan = async (token: string) => {
    const result = await verifyAndCheckInTicket(eventId, token);
    setLastScanResult(result);
    // Refresh attendees list
    const updated = await getEventAttendees(eventId);
    setAttendees(updated);
  };

  // CSV Export utility
  const handleExportCSV = () => {
    if (attendees.length === 0) return;

    const headers = [
      "Ticket ID",
      "Student Name",
      "Email",
      "Department",
      "Batch",
      "Status",
      "Checked In",
      "Checked In At (Dhaka Time)",
      "Registered At",
    ];

    const rows = attendees.map((a) => [
      `"${a.id}"`,
      `"${a.userName}"`,
      `"${a.userEmail}"`,
      `"${a.userDept}"`,
      `"${a.userBatch}"`,
      `"${a.status}"`,
      `"${a.checkedIn ? "YES" : "NO"}"`,
      `"${a.checkedInAt ? formatDhakaDateTime(a.checkedInAt) : "-"}"`,
      `"${formatDhakaDateTime(a.createdAt)}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendees_${eventId}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRegistered = attendees.filter((a) => a.status === "registered").length;
  const totalCheckedIn = attendees.filter((a) => a.checkedIn).length;
  const checkInRate = totalRegistered > 0 ? Math.round((totalCheckedIn / totalRegistered) * 100) : 0;

  const filteredAttendees = attendees.filter((a) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      a.userName.toLowerCase().includes(q) ||
      a.userEmail.toLowerCase().includes(q) ||
      a.userDept.toLowerCase().includes(q) ||
      a.userBatch.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q)
    );
  });

  return (
    <ProtectedRoute allowedRoles={["club_admin", "admin"]}>
      <AppShell>
        <div className="max-w-6xl mx-auto pb-12">
          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Event Detail</span>
          </Link>

          <PageHeader
            title="Entrance Check-in & Attendance"
            subtitle={`Scanning and registration tracking for: ${event?.title || "Campus Event"}`}
            actions={
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={loadData} className="gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </Button>
                <Button variant="gold" size="sm" onClick={handleExportCSV} className="gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </Button>
              </div>
            }
          />

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="border-l-4 border-l-campus-navy-800">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Registered</span>
              <p className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {totalRegistered} <span className="text-xs text-slate-400 font-sans font-normal">/ {event?.capacity || 0} cap</span>
              </p>
            </Card>

            <Card className="border-l-4 border-l-emerald-600">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Checked In at Venue</span>
              <p className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {totalCheckedIn} <span className="text-xs text-slate-400 font-sans font-normal">verified</span>
              </p>
            </Card>

            <Card className="border-l-4 border-l-campus-gold-500">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Check-in Turnout Rate</span>
              <p className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {checkInRate}%
              </p>
            </Card>
          </div>

          {/* Scanner & Live Result Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Scanner */}
            <Card>
              <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-campus-gold-600" />
                <span>Camera & Token Verifier</span>
              </h2>
              <QRScanner onScan={handleScan} />
            </Card>

            {/* Scan Feedback Result */}
            <Card className="flex flex-col justify-between">
              <div>
                <h2 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Last Verification Result
                </h2>

                {lastScanResult ? (
                  <div
                    className={`p-5 rounded-lg border text-sm animate-in fade-in-50 ${
                      lastScanResult.success
                        ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"
                        : "bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {lastScanResult.success ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong className="block text-base font-bold">
                          {lastScanResult.success ? "Check-in Granted" : "Verification Rejected"}
                        </strong>
                        <p className="mt-1 text-xs leading-relaxed">{lastScanResult.message}</p>

                        {lastScanResult.attendee && (
                          <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                            <p>Student: <strong>{lastScanResult.attendee.userName}</strong></p>
                            <p>Department: {lastScanResult.attendee.userDept} (Batch {lastScanResult.attendee.userBatch})</p>
                            <p>Email: {lastScanResult.attendee.userEmail}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-lg">
                    Point camera at student QR pass or enter code to verify entry.
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <span>Duplicate passes and cancelled registrations are rejected in real-time.</span>
              </div>
            </Card>
          </div>

          {/* Attendee Roster Table */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                  Attendee Roster & Log
                </h3>
                <p className="text-xs text-slate-500">
                  Showing {filteredAttendees.length} of {attendees.length} total signups.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter attendees..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px] border-y border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Check-in Status</th>
                    <th className="py-2.5 px-3">Check-in Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAttendees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No attendees registered yet for this event.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendees.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                          {att.userName}
                          <span className="block text-[10px] text-slate-400 font-normal">{att.userEmail}</span>
                        </td>
                        <td className="py-2.5 px-3">{att.userDept}</td>
                        <td className="py-2.5 px-3">{att.userBatch}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              att.status === "registered"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : att.status === "waitlisted"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {att.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {att.checkedIn ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                            </span>
                          ) : (
                            <span className="text-slate-400">Pending</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                          {att.checkedInAt ? formatDhakaDateTime(att.checkedInAt) : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
