/**
 * Timezone helpers for Asia/Dhaka per PROJECT_SPEC Section 2 Rule 6.
 * "All dates use Asia/Dhaka. Store UTC Firestore Timestamps / ISO strings;
 * format with Intl.DateTimeFormat and timeZone: 'Asia/Dhaka'."
 */

export const DHAKA_TIMEZONE = "Asia/Dhaka";

/**
 * Format an ISO string or Date into a human-readable Dhaka time string.
 * e.g. "Thursday, 8 October 2026, 3:00 PM"
 */
export function formatDhakaDateTime(dateInput: string | Date | number): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput);

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: DHAKA_TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Format just the date in Dhaka time.
 * e.g. "8 Oct 2026"
 */
export function formatDhakaDate(dateInput: string | Date | number): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput);

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: DHAKA_TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Format just the time in Dhaka time.
 * e.g. "03:30 PM"
 */
export function formatDhakaTime(dateInput: string | Date | number): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput);

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: DHAKA_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Returns current Date in Asia/Dhaka context
 */
export function getDhakaNow(): Date {
  const now = new Date();
  const dhakaStr = now.toLocaleString("en-US", { timeZone: DHAKA_TIMEZONE });
  return new Date(dhakaStr);
}

/**
 * Checks whether a given timestamp is today in Dhaka time
 */
export function isDhakaToday(dateInput: string | Date): boolean {
  const target = typeof dateInput === "object" ? dateInput : new Date(dateInput);
  const now = new Date();

  const targetDateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: DHAKA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(target);

  const nowDateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: DHAKA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  return targetDateStr === nowDateStr;
}

/**
 * Checks whether a given timestamp is in the past in Dhaka time
 */
export function isDhakaPast(dateInput: string | Date): boolean {
  const target = typeof dateInput === "object" ? dateInput : new Date(dateInput);
  return target.getTime() < Date.now();
}
