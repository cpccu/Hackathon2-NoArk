import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const key = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/^"|"$/g, "").replace(/\\n/g, "\n");
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: key,
    }),
  });
}
const auth = getAuth();
const db = getFirestore();
const PASSWORD = "CampusOS@2026";

// find the CPC club for the club admin
let clubId;
const clubs = await db.collection("clubs").get();
for (const c of clubs.docs) {
  if (/cpc|programming/i.test(c.id + " " + JSON.stringify(c.data()))) { clubId = c.id; break; }
}
console.log("CPC club id:", clubId ?? "NOT FOUND");

const accounts = [
  { email: "student@cityuniversity.edu.bd", name: "Fuad Ahamed Rahim", role: "student", department: "CSE", batch: "58", studentId: "2026001" },
  { email: "cpc.admin@cityuniversity.edu.bd", name: "CUCPC Executive", role: "club_admin", department: "CSE", batch: "57", studentId: "2026002", ...(clubId && { managedClubId: clubId }) },
  { email: "admin@cityuniversity.edu.bd", name: "Campus Administrator", role: "admin", department: "CSE", batch: "50" },
];

for (const a of accounts) {
  let user;
  try {
    user = await auth.getUserByEmail(a.email);
    user = await auth.updateUser(user.uid, { password: PASSWORD, displayName: a.name, emailVerified: true });
  } catch {
    user = await auth.createUser({ email: a.email, password: PASSWORD, displayName: a.name, emailVerified: true });
  }
  await db.collection("users").doc(user.uid).set(
    { uid: user.uid, preferredLanguage: "en", createdAt: new Date().toISOString(), ...a },
    { merge: true }
  );
  console.log("OK", a.role, a.email);
}
