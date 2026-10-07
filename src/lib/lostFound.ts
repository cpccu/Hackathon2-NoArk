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
import { LostFoundItem, LostFoundClaim, LostFoundStatus } from "@/types/models";
import { INITIAL_LOST_FOUND } from "@/data/initialLostFoundComplaints";

const LOCAL_LF_KEY = "campusos_local_lostfound";
const LOCAL_CLAIMS_KEY = "campusos_local_claims";

function getLocalItems(): LostFoundItem[] {
  if (typeof window === "undefined") return INITIAL_LOST_FOUND;
  try {
    const raw = localStorage.getItem(LOCAL_LF_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_LF_KEY, JSON.stringify(INITIAL_LOST_FOUND));
      return INITIAL_LOST_FOUND;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LOST_FOUND;
  }
}

function saveLocalItems(items: LostFoundItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_LF_KEY, JSON.stringify(items));
}

function getLocalClaims(): LostFoundClaim[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_CLAIMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalClaims(claims: LostFoundClaim[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_CLAIMS_KEY, JSON.stringify(claims));
}

export async function fetchAllLostFound(): Promise<LostFoundItem[]> {
  try {
    const q = query(collection(db, "lostFound"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list: LostFoundItem[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as LostFoundItem));
      return list;
    }
  } catch (err) {
    console.warn("Firestore fetchAllLostFound fallback:", err);
  }
  return getLocalItems();
}

export async function createLostFoundItem(
  item: Omit<LostFoundItem, "id" | "createdAt" | "status"> & { id?: string }
): Promise<LostFoundItem> {
  const newId = item.id || `lf-${Date.now()}`;
  const newItem: LostFoundItem = {
    ...item,
    id: newId,
    status: "open",
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, "lostFound", newId), newItem);
  } catch (err) {
    console.warn("Firestore createLostFound fallback:", err);
  }

  const list = getLocalItems();
  list.unshift(newItem);
  saveLocalItems(list);
  return newItem;
}

export async function updateLostFoundStatus(id: string, status: LostFoundStatus): Promise<void> {
  try {
    await updateDoc(doc(db, "lostFound", id), { status });
  } catch (err) {
    console.warn("Firestore updateLostFoundStatus fallback:", err);
  }
  const list = getLocalItems();
  const target = list.find((i) => i.id === id);
  if (target) {
    target.status = status;
    saveLocalItems(list);
  }
}

export async function submitClaim(
  claim: Omit<LostFoundClaim, "id" | "createdAt" | "status">
): Promise<LostFoundClaim> {
  const newId = `claim-${Date.now()}`;
  const newClaim: LostFoundClaim = {
    ...claim,
    id: newId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, "claims", newId), newClaim);
  } catch (err) {
    console.warn("Firestore submitClaim fallback:", err);
  }

  const list = getLocalClaims();
  list.unshift(newClaim);
  saveLocalClaims(list);
  return newClaim;
}

export async function fetchClaimsForItem(itemId: string): Promise<LostFoundClaim[]> {
  try {
    const q = query(collection(db, "claims"), where("itemId", "==", itemId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list: LostFoundClaim[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as LostFoundClaim));
      return list;
    }
  } catch (err) {
    console.warn("Firestore fetchClaimsForItem fallback:", err);
  }
  return getLocalClaims().filter((c) => c.itemId === itemId);
}

export async function resolveClaim(claimId: string, itemId: string, approved: boolean): Promise<void> {
  const newStatus = approved ? "approved" : "rejected";
  try {
    await updateDoc(doc(db, "claims", claimId), { status: newStatus });
    if (approved) {
      await updateDoc(doc(db, "lostFound", itemId), { status: "claimed" });
    }
  } catch (err) {
    console.warn("Firestore resolveClaim fallback:", err);
  }

  const claims = getLocalClaims();
  const targetClaim = claims.find((c) => c.id === claimId);
  if (targetClaim) {
    targetClaim.status = newStatus;
    saveLocalClaims(claims);
  }

  if (approved) {
    const items = getLocalItems();
    const targetItem = items.find((i) => i.id === itemId);
    if (targetItem) {
      targetItem.status = "claimed";
      saveLocalItems(items);
    }
  }
}
