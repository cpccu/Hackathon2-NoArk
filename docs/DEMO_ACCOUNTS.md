# CampusOS — Demo Accounts & Credentials

This document provides credentials for testing and evaluation across all user permission tiers during the **CPCCU AI-Powered Web App Development & Deployment Hackathon 2026**.

---

## 1. Demo User Accounts

| Role | Email | Password | Display Name | Permissions / Features |
|---|---|---|---|---|
| **Student** (Default) | `student@cityuniversity.edu.bd` | `CampusOS@2026` | Fuad Ahamed Rahim | Register for events, QR tickets, upvote resources, upload study materials, submit lost & found reports, claim items, track complaints. |
| **Club Executive** (`club_admin`) | `cpc.admin@cityuniversity.edu.bd` | `CampusOS@2026` | CUCPC Executive | All student permissions + Create & edit club events, launch registration, perform QR check-in scanning, export attendee CSVs. |
| **System Admin** (`admin`) | `admin@cityuniversity.edu.bd` | `CampusOS@2026` | Campus Administrator | Complete system access: Academic resource moderation (approve/reject/verify), complaints resolution & official audit notes, manage all events, role management. |

---

## 2. Quick Testing Walkthrough

1. **Sign in as Student (`student@cityuniversity.edu.bd`)**:
   - Visit `/events`, select an event, click **Register Seat (Free)**.
   - Go to `/my/events` to view the high-contrast QR pass and Dhaka-time details.
   - Go to `/resources`, view notes for `CSE 2101`, click **Upvote** and test the AI summary generator.
   - Visit `/complaints/new` and submit a grievance; verify generation of `CU-2026-XXXXXX` tracking ID.

2. **Sign in as Club Admin (`cpc.admin@cityuniversity.edu.bd`)**:
   - Navigate to `/events`, open an event for CUCPC, click **QR Check-in Scanner** (`/events/[id]/checkin`).
   - Enter a ticket token or test camera viewfinder scanning.
   - Download the attendee roster CSV.

3. **Sign in as Administrator (`admin@cityuniversity.edu.bd`)**:
   - Visit `/admin/resources` to approve, verify, or reject pending student uploads.
   - Visit `/admin/complaints` to add public timeline resolution notes to student grievances.

---

## 3. Account Creation & Google Sign-In

- Any new user registering via `/register` is automatically assigned the `student` role by default.
- Google Sign-In is supported natively on the split-screen authentication portal.
- Role elevation to `club_admin` or `admin` can be performed via Cloud Firestore (`users` collection `role` field).
