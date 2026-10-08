import { db } from "./firebase/client";
import {
  collection,
  getDocs,
  addDoc,
  query,
} from "firebase/firestore";
import { DirectoryEntry } from "@/types/models";
import { INITIAL_DIRECTORY } from "@/data/initialDirectory";

const DIRECTORY_COLLECTION = "directory";

export async function fetchDirectoryEntries(): Promise<DirectoryEntry[]> {
  try {
    if (!db) return INITIAL_DIRECTORY;
    const q = query(collection(db, DIRECTORY_COLLECTION));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return INITIAL_DIRECTORY;
    }

    const entries: DirectoryEntry[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      entries.push({
        id: doc.id,
        title: data.title || "",
        title_bn: data.title_bn,
        kind: data.kind || "official_link",
        url: data.url || "",
        ownerClub: data.ownerClub,
        description: data.description || "",
        deadline: data.deadline,
        isOpen: data.isOpen !== undefined ? data.isOpen : true,
        source: data.source || "demo",
      });
    });

    return entries;
  } catch (err) {
    console.warn("Using initial directory fallback:", err);
    return INITIAL_DIRECTORY;
  }
}

export async function addDirectoryEntry(
  entry: Omit<DirectoryEntry, "id">
): Promise<string> {
  if (!db) {
    throw new Error("Firestore not initialized");
  }

  const docRef = await addDoc(collection(db, DIRECTORY_COLLECTION), entry);
  return docRef.id;
}
