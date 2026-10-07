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
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase/client";
import { AcademicResource, ResourceStatus } from "@/types/models";
import { INITIAL_RESOURCES } from "@/data/initialResources";

const LOCAL_RESOURCES_KEY = "campusos_local_resources";
const LOCAL_VOTES_KEY = "campusos_local_votes";

function getLocalResources(): AcademicResource[] {
  if (typeof window === "undefined") return INITIAL_RESOURCES;
  try {
    const raw = localStorage.getItem(LOCAL_RESOURCES_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_RESOURCES_KEY, JSON.stringify(INITIAL_RESOURCES));
      return INITIAL_RESOURCES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_RESOURCES;
  }
}

function saveLocalResources(items: AcademicResource[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_RESOURCES_KEY, JSON.stringify(items));
}

function hasUserVoted(resourceId: string, userId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(LOCAL_VOTES_KEY);
    const votes: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    return votes[resourceId]?.includes(userId) ?? false;
  } catch {
    return false;
  }
}

function recordUserVote(resourceId: string, userId: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_VOTES_KEY);
    const votes: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    if (!votes[resourceId]) votes[resourceId] = [];
    if (!votes[resourceId].includes(userId)) {
      votes[resourceId].push(userId);
    }
    localStorage.setItem(LOCAL_VOTES_KEY, JSON.stringify(votes));
  } catch {
    // ignore
  }
}

/**
 * Fetch all approved academic resources.
 */
export async function fetchApprovedResources(): Promise<AcademicResource[]> {
  try {
    const q = query(
      collection(db, "resources"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list: AcademicResource[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as AcademicResource));
      return list;
    }
  } catch (err) {
    console.warn("Firestore fetchApprovedResources fallback:", err);
  }
  return getLocalResources().filter((r) => r.status === "approved");
}

/**
 * Fetch all resources (including pending and rejected) for admin moderation.
 */
export async function fetchAllResourcesForAdmin(): Promise<AcademicResource[]> {
  try {
    const q = query(collection(db, "resources"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list: AcademicResource[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as AcademicResource));
      return list;
    }
  } catch (err) {
    console.warn("Firestore fetchAllResourcesForAdmin fallback:", err);
  }
  return getLocalResources();
}

/**
 * Fetch resource by ID.
 */
export async function fetchResourceById(id: string): Promise<AcademicResource | null> {
  try {
    const d = await getDoc(doc(db, "resources", id));
    if (d.exists()) {
      return { id: d.id, ...d.data() } as AcademicResource;
    }
  } catch (err) {
    console.warn("Firestore fetchResourceById fallback:", err);
  }
  return getLocalResources().find((r) => r.id === id) || null;
}

/**
 * Fetch resources uploaded by a specific user.
 */
export async function fetchUserUploads(userId: string): Promise<AcademicResource[]> {
  try {
    const q = query(collection(db, "resources"), where("uploaderId", "==", userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list: AcademicResource[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as AcademicResource));
      return list;
    }
  } catch (err) {
    console.warn("Firestore fetchUserUploads fallback:", err);
  }
  return getLocalResources().filter((r) => r.uploaderId === userId);
}

/**
 * Upload a new academic resource.
 */
export async function createAcademicResource(
  resource: Omit<AcademicResource, "id" | "upvotes" | "createdAt"> & { id?: string }
): Promise<AcademicResource> {
  const newId = resource.id || `res-${Date.now()}`;
  const newRecord: AcademicResource = {
    ...resource,
    id: newId,
    upvotes: 0,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, "resources", newId), newRecord);
  } catch (err) {
    console.warn("Firestore createAcademicResource fallback:", err);
  }

  const list = getLocalResources();
  list.unshift(newRecord);
  saveLocalResources(list);

  return newRecord;
}

/**
 * Perform one upvote per user using transaction.
 */
export async function upvoteResource(
  resourceId: string,
  userId: string
): Promise<{ success: boolean; newCount: number; message: string }> {
  if (hasUserVoted(resourceId, userId)) {
    throw new Error("You have already upvoted this academic resource.");
  }

  let finalCount = 0;

  try {
    const resRef = doc(db, "resources", resourceId);
    const voteRef = doc(db, "resourceVotes", `${resourceId}_${userId}`);

    await runTransaction(db, async (tx) => {
      const voteDoc = await tx.get(voteRef);
      if (voteDoc.exists()) {
        throw new Error("You have already upvoted this resource.");
      }
      const resDoc = await tx.get(resRef);
      if (!resDoc.exists()) {
        throw new Error("Resource not found.");
      }
      const currentUpvotes = (resDoc.data().upvotes || 0) + 1;
      tx.set(voteRef, { resourceId, userId, createdAt: new Date().toISOString() });
      tx.update(resRef, { upvotes: currentUpvotes });
      finalCount = currentUpvotes;
    });
  } catch (err: any) {
    if (err.message?.includes("already upvoted")) throw err;
    console.warn("Remote transaction upvote fallback:", err);
  }

  // Update local
  recordUserVote(resourceId, userId);
  const list = getLocalResources();
  const target = list.find((r) => r.id === resourceId);
  if (target) {
    target.upvotes = (target.upvotes || 0) + 1;
    finalCount = target.upvotes;
    saveLocalResources(list);
  }

  return { success: true, newCount: finalCount, message: "Upvote recorded successfully." };
}

/**
 * Admin moderation: update status (approved/rejected), rejection reason, or verified status.
 */
export async function moderateResource(
  resourceId: string,
  updates: {
    status?: ResourceStatus;
    rejectionReason?: string;
    verified?: boolean;
    summary?: { en: string; bn: string };
  }
): Promise<void> {
  try {
    await updateDoc(doc(db, "resources", resourceId), updates);
  } catch (err) {
    console.warn("Remote moderateResource fallback:", err);
  }

  const list = getLocalResources();
  const target = list.find((r) => r.id === resourceId);
  if (target) {
    Object.assign(target, updates);
    saveLocalResources(list);
  }
}
