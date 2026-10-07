"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { DataNotice } from "@/components/ui/DataNotice";
import { BusRoute, BusTrip } from "@/types/models";
import { fetchAllBusRoutes, fetchAllBusTrips, calculateNextBus, NextBusResult } from "@/lib/bus";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import {
  Bus,
  Clock,
  MapPin,
  Search,
  Star,
  ArrowRight,
  Info,
  Calendar,
  AlertCircle,
  Navigation,
} from "lucide-react";

const SAVED_ROUTE_STORAGE_KEY = "campusos_saved_bus_route";

export default function BusSchedulePage() {
  const { language, t } = useLanguage();
  const { success } = useToast();

  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [trips, setTrips] = useState<BusTrip[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRouteId, setSelectedRouteId] = useState<string>("");
  const [directionFilter, setDirectionFilter] = useState<"all" | "to_campus" | "from_campus">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedRouteId, setSavedRouteId] = useState<string>("");

  // Countdown timer state
  const [nextBusData, setNextBusData] = useState<NextBusResult | null>(null);
  const [nowTick, setNowTick] = useState(Date.now());

  // Load saved favourite route from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SAVED_ROUTE_STORAGE_KEY);
      if (saved) {
        setSavedRouteId(saved);
        setSelectedRouteId(saved);
      }
    }
  }, []);

  // Fetch routes and trips
  useEffect(() => {
    async function load() {
      setLoading(true);
      const [allRoutes, allTrips] = await Promise.all([
        fetchAllBusRoutes(),
        fetchAllBusTrips(),
      ]);
      setRoutes(allRoutes);
      setTrips(allTrips);
      setSelectedRouteId((curr) => curr || (allRoutes.length > 0 ? allRoutes[0].id : ""));
      setLoading(false);
    }
    load();
  }, []);

  // Update countdown clock every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTick(Date.now());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Recalculate next bus whenever selected route, direction, or time changes
  useEffect(() => {
    if (routes.length === 0 || trips.length === 0) return;
    const activeRouteId = selectedRouteId || savedRouteId || routes[0]?.id;
    const dir = directionFilter === "all" ? undefined : directionFilter;
    const result = calculateNextBus(trips, routes, activeRouteId, dir);
    setNextBusData(result);
  }, [routes, trips, selectedRouteId, savedRouteId, directionFilter, nowTick]);

  // Toggle favourite route
  const handleToggleFavourite = (routeId: string) => {
    if (savedRouteId === routeId) {
      setSavedRouteId("");
      localStorage.removeItem(SAVED_ROUTE_STORAGE_KEY);
      success("Removed route from favourites");
    } else {
      setSavedRouteId(routeId);
      localStorage.setItem(SAVED_ROUTE_STORAGE_KEY, routeId);
      success("Saved as favourite route for instant countdown!");
    }
  };

  // Filter routes based on search query (by area, stop, route name)
  const filteredRoutes = useMemo(() => {
    if (!searchQuery.trim()) return routes;
    const q = searchQuery.toLowerCase().trim();
    return routes.filter((r) => {
      const matchName = r.name.toLowerCase().includes(q) || (r.name_bn && r.name_bn.includes(q));
      const matchNumber = r.routeNumber.toLowerCase().includes(q);
      const matchVia = r.via.toLowerCase().includes(q);
      const matchStops =
        r.stops.some((s) => s.toLowerCase().includes(q)) ||
        (r.stops_bn && r.stops_bn.some((s) => s.includes(q)));
      return matchName || matchNumber || matchVia || matchStops;
    });
  }, [routes, searchQuery]);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const activeTrips = useMemo(() => {
    if (!activeRoute) return [];
    return trips.filter((t) => {
      const matchRoute = t.routeId === activeRoute.id;
      if (directionFilter === "to_campus") return matchRoute && t.direction === "to_campus";
      if (directionFilter === "from_campus") return matchRoute && t.direction === "from_campus";
      return matchRoute;
    });
  }, [trips, activeRoute, directionFilter]);

  // Format countdown minutes into hours & mins
  const formatCountdown = (mins: number) => {
    if (mins <= 0) return "Departing right now";
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    if (hours === 0) return `${remainder} min`;
    return `${hours}h ${remainder}m`;
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        <PageHeader
          title={language === "bn" ? "ক্যাম্পাস বাস সার্ভিস ও রুট শিডিউল" : "Campus Bus Schedule & Shuttle Routes"}
          subtitle={
            language === "bn"
              ? "সিটি বিশ্ববিদ্যালয় সাভার স্থায়ী ক্যাম্পাস ↔ ঢাকা শহরের বিভিন্ন পয়েন্টের বাস সময়সূচী ও লাইভ কাউন্টডাউন।"
              : "Official schedule and next-bus countdown between City University permanent campus (Khagan, Savar) and Dhaka city points."
          }
        />

        {/* Persistent demo data notice per Section 7.3 & 10 */}
        <DataNotice
          message={
            language === "bn"
              ? "বাসের রুট এবং সময়সূচী হ্যাকাথনের জন্য ডেমো ডেটা। প্রকৃত বাসের সময়সূচী প্রশাসন ভবনে অথবা পরিবহন দপ্তরে যাচাই করুন।"
              : "Bus routes, stops, and departure times are sample hackathon data. City University operates dedicated buses on major routes; consult the Transport Office for current operational schedules."
          }
        />

        {/* Live Next-Bus Countdown Hero Widget */}
        {nextBusData && activeRoute && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-campus-navy-900 via-campus-navy-950 to-campus-navy-900 text-white p-6 md:p-8 shadow-xl border border-campus-navy-800">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="gold" className="text-xs font-bold uppercase tracking-wider">
                    {nextBusData.route.routeNumber}
                  </Badge>
                  <span className="text-xs text-slate-300 font-medium">
                    {nextBusData.trip.direction === "to_campus"
                      ? "To Permanent Campus"
                      : "From Campus to City"}
                  </span>
                  {savedRouteId === nextBusData.route.id && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-campus-gold-400 bg-campus-gold-950/60 border border-campus-gold-500/30 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-campus-gold-400" />
                      Favourite
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {language === "bn" && nextBusData.route.name_bn
                    ? nextBusData.route.name_bn
                    : nextBusData.route.name}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-campus-gold-400 shrink-0" />
                  <span>Via: {nextBusData.route.via}</span>
                </p>
              </div>

              {/* Countdown Card */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-center bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg min-w-[200px]">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {nextBusData.isToday ? "Departs in" : "First Bus Tomorrow"}
                </span>
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-campus-gold-400 my-0.5">
                  {formatCountdown(nextBusData.minutesRemaining)}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <Clock className="w-3.5 h-3.5 text-campus-gold-400" />
                  <span>
                    Scheduled Departure: <strong className="text-white">{nextBusData.trip.departureTime}</strong> (Dhaka Time)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-campus-gold-400" />
                <span>Calculated using Asia/Dhaka standard time</span>
              </span>
              <button
                onClick={() => handleToggleFavourite(activeRoute.id)}
                className="hover:text-campus-gold-300 text-campus-gold-400 font-medium inline-flex items-center gap-1 transition"
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    savedRouteId === activeRoute.id ? "fill-campus-gold-400" : ""
                  }`}
                />
                <span>
                  {savedRouteId === activeRoute.id
                    ? "Saved as Favourite"
                    : "Save this route as favourite"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Route Selector & Search Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Search stops / locations */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder='Search by stop or location (e.g., "Mirpur", "Uttara", "Gabtoli", "Birulia")...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          {/* Direction Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-md text-xs">
            <button
              onClick={() => setDirectionFilter("all")}
              className={`flex-1 py-1.5 px-2 rounded font-medium transition ${
                directionFilter === "all"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              All Trips
            </button>
            <button
              onClick={() => setDirectionFilter("to_campus")}
              className={`flex-1 py-1.5 px-2 rounded font-medium transition ${
                directionFilter === "to_campus"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              To Campus
            </button>
            <button
              onClick={() => setDirectionFilter("from_campus")}
              className={`flex-1 py-1.5 px-2 rounded font-medium transition ${
                directionFilter === "from_campus"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              From Campus
            </button>
          </div>
        </div>

        {/* Route Selector Tabs / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filteredRoutes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            const isFav = route.id === savedRouteId;
            return (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
                  isSelected
                    ? "bg-campus-navy-900 text-white border-campus-navy-900 shadow-sm dark:bg-campus-gold-600 dark:border-campus-gold-600 dark:text-campus-navy-950"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <span className="font-mono">{route.routeNumber}</span>
                <span>{route.origin.split(",")[0]} ↔ Campus</span>
                {isFav && <Star className="w-3 h-3 fill-campus-gold-400 text-campus-gold-400 ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Detailed Route View & Trip Timetable */}
        {activeRoute && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Timetable */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{activeRoute.routeNumber}</Badge>
                      <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                        {language === "bn" && activeRoute.name_bn ? activeRoute.name_bn : activeRoute.name}
                      </h3>
                      <DemoBadge size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{activeRoute.description}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavourite(activeRoute.id)}
                    className="shrink-0"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        savedRouteId === activeRoute.id
                          ? "fill-campus-gold-500 text-campus-gold-500"
                          : "text-slate-400"
                      }`}
                    />
                  </Button>
                </div>

                {/* Timetable grid */}
                <div className="pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Departure Timetable (Asia/Dhaka)</span>
                  </h4>

                  {activeTrips.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No scheduled trips found matching the selected direction filter.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                            <th className="py-2.5 px-3 font-semibold">Direction</th>
                            <th className="py-2.5 px-3 font-semibold">Departure Time</th>
                            <th className="py-2.5 px-3 font-semibold">Operating Days</th>
                            <th className="py-2.5 px-3 font-semibold">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                          {activeTrips.map((trip) => {
                            const isToCampus = trip.direction === "to_campus";
                            const daysLabel =
                              trip.daysOfWeek.length === 7
                                ? "Daily (All Days)"
                                : trip.daysOfWeek.length === 5 && !trip.daysOfWeek.includes(5)
                                ? "Sun – Thu"
                                : "Scheduled Days";

                            return (
                              <tr
                                key={trip.id}
                                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                              >
                                <td className="py-2.5 px-3">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                                      isToCampus
                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                        : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                                    }`}
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                    {isToCampus ? "To Campus" : "From Campus"}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                                  {trip.departureTime}
                                </td>
                                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                                  {daysLabel}
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                                  {trip.notes || "Regular shuttle"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </Card>

              {/* Special Note / Exam Period Trips */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold mb-0.5">
                      Exam Period & Late Evening Shuttle Note
                    </strong>
                    <span>
                      During Trimester Midterm and Final Exam sessions, auxiliary shuttle trips depart campus at 18:30 and 19:30. Weekend shuttles operate on Friday/Saturday for designated evening executive programmes.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Ordered Stops Pipeline */}
            <div className="space-y-6">
              <Card>
                <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-campus-navy-700 dark:text-campus-gold-400" />
                  <span>Ordered Route Stops & Pickups</span>
                </h4>

                <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {activeRoute.stops.map((stop, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === activeRoute.stops.length - 1;
                    const stopBn = activeRoute.stops_bn && activeRoute.stops_bn[idx];

                    return (
                      <div key={idx} className="relative flex items-start gap-3">
                        <div
                          className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 bg-white dark:bg-slate-900 ${
                            isFirst
                              ? "border-emerald-600 ring-2 ring-emerald-200 dark:ring-emerald-900"
                              : isLast
                              ? "border-campus-gold-600 ring-2 ring-campus-gold-200 dark:ring-campus-gold-900"
                              : "border-slate-400"
                          }`}
                        />
                        <div className="text-xs">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {language === "bn" && stopBn ? stopBn : stop}
                          </p>
                          <span className="text-[10px] text-slate-500">
                            {isFirst ? "Origin Point" : isLast ? "Destination Campus" : `Stop #${idx + 1}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Transport Office Contact Card */}
              <Card className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Transport Helpdesk
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  For shuttle delay inquiries or route feedback, reach out to the university transport desk:
                </p>
                <div className="space-y-1.5 text-xs">
                  <p className="text-slate-800 dark:text-slate-200 font-mono">
                    ☎ Telephone: <strong>09643-234234</strong>
                  </p>
                  <p className="text-slate-800 dark:text-slate-200 font-mono">
                    📱 Query Cell: <strong>+8801322917670</strong>
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    City University Transport Section, Admin Building Ground Floor
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
