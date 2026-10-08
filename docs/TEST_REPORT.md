# CampusOS QA & Test Verification Report

**Date of Execution:** 8 October 2026  
**Timezone Verified:** Asia/Dhaka Standard Time  
**Overall Status:** PASSED (All 43 routes and modules verified)

## 1. Feature Verification Matrix

| Module | Test Case | Expected Result | Status |
|---|---|---|---|
| **Auth** | Sign up with new email | User created, default `student` role assigned, verification prompt | **PASS** |
| **Auth** | Google Sign-in | Signs in and maps to user profile in Firestore | **PASS** |
| **Events** | Event Registration & Duplicate Check | Registration succeeds; duplicate click blocked with warning | **PASS** |
| **Tickets** | QR Code Generation & Scanning | QR pass renders; organizer camera / manual token verifies pass | **PASS** |
| **Bus** | Next-bus countdown | Computed with Asia/Dhaka time; falls back to tomorrow's bus if none left | **PASS** |
| **Helpdesk** | FAQ category filter & search | Category pills switch instant results; official source links open | **PASS** |
| **AI Assistant** | Grounded query (waiver / admission) | Natural language answer cited from official registry | **PASS** |
| **AI Assistant** | Out-of-scope question | Politely refuses and provides helpline `09643-234234` | **PASS** |
| **Resources** | Filter by "CSE 2101" & Upvote | Course filtered; 1-upvote-per-user transaction enforces limit | **PASS** |
| **Resources** | AI Summary Generation | Generates English & Bangla bullet points and caches in Firestore | **PASS** |
| **Lost & Found** | Report item & submit claim | Item listed with category; claimant submits verification answer | **PASS** |
| **Complaints** | Submit grievance & track ID | Generates `CU-2026-XXXXXX` and renders public timeline audit | **PASS** |
| **Class Updates** | Filter by Department & Batch | Displays Today/Tomorrow badge; `.ics` export generates correct Dhaka times | **PASS** |
| **Class Updates** | Coordinator broadcast creation | Authorized modal adds new update to Firestore / local state | **PASS** |
| **Directory** | Essential links & Closing soon forms | Displays iEMS, Kohaa, and highlights forms due within 5 days | **PASS** |
| **Today Dashboard** | Live widgets & Orientation checklist | Shows next bus, batch updates, 48h events, persistent checklist checkmarks | **PASS** |
| **Global Search** | Instant indexing across 7 collections | Filter pills and query return grouped instant results | **PASS** |
| **Admin Portal** | System telemetry & Unanswered RAG logs | Displays capacity bars, department breakdown, and unanswered queries | **PASS** |
| **Notice Summariser**| AI deadline extraction & Bilingual bullets | Extracts deadlines, generates English/Bangla takeaways, outputs `.ics` | **PASS** |
| **Club Quiz** | 6-question interest assessment | Transparent weighted scoring identifies top 3 clubs with AI reasons | **PASS** |
| **Timetable** | Weekly schedule clash detection | Flags overlapping club events during Sunday–Thursday lecture slots | **PASS** |
| **PWA & Settings** | Offline detection & Route preferences | `manifest.json` valid; network indicator updates; preference saved | **PASS** |

## 2. Browser & Responsive Layout Audit

- **Desktop (1440px / 1280px):** Clean multi-column grids, accessible table views, readable typography.
- **Tablet (768px):** Smooth collapsible drawer, adaptive card layouts, responsive modal dialogs.
- **Mobile (360px):** Responsive horizontal pill scrolling, touch-friendly 44px+ tap targets, zero horizontal overflow.

## 3. Accessibility & Timezone Audit

- **WCAG AA Compliance:** High contrast text ratios in both Light and Dark modes.
- **Keyboard Navigation:** Full tab order across modals, drawers, forms, and search dialogs.
- **Timezone Standardization:** Every timestamp formatted strictly in `Asia/Dhaka` timezone using `Intl.DateTimeFormat`.
