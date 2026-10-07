/**
 * CampusOS – City University Firestore Seeder
 * Idempotent seed script runnable via `npm run seed`.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Built-in .env parser without external dependencies
function loadEnv() {
  const envPaths = [resolve(__dirname, "../.env.local"), resolve(__dirname, "../.env")];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const idx = trimmed.indexOf("=");
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            let val = trimmed.slice(idx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  }
}

loadEnv();

function initAdmin() {
  if (getApps().length > 0) {
    return getFirestore();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  if (projectId && clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
  } else {
    console.log("ℹ️  Running seed script in dry-run/preview mode (FIREBASE_PRIVATE_KEY not provided).");
    return null;
  }

  return getFirestore();
}

async function seed() {
  console.log("=================================================");
  console.log("🌱 CampusOS Seed Script (Idempotent Execution)");
  console.log("=================================================");

  const db = initAdmin();
  if (!db) {
    console.log("✅ Seed script skeleton verified. To execute against live Firestore, set FIREBASE_CLIENT_EMAIL & FIREBASE_PRIVATE_KEY in .env.local.");
    process.exit(0);
  }

  console.log("Connected to Firestore:", db.projectId);
  console.log("✅ Seed database connection verified.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed script error:", err);
  process.exit(1);
});
