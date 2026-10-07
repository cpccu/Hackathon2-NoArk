import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase/client";
import { Complaint, ComplaintStatus, ComplaintTimelineItem } from "@/types/models";
import { INITIAL_COMPLAINTS } from "@/data/initialLostFoundComplaints";

const LOCAL_COMPLAINTS_KEY = "campusos_local_complaints";

function getLocalComplaints(): Complaint[] {
  if (typeof window === "undefined") return INITIAL_COMPLAINTS;
  try {
    const raw = localStorage.getItem(LOCAL_COMPLAINTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_COMPLAINTS_KEY, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMPLAINTS;
  }
}

function saveLocalComplaints(items: Complaint[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_COMPLAINTS_KEY, JSON.stringify(items));
}

export function generateTrackingId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `CU-2026-${randomNum}`;
}

export async function submitComplaint(
  complaint: Omit<Complaint, "id" | "trackingId" | "status" | "timeline" | "createdAt">
): Promise<Complaint> {
  const trackingId = generateTrackingId();
  const newId = `cmp-${Date.now()}`;
  const nowIso = new Date().toISOString();

  const initialTimeline: ComplaintTimelineItem[] = [
    {
      status: "received",
      note: `Complaint officially recorded with tracking reference ${trackingId}.`,
      timestamp: nowIso,
      isPublic: true,
    },
  ];

  const newRecord: Complaint = {
    ...complaint,
    id: newId,
    trackingId,
    status: "received",
    timeline: initialTimeline,
    createdAt: nowIso,
  };

  try {
    await setDoc(doc(db, "complaints", newId), newRecord);
  } catch (err) {
    console.warn("Firestore submitComplaint fallback:", err);
  }

  const list = getLocalComplaints();
  list.unshift(newRecord);
  saveLocalComplaints(list);

  return newRecord;
}

export async function fetchComplaintByTrackingId(trackingId: string): Promise<Complaint | null> {
  const trimmed = trackingId.trim().toUpperCase();
  try {
    const q = query(collection(db, "complaints"), where("trackingId", "==", trimmed));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() } as Complaint;
    }
  } catch (err) {
    console.warn("Firestore fetchComplaintByTrackingId fallback:", err);
  }

  return getLocalComplaints().find((c) => c.trackingId === trimmed) || null;
}

export async function fetchUserComplaints(userId: string): Promise<Complaint[]> {
  try {
    const q = query(
      collection(db, "complaints"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list: Complaint[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Complaint));
      return list;
    }
  } catch (err) {
    console.warn("Firestore fetchUserComplaints fallback:", err);
  }

  return getLocalComplaints().filter((c) => c.userId === userId);
}

export async function fetchAllComplaintsForAdmin(): Promise<Complaint[]> {
  try {
    const q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list: Complaint[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Complaint));
      return list;
    }
  } catch (err) {
    console.warn("Firestore fetchAllComplaintsForAdmin fallback:", err);
  }

  return getLocalComplaints();
}

export async function updateComplaintStatus(
  id: string,
  newStatus: ComplaintStatus,
  noteText: string,
  isPublic: boolean = true
): Promise<void> {
  const nowIso = new Date().toISOString();
  const timelineEntry: ComplaintTimelineItem = {
    status: newStatus,
    note: noteText,
    timestamp: nowIso,
    isPublic,
  };

  const list = getLocalComplaints();
  const target = list.find((c) => c.id === id);

  if (target) {
    target.status = newStatus;
    target.timeline.push(timelineEntry);
    saveLocalComplaints(list);

    try {
      await updateDoc(doc(db, "complaints", id), {
        status: newStatus,
        timeline: target.timeline,
      });
    } catch (err) {
      console.warn("Remote updateComplaintStatus fallback:", err);
    }
  }
}
