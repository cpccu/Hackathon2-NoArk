import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase/client";
import { BusRoute, BusTrip } from "@/types/models";
import { INITIAL_BUS_ROUTES, INITIAL_BUS_TRIPS } from "@/data/initialBus";
import { DHAKA_TIMEZONE } from "./date";

export interface NextBusResult {
  trip: BusTrip;
  route: BusRoute;
  isToday: boolean;
  departureDateStr: string; // ISO or formatted date
  minutesRemaining: number;
}

/**
 * Fetch all bus routes with local fallback.
 */
export async function fetchAllBusRoutes(): Promise<BusRoute[]> {
  try {
    const q = query(collection(db, "busRoutes"), orderBy("routeNumber", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const routes: BusRoute[] = [];
      snap.forEach((d) => routes.push({ id: d.id, ...d.data() } as BusRoute));
      return routes;
    }
  } catch (err) {
    console.warn("Firestore fetchAllBusRoutes fallback:", err);
  }
  return INITIAL_BUS_ROUTES;
}

/**
 * Fetch all bus trips with local fallback.
 */
export async function fetchAllBusTrips(): Promise<BusTrip[]> {
  try {
    const q = query(collection(db, "busTrips"), orderBy("departureTime", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const trips: BusTrip[] = [];
      snap.forEach((d) => trips.push({ id: d.id, ...d.data() } as BusTrip));
      return trips;
    }
  } catch (err) {
    console.warn("Firestore fetchAllBusTrips fallback:", err);
  }
  return INITIAL_BUS_TRIPS;
}

/**
 * Calculate the next bus for a given route or across all routes,
 * strictly computed using Asia/Dhaka time.
 * If no buses remain today, finds the first bus tomorrow.
 */
export function calculateNextBus(
  trips: BusTrip[],
  routes: BusRoute[],
  filterRouteId?: string,
  direction?: "to_campus" | "from_campus"
): NextBusResult | null {
  const now = new Date();

  // Get current Dhaka day of week (0 = Sun, 1 = Mon ... 6 = Sat)
  const dhakaDayStr = new Intl.DateTimeFormat("en-US", {
    timeZone: DHAKA_TIMEZONE,
    weekday: "short",
  }).format(now);

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const todayDayOfWeek = dayMap[dhakaDayStr] ?? 0;
  const tomorrowDayOfWeek = (todayDayOfWeek + 1) % 7;

  // Get current Dhaka hours and minutes
  const dhakaTimeParts = new Intl.DateTimeFormat("en-US", {
    timeZone: DHAKA_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  let currentHour = 0;
  let currentMinute = 0;
  for (const part of dhakaTimeParts) {
    if (part.type === "hour") currentHour = parseInt(part.value, 10);
    if (part.type === "minute") currentMinute = parseInt(part.value, 10);
  }
  const currentTotalMinutes = currentHour * 60 + currentMinute;

  // Filter trips for selected route and direction
  let candidateTrips = trips;
  if (filterRouteId) {
    candidateTrips = candidateTrips.filter((t) => t.routeId === filterRouteId);
  }
  if (direction) {
    candidateTrips = candidateTrips.filter((t) => t.direction === direction);
  }

  // 1. Look for remaining trips TODAY
  const todayTrips = candidateTrips
    .filter((t) => t.daysOfWeek.includes(todayDayOfWeek))
    .map((t) => {
      const [h, m] = t.departureTime.split(":").map(Number);
      const tripMinutes = h * 60 + m;
      return { trip: t, tripMinutes, diffMinutes: tripMinutes - currentTotalMinutes };
    })
    .filter((item) => item.diffMinutes >= 0)
    .sort((a, b) => a.diffMinutes - b.diffMinutes);

  if (todayTrips.length > 0) {
    const next = todayTrips[0];
    const route = routes.find((r) => r.id === next.trip.routeId);
    if (route) {
      return {
        trip: next.trip,
        route,
        isToday: true,
        departureDateStr: "Today",
        minutesRemaining: next.diffMinutes,
      };
    }
  }

  // 2. If no more buses today, find the first bus TOMORROW
  const tomorrowTrips = candidateTrips
    .filter((t) => t.daysOfWeek.includes(tomorrowDayOfWeek))
    .map((t) => {
      const [h, m] = t.departureTime.split(":").map(Number);
      const tripMinutes = h * 60 + m;
      const diffMinutes = 24 * 60 - currentTotalMinutes + tripMinutes;
      return { trip: t, tripMinutes, diffMinutes };
    })
    .sort((a, b) => a.tripMinutes - b.tripMinutes);

  if (tomorrowTrips.length > 0) {
    const next = tomorrowTrips[0];
    const route = routes.find((r) => r.id === next.trip.routeId);
    if (route) {
      return {
        trip: next.trip,
        route,
        isToday: false,
        departureDateStr: "Tomorrow",
        minutesRemaining: next.diffMinutes,
      };
    }
  }

  return null;
}
