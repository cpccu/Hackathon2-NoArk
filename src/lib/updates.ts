import { db } from "./firebase/client";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { ClassUpdate } from "@/types/models";
import { INITIAL_UPDATES } from "@/data/initialUpdates";

const UPDATES_COLLECTION = "updates";

export async function fetchClassUpdates(): Promise<ClassUpdate[]> {
  try {
    if (!db) return INITIAL_UPDATES;
    const q = query(collection(db, UPDATES_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return INITIAL_UPDATES;
    }

    const updates: ClassUpdate[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      updates.push({
        id: doc.id,
        title: data.title || "",
        title_bn: data.title_bn,
        body: data.body || "",
        body_bn: data.body_bn,
        kind: data.kind || "general",
        department: data.department || "All",
        batch: data.batch || "All",
        courseCode: data.courseCode,
        effectiveAt:
          data.effectiveAt instanceof Timestamp
            ? data.effectiveAt.toDate().toISOString()
            : data.effectiveAt || new Date().toISOString(),
        authorId: data.authorId || "",
        authorName: data.authorName || "Faculty / Admin",
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || new Date().toISOString(),
        source: data.source || "demo",
      });
    });

    return updates;
  } catch (err) {
    console.warn("Using initial updates fallback due to Firestore read:", err);
    return INITIAL_UPDATES;
  }
}

export async function createClassUpdate(
  updateData: Omit<ClassUpdate, "id" | "createdAt">
): Promise<string> {
  if (!db) {
    throw new Error("Firestore not initialized");
  }

  const docRef = await addDoc(collection(db, UPDATES_COLLECTION), {
    ...updateData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}
