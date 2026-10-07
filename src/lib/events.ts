import { collection, doc, getDoc, getDocs, setDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase/client";
import { CampusEvent, EventStatus } from "@/types/models";
import { INITIAL_EVENTS } from "@/data/initialEvents";
import { isDhakaToday, isDhakaPast } from "./date";

export function getEventStatus(event: CampusEvent): EventStatus {
  const now = new Date().getTime();
  const end = new Date(event.endAt).getTime();
  const deadline = new Date(event.registrationDeadline).getTime();

  if (end < now) return "past";
  if (isDhakaToday(event.startAt)) return "today";
  if (event.registeredCount >= event.capacity) return "full";
  if (!event.registrationOpen || deadline < now) return "closed";
  return "upcoming";
}

export async function fetchAllEvents(): Promise<CampusEvent[]> {
  try {
    const q = query(collection(db, "events"), orderBy("startAt", "asc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return INITIAL_EVENTS;
    }

    const events: CampusEvent[] = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as CampusEvent);
    });
    return events;
  } catch (err) {
    console.warn("Firestore fetchAllEvents fallback to initial data:", err);
    return INITIAL_EVENTS;
  }
}

export async function fetchEventById(id: string): Promise<CampusEvent | null> {
  try {
    const docRef = doc(db, "events", id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as CampusEvent;
    }

    const fallback = INITIAL_EVENTS.find((e) => e.id === id);
    return fallback || null;
  } catch (err) {
    console.warn("Firestore fetchEventById fallback:", err);
    const fallback = INITIAL_EVENTS.find((e) => e.id === id);
    return fallback || null;
  }
}

export async function saveEvent(event: Partial<CampusEvent> & { id: string }): Promise<void> {
  const docRef = doc(db, "events", event.id);
  await setDoc(docRef, event, { merge: true });
}
