import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase/client";
import { FAQ, FAQCategory } from "@/types/models";
import { INITIAL_FAQS } from "@/data/initialFaqs";

export async function fetchAllFaqs(): Promise<FAQ[]> {
  try {
    const q = query(collection(db, "faqs"), orderBy("category", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list: FAQ[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as FAQ));
      return list;
    }
  } catch (err) {
    console.warn("Firestore fetchAllFaqs fallback:", err);
  }
  return INITIAL_FAQS;
}

export async function fetchFaqsByCategory(category: FAQCategory): Promise<FAQ[]> {
  const all = await fetchAllFaqs();
  return all.filter((f) => f.category === category);
}
