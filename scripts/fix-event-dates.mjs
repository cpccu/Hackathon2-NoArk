import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
if (!getApps().length) initializeApp({ credential: cert({
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/^"|"$/g, "").replace(/\\n/g, "\n") }) });
const db = getFirestore();
const snap = await db.collection("events").orderBy("startAt").get();
console.log("sample before:", snap.docs[0].id, snap.docs[0].data().startAt, snap.docs[0].data().registrationDeadline);
let i = 0;
for (const d of snap.docs) {
  const day = 10 + i * 2;            // Oct 10, 12, 14, ...
  const mo = day > 31 ? 11 : 10;
  const dd = String(day > 31 ? day - 31 : day).padStart(2, "0");
  const start = `2026-${mo}-${dd}T10:00:00+06:00`;
  const end = `2026-${mo}-${dd}T13:00:00+06:00`;
  const deadline = `2026-${mo}-${dd}T08:00:00+06:00`;
  const data = d.data();
  const upd = { startAt: start, endAt: end, registrationDeadline: deadline, registrationOpen: true };
  if ((data.registeredCount ?? 0) >= (data.capacity ?? 100)) upd.registeredCount = Math.max(0, (data.capacity ?? 100) - 10);
  await d.ref.update(upd);
  i++;
}
console.log("updated", i, "events");
