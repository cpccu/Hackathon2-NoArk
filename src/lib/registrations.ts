import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase/client";
import { EventRegistration, RegistrationStatus, CampusEvent } from "@/types/models";
import { UserProfile } from "@/types/user";
import { fetchEventById } from "./events";

// In-memory fallback cache for development/demo testing
const LOCAL_REGISTRATIONS_KEY = "campusos_local_registrations";

function getLocalRegistrations(): EventRegistration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_REGISTRATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalRegistration(reg: EventRegistration): void {
  if (typeof window === "undefined") return;
  const list = getLocalRegistrations();
  const existingIndex = list.findIndex((r) => r.id === reg.id);
  if (existingIndex >= 0) {
    list[existingIndex] = reg;
  } else {
    list.unshift(reg);
  }
  localStorage.setItem(LOCAL_REGISTRATIONS_KEY, JSON.stringify(list));
}

/**
 * Register a student for an event enforcing capacity, duplicate prevention, and waitlist.
 */
export async function registerForEvent(
  event: CampusEvent,
  user: { uid: string; email: string },
  profile?: UserProfile | null
): Promise<{ registration: EventRegistration; status: RegistrationStatus }> {
  // 1. Deadline check
  const now = Date.now();
  const deadline = new Date(event.registrationDeadline).getTime();
  if (deadline < now || !event.registrationOpen) {
    throw new Error("Registration is closed for this event.");
  }

  const regId = `reg-${event.id}-${user.uid}`;

  // Check duplicate registration
  const localExisting = getLocalRegistrations().find(
    (r) => r.id === regId && r.status !== "cancelled"
  );
  if (localExisting) {
    throw new Error(`You are already ${localExisting.status} for this event.`);
  }

  try {
    const existingDoc = await getDoc(doc(db, "registrations", regId));
    if (existingDoc.exists()) {
      const data = existingDoc.data() as EventRegistration;
      if (data.status !== "cancelled") {
        throw new Error(`You are already ${data.status} for this event.`);
      }
    }
  } catch (err: any) {
    if (err.message?.includes("already")) {
      throw err;
    }
  }

  const qrToken = `CU-QR-${event.id}-${user.uid}-${Date.now().toString(36).toUpperCase()}`;

  // Check capacity
  const isFull = event.registeredCount >= event.capacity;
  const targetStatus: RegistrationStatus = isFull ? "waitlisted" : "registered";

  const newReg: EventRegistration = {
    id: regId,
    eventId: event.id,
    eventTitle: event.title,
    userId: user.uid,
    userName: profile?.name || user.email.split("@")[0],
    userEmail: user.email,
    userDept: profile?.department || "CSE",
    userBatch: profile?.batch || "50th",
    status: targetStatus,
    qrToken,
    checkedIn: false,
    createdAt: new Date().toISOString(),
  };

  try {
    // Attempt Firestore document write
    const regDocRef = doc(db, "registrations", regId);
    await setDoc(regDocRef, newReg);

    // If registered (not waitlisted), increment event registered count
    if (targetStatus === "registered") {
      const eventDocRef = doc(db, "events", event.id);
      await updateDoc(eventDocRef, {
        registeredCount: event.registeredCount + 1,
      });
    }
  } catch (err) {
    console.warn("Firestore registration failed, caching locally:", err);
  }

  saveLocalRegistration(newReg);
  return { registration: newReg, status: targetStatus };
}

/**
 * Get all registrations for a specific student.
 */
export async function getUserRegistrations(userId: string): Promise<EventRegistration[]> {
  try {
    const q = query(collection(db, "registrations"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const regs: EventRegistration[] = [];
    snap.forEach((d) => regs.push(d.data() as EventRegistration));
    if (regs.length > 0) return regs;
  } catch (err) {
    console.warn("Firestore getUserRegistrations fallback:", err);
  }

  return getLocalRegistrations().filter((r) => r.userId === userId);
}

/**
 * Get all attendees for an event (Organizer view).
 */
export async function getEventAttendees(eventId: string): Promise<EventRegistration[]> {
  try {
    const q = query(collection(db, "registrations"), where("eventId", "==", eventId));
    const snap = await getDocs(q);
    const list: EventRegistration[] = [];
    snap.forEach((d) => list.push(d.data() as EventRegistration));
    if (list.length > 0) return list;
  } catch (err) {
    console.warn("Firestore getEventAttendees fallback:", err);
  }

  return getLocalRegistrations().filter((r) => r.eventId === eventId);
}

/**
 * Verify and check in ticket via QR token or manual token entry.
 */
export async function verifyAndCheckInTicket(
  eventId: string,
  tokenInput: string
): Promise<{ success: boolean; attendee?: EventRegistration; message: string }> {
  const token = tokenInput.trim();

  // Search local and remote
  let attendee: EventRegistration | undefined;

  try {
    const q = query(
      collection(db, "registrations"),
      where("eventId", "==", eventId),
      where("qrToken", "==", token)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      attendee = snap.docs[0].data() as EventRegistration;
    }
  } catch (err) {
    console.warn("Remote check-in search failed:", err);
  }

  if (!attendee) {
    attendee = getLocalRegistrations().find(
      (r) => r.eventId === eventId && (r.qrToken === token || r.id === token)
    );
  }

  if (!attendee) {
    return { success: false, message: "Invalid ticket token. Record not found." };
  }

  if (attendee.status === "cancelled") {
    return { success: false, message: "Ticket was cancelled by the attendee." };
  }

  if (attendee.status === "waitlisted") {
    return {
      success: false,
      message: "Registration is currently waitlisted. Check-in cannot be issued.",
    };
  }

  if (attendee.checkedIn) {
    return {
      success: false,
      attendee,
      message: `Duplicate scan: Attendee already checked in at ${attendee.checkedInAt || "earlier"}.`,
    };
  }

  // Mark checked in
  const nowIso = new Date().toISOString();
  attendee.checkedIn = true;
  attendee.checkedInAt = nowIso;

  try {
    await updateDoc(doc(db, "registrations", attendee.id), {
      checkedIn: true,
      checkedInAt: nowIso,
    });
  } catch (err) {
    console.warn("Remote checkin update failed:", err);
  }

  saveLocalRegistration(attendee);

  return {
    success: true,
    attendee,
    message: `Check-in confirmed for ${attendee.userName} (${attendee.userDept} - Batch ${attendee.userBatch}).`,
  };
}

/**
 * Cancel a registration and promote the first waitlisted user if applicable.
 */
export async function cancelRegistration(registrationId: string, eventId: string): Promise<void> {
  try {
    const regRef = doc(db, "registrations", registrationId);
    await updateDoc(regRef, { status: "cancelled" });

    // Look for first waitlisted registration
    const q = query(
      collection(db, "registrations"),
      where("eventId", "==", eventId),
      where("status", "==", "waitlisted")
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const waitlistedDoc = snap.docs[0];
      await updateDoc(waitlistedDoc.ref, { status: "registered" });
    }
  } catch (err) {
    console.warn("Remote cancelRegistration fallback:", err);
  }

  // Update local
  const list = getLocalRegistrations();
  const item = list.find((r) => r.id === registrationId);
  if (item) {
    item.status = "cancelled";
    // promote waitlist locally
    const waitlisted = list.find((r) => r.eventId === eventId && r.status === "waitlisted");
    if (waitlisted) {
      waitlisted.status = "registered";
    }
    localStorage.setItem(LOCAL_REGISTRATIONS_KEY, JSON.stringify(list));
  }
}
