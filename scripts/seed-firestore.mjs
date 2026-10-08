import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { INITIAL_EVENTS } from "../src/data/initialEvents.ts";
import { INITIAL_RESOURCES } from "../src/data/initialResources.ts";
import { INITIAL_LOST_FOUND, INITIAL_COMPLAINTS } from "../src/data/initialLostFoundComplaints.ts";
import { INITIAL_FAQS } from "../src/data/initialFaqs.ts";
import { INITIAL_BUS_ROUTES, INITIAL_BUS_TRIPS } from "../src/data/initialBus.ts";
import { INITIAL_CLUBS } from "../src/data/initialClubs.ts";

if (!getApps().length) {
  initializeApp({ credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/^"|"$/g, "").replace(/\\n/g, "\n"),
  }) });
}
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

const sets = {
  events: INITIAL_EVENTS, resources: INITIAL_RESOURCES, lostFound: INITIAL_LOST_FOUND,
  complaints: INITIAL_COMPLAINTS, faqs: INITIAL_FAQS, busRoutes: INITIAL_BUS_ROUTES,
  busTrips: INITIAL_BUS_TRIPS, clubs: INITIAL_CLUBS,
};
for (const [name, items] of Object.entries(sets)) {
  let batch = db.batch(), n = 0;
  for (const item of items) {
    const ref = item.id ? db.collection(name).doc(String(item.id)) : db.collection(name).doc();
    batch.set(ref, item);
    if (++n % 400 === 0) { await batch.commit(); batch = db.batch(); }
  }
  await batch.commit();
  console.log("OK", name, items.length);
}
const u = await db.collection("users").where("email", "==", "cpc.admin@cityuniversity.edu.bd").get();
for (const d of u.docs) await d.ref.update({ managedClubId: "c-cpc" });
console.log("club admin linked to c-cpc:", u.size);
