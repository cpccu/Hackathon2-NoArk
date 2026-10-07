# CampusOS – City University: Master Project Specification

This file is the single source of truth for building CampusOS. Read it fully before writing any code. Follow the build phases in order and do not skip the stop-and-report steps.

Hackathon: CPCCU AI-Powered Web App Development & Deployment Hackathon 2026. Deadline: 8 October 2026, 8:00 pm (Asia/Dhaka).

---

## 1. Mission

Build **CampusOS – City University**, a unified web app that becomes the single source of truth for campus life at City University (Khagan, Birulia, Savar, Dhaka-1340, Bangladesh).

Campus information is currently scattered across Facebook groups, Messenger chats, ad hoc Google Forms and notice boards. Every feature must remove a specific daily friction:

| Friction | Feature that removes it |
|---|---|
| Missed events | Unified event feed, RSVP, calendar export, reminders |
| Bus confusion | Bus routes, search by area, "next bus" countdown |
| Class cancellations | Class Updates feed targeted by department and batch |
| Lost academic resources | Resource Hub with search, verification and upvotes |
| Lost items with no system | Lost & Found with claim verification |
| No single starting point | Today dashboard, global search, directory, helpdesk and chatbot |

The app must feel built for City University specifically, not like a generic template.

### Judging (100 marks)
Problem Understanding 15 · Innovation 20 · Functionality & Completeness 25 · UI/UX & Accessibility 15 · Technical Implementation 15 · Presentation & Demo 10.
Principles: working product > concept; relevant solution > unnecessary complexity; a smaller fully working build beats an ambitious half-finished one.

### Must-haves
Live deployed URL with working sign-up and login · README documentation · at least two modules working end to end (target: all four) · a real-world usability section with concrete student scenarios · no exposed credentials · repo inside the CPCCU GitHub organisation.

---

## 2. Non-negotiable rules

1. **Zero cost.** No credit card, no billing account, no paid plan on any service. Allowed: Firebase Spark (Auth + Firestore only), Vercel Hobby, Cloudinary free plan, Gemini API free tier. Not allowed: Firebase Cloud Storage, Cloud Functions, App Hosting, email/SMS providers. If a feature needs a paid service, say so and propose a free alternative before building.
2. **No secrets in the repo.** Use `.env.local`; keep `.env.example` current; never use `NEXT_PUBLIC_` for secrets. Server-only keys stay in API routes.
3. **Demo data is always labelled.** Every record has `source: "official" | "demo"`. Records with `source: "demo"` show an amber **DEMO DATA** badge. Pages that are mostly demo (bus, fees, exam logistics) show a persistent notice: "Sample data for the hackathon. Confirm with the relevant university office." The chatbot appends "(sample data)" to facts from demo records. Never present demo data as official, and never invent official data.
4. **Everything visible works.** No dead buttons, no lorem ipsum, no "coming soon". If a feature is not built, do not show it.
5. **Professional design, not AI slop** (see section 4).
6. **Time zone:** all dates use Asia/Dhaka. Store UTC Firestore Timestamps; format with `Intl.DateTimeFormat` and `timeZone: "Asia/Dhaka"`. Upcoming, today and past logic must use Dhaka time.
7. **Privacy:** never send complaints, private posts or personal data to Gemini. The AI features may use only public information or text the user explicitly submits for that feature.
8. **Free-quota discipline:** Firestore Spark allows about 50K reads and 20K writes per day. Cache reads, paginate (limit 20), avoid unbounded queries, and limit realtime listeners to Class Updates and notifications.
9. **Quality:** strict TypeScript, small reusable components, clear folders, no dead code. After each phase run type check and lint, fix errors, and explain how to test.
10. **Keep `PROGRESS.md` updated** after every phase: finished work, stack, env vars, known bugs.

---

## 3. Stack

| Need | Choice |
|---|---|
| App | Next.js (App Router, TypeScript), Tailwind CSS |
| Auth + database | Firebase Auth + Firestore (Spark plan) |
| Hosting + server routes | Vercel Hobby (all server logic in Next.js API routes) |
| File uploads | Cloudinary free plan via server route `/api/upload` |
| AI | Gemini API free tier, server-side only. Model name from `GEMINI_MODEL` env var; never hardcode |
| QR | A QR generation library + a browser camera QR scanner library |

Environment variables (`.env.example`): `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`, Firebase Admin credentials (server only), `GEMINI_API_KEY`, `GEMINI_MODEL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, optional `ALLOWED_EMAIL_DOMAINS` (empty = no restriction).

---

## 4. Design requirements

- Look: a formal, editorial university portal (think Oxford, MIT, NUS). Calm, spacious, credible.
- Type: one serif for headings, one clean sans-serif for body, Noto Sans Bengali for Bangla.
- Palette: deep navy primary, restrained gold accent, neutral greys, semantic success/warning/danger colours, light and dark themes, WCAG AA contrast.
- Avoid: purple-blue gradient blobs, emoji as icons, vague marketing copy ("the future of campus"), heavy shadows, stock-template hero sections. Use SVG icons (lucide-react), subtle borders, real City University names, places and dates.
- Components: Button, Input, Select, Textarea, Card, Badge, DemoBadge, Tabs, Modal, Toast, EmptyState, ErrorState, Skeleton, Pagination, PageHeader, DataNotice, FileUploader.
- Every data view has loading, empty and error states.
- Mobile first; verify at 360px, 768px, 1280px. Touch targets 44px. Keyboard accessible, visible focus, labelled inputs, alt text, skip-to-content link, reduced-motion support.
- Bilingual: English and Bangla with a toggle (dictionary-based i18n, persisted in localStorage and profile). Bangla text must render with correct line height.
- App shell: top navigation (Events, Bus, Resources, Helpdesk, Lost & Found, Complaints, Updates, Directory), global search (Ctrl/Cmd+K), language and theme toggles, role-aware user menu; footer with the official address, phone 09643-234234, and links to the official site, iEMS, webmail, IQAC.

---

## 5. Authentication and roles

- Google sign-in and email/password with email verification and password reset.
- Sign-up collects: full name, department (CSE, EEE, Mechanical, Civil, Textile, Pharmacy, Public Health, DSH, BBA, English, Law, Agriculture), batch, optional student ID.
- `users/{uid}`: name, email, department, batch, studentId, role (`student` | `club_admin` | `admin`, default `student`), preferredLanguage, savedBusRoute, createdAt.
- Route protection; unverified email/password users see a "verify your email" screen with resend.
- Sign-in UI: split screen. Left: City University name, "Creating a culture of excellence", a plain list of what CampusOS offers, campus address. Right: the form with inline validation, friendly errors (wrong password, email in use, popup closed), loading states, show/hide password, "Continue with Google".
- Users cannot change their own role.

---

## 6. Data model (Firestore)

users · clubs · events · registrations · busRoutes · busTrips · faqs (with `_bn` fields) · resources · resourceVotes · lostFound · claims · complaints · updates · directory · notices · notifications · unansweredQuestions.

Key fields:
- `events`: title, description, clubId, clubName, type, startAt, endAt, location, capacity, registrationOpen, registrationDeadline, coverUrl, createdBy, source.
- `registrations`: eventId, userId, status (registered | waitlisted | cancelled), qrToken, checkedIn, checkedInAt.
- `resources`: title, description, courseCode, courseTitle, department, semester, type (notes | question_paper | lab_manual | notice | other), file {url, publicId, name, size}, uploaderId, status (pending | approved | rejected), verified, upvotes, keywords, summary.
- `lostFound`: kind (lost | found), title, description, category, location, date, photo, status (open | claimed | returned), verificationQuestion.
- `complaints`: trackingId (CU-2026-XXXXXX), category, subject, description, anonymous, userId (nullable), status (received | in_review | resolved), timeline[].
- `updates`: title, body, kind (class_cancelled | class_rescheduled | exam | general), department, batch, courseCode, effectiveAt.
- `directory`: title, kind (google_form | facebook_group | messenger_group | official_link), url, ownerClub, description, deadline, isOpen, source.
- Every seeded record also carries `source`.

Security rules (`firestore.rules`): signed-in users read public collections; students create their own registrations, pending resources, lost/found posts, claims and complaints and edit/delete only their own; club_admin manages events for their club and performs check-in; admin does everything including approvals and role changes. Validate field types and sizes where practical. Files are validated server-side in `/api/upload`.

---

## 7. Modules and acceptance criteria

### 7.1 Club & Event Engine
- `/events`: unified feed across all clubs; filters by club, date range (today, this week, this month, custom), type; search; Upcoming/Past tabs; "This week on campus" strip. Card shows title, club, Dhaka-time date and time, location, seats left, status (Upcoming, Today, Registration closed, Full, Past).
- `/events/[id]`, `/events/new`, `/events/[id]/edit` (club_admin/admin), `/clubs`, club detail.
- Registration with a Firestore transaction enforcing capacity, waitlist with promotion on cancel, deadline check, duplicate prevention, cancel.
- QR ticket per registration; `/my/events` lists tickets.
- `/events/[id]/checkin` for admins: camera scan with manual fallback, server-validated, rejects duplicates and cancelled tickets, shows green/red result and "checked in X / registered Y".
- Attendee table with CSV export. "Add to calendar" (.ics with correct Dhaka time and Google Calendar link).
- Done when: create event, register, see QR, scan it, duplicate scan rejected, waitlist works.

### 7.2 Resource Hub
- Browse by Department → Semester → Course; filter by type; sort by relevance, newest, most upvoted. Search across title, course code, course title, description and keywords ("CSE 2101" must work).
- Upload form (pdf, docx, pptx, png, jpg; max 10 MB) with progress. Student uploads are pending; admin uploads approved.
- Detail page with preview, download, one upvote per user (transaction), report button. `/my/uploads`.
- `/admin/resources` moderation queue: approve, reject with reason, mark verified.
- AI summary button (English and Bangla bullets plus keywords), cached in Firestore, labelled "AI generated".
- Done when: upload, moderate, find it by course code search, upvote, summarise.

### 7.3 Smart Helpdesk
- `/helpdesk`: categories (Admission, Registration and Courses, Exams, Fees and Waivers, Transport, Campus Facilities, Contacts, Rules and Discipline); instant search; each FAQ shows source link or DemoBadge; Bangla and English text.
- `/bus`: routes and trips from Firestore; search by area or stop ("Mirpur", "Uttara", "Gabtoli"); route detail with ordered stops; **next-bus countdown** for the saved route using Dhaka time and day of week; first bus tomorrow when none left today; save favourite route; persistent sample-data notice.
- `/helpdesk/exams`, `/helpdesk/fees` (waiver table official; tuition and other amounts demo), `/helpdesk/admission` (official eligibility and steps), `/helpdesk/contacts`.
- **Chatbot** (floating widget + `/assistant`): RAG over Firestore faqs, busRoutes/busTrips, upcoming events, notices, directory and `/data/official-facts.json`. Server route `/api/chat`: verify Firebase ID token, rate limit per user, max message length, keyword retrieval with simple Bangla/English normalisation, only retrieved chunks sent to Gemini. System rules: answer only from context; otherwise reply "I don't have that information. Please contact the university office at 09643-234234."; never invent times, fees, dates or rules; answer in the user's language; append "(sample data)" for demo facts; list sources. On 429/quota errors show a friendly message and fall back to the closest FAQ entries. Suggested first questions. Log unanswered questions to `unansweredQuestions` for the admin dashboard.
- Done when: an official question, a bus question, an out-of-scope question (polite refusal) and a Bangla question all behave correctly.

### 7.4 Lost & Found and Complaint Box
- `/lost-found`: tabs Lost / Found / Recently returned; filters by category, location, date; search. Post form with photo (max 5 MB, compressed client-side). Found posts can include a verification question; "This is mine" claim flow where the poster approves a claim before contact details are shared; status timeline open → claimed → returned. Suggested matches using text similarity, category and dates (no image matching). Auto-archive after 60 days; per-user posting limit.
- `/complaints/new`: category, subject, description, optional private attachment, anonymous option. Generates tracking ID `CU-2026-XXXXXX`; `/complaints/track` shows status and timeline by ID; `/my/complaints`; `/admin/complaints` with status changes, internal notes and public responses, every change timestamped. Show a note that safety/harassment matters should also be reported to the official committees.

---

## 8. Differentiators (build after the four modules work)

1. **Class Updates** (`/updates`): authorised posters publish cancellations, reschedules and exam changes; students see a feed filtered by department and batch with Today/Tomorrow labels; realtime listener; notification badge; add to calendar.
2. **Forms & Groups Directory** (`/directory`): central list of Google Forms, Facebook/Messenger groups and official links with deadline-driven Open/Closed status, a "Closing soon" section, filters, search, "Start here" for new students, student suggestions with admin approval.
3. **Today dashboard** (`/dashboard`): next bus, today's and tomorrow's events (including registered ones with QR access), class updates for the student's department and batch, latest notices, forms closing soon, recent found items, quick actions, and a first-week checklist that persists progress.
4. **Global search** (Ctrl/Cmd+K and `/search`): events, resources, FAQs, bus routes/stops, lost & found, directory, notices; grouped results; Bangla and English; cached datasets and client-side search to stay within quota.
5. **Admin dashboard** (`/admin`): users and roles, events, resources, complaints, lost & found, directory approvals, updates; simple charts (registrations per event, check-in rate, top resources, open complaints, returned items) and the list of unanswered chatbot questions.
6. **Notice summariser** (`/tools/notice-summariser`): upload a notice image; Gemini extracts text, gives a Bangla and English summary and structured dates/deadlines with add-to-calendar; labelled "AI generated – verify with the official notice".
7. **Club recommendation quiz** (`/onboarding/clubs`): 6–8 questions, transparent scoring over club tags, optional one-line AI reason, follow button, feeds the dashboard.
8. **Timetable conflict checker** (`/tools/timetable`): weekly class schedule overlaid with registered events; warns on clashes and on the event registration page.
9. **PWA + dark mode + notifications:** installable; bus schedule, saved tickets and FAQs available offline with an offline indicator; in-app notifications (event reminders 24h and 1h before, computed when the app loads with no scheduled jobs; event changes; class updates; complaint status; lost item claims); `/settings`.

---

## 9. Official data (source: cityuniversity.ac.bd; use as `source: "official"` with `sourceUrl`)

- Address: Khagan, Birulia, Savar, Dhaka-1340, Bangladesh. Telephone 09643-234234. Cell +8801322917670, +8801322917671. Query lines +8801322917672, +8801322917673 (FAQ lists +8801322917670-73).
- Established 2002 by Alhaj Mockbul Hossain. UGC-approved private university. Campus about 10 km from Gabtoli. Medium of instruction English with Bangla support.
- Faculties: Science and Engineering (CSE, EEE, Mechanical, Civil, Textile, Pharmacy, Public Health, Science & Humanities); Business and Economics (Business Administration); Arts & Social Science (English, Law); Agriculture (Agriculture). Programmes include BBA, MBA, EMBA.
- Links: iEMS https://iems.cityuniversity.ac.bd/ · webmail https://outlook.office.com/ · library https://library.cityuniversity.ac.bd/ · IQAC https://cityuniversity.ac.bd/iqac · admission https://admission.cityuniversity.ac.bd/ · transport https://cityuniversity.ac.bd/transportfacilities · FAQ https://cityuniversity.ac.bd/faq · waiver https://cityuniversity.ac.bd/waiverpolicy · eligibility https://cityuniversity.ac.bd/admission-eligibility · tuition page https://cityuniversity.ac.bd/tution-fees · financial aid https://cityuniversity.ac.bd/financial-aid-scholarshis · application process https://cityuniversity.ac.bd/application-process · Student Portal https://cityuniversity.orbund.com/einstein-freshair/index.jsp.
- Transport: buses run on a set schedule covering major routes, with extra arrangements for late evenings, weekends and exam periods (no routes or timings are published).
- Facilities and life: classrooms, computer labs, textile labs, libraries, hostels (separate for male and female, near campus), cafeterias, playgrounds; cultural clubs, debating society, sports, programming contests, seminars, research projects.
- Scholarships and waivers are based on SSC/HSC results, admission test merit, financial need, freedom fighter quota, and siblings/alumni support.
- **Undergraduate waiver policy** (SSC & HSC result → waiver → CGPA to retain from 2nd semester): Golden GPA 5.00 in both → 100% → 3.60; only GPA 5.00 in both → 75% → 3.50; total 9.00–9.99 → 30% → 3.20; 8.00–8.99 → 25% → 3.00; 7.00–7.99 → 20% → 3.00; 6.00–6.99 → 15% → 3.00; 5.00–5.99 → 10% → 3.00. Special categories (siblings, husband-wife, Hafiz of the Holy Quran, children or grandchildren of freedom fighters, physically challenged students, sports quota): up to 50%. Only the highest waiver applies.
- **Eligibility:** minimum GPA 2.5 each in SSC/equivalent and HSC/equivalent with a total GPA of 6.00; minimum 2.0 in SSC/O-Level and HSC/A-Level for Music, Fashion Design, Fine Arts and Graphic Design; graduate programmes need an undergraduate degree with at least 2.0 CGPA. Required papers: two attested copies of all mark sheets and certificates (originals at admission), four attested passport-size colour photos, attested national ID copy, attested Union Parishad/Ward Commissioner certificate, job experience certificate for EMBA. Steps: get and fill the admission form, submit with four attested photos within the deadline and pay the form fee if not yet paid, sit the admission test, submit attested certificates of all board exams, pay admission and other fees, collect the ID card from the Admission Office.
- **Notices:** Fall-2026 trimester course registration and class start (2 Oct 2026); mid-term/final exam notice (17 Sep 2026); postponed exams notice (22 Sep 2026); harassment committee formation (22 Sep 2026); anti-drug committee formation (14 Sep 2026).
- Recent events: Syndicate meeting (27 Sep 2026), BAC accreditation meeting (30 Aug 2026), Education & Career Expo job fair (25 Aug 2026).

---

## 10. Demo data (all `source: "demo"`, clearly labelled; all figures illustrative)

- **Bus routes** (campus is Khagan, Birulia, Savar): R1 Gabtoli ↔ Campus via Savar Bus Stand (departs Gabtoli 07:00, 08:00, 09:00; departs campus 13:30, 15:30, 17:00). R2 Mirpur-10 ↔ Campus via Mirpur-1 and Gabtoli (departs Mirpur-10 06:45, 07:45; campus 14:00, 16:30). R3 Uttara (Abdullahpur) ↔ Campus via Ashulia (06:30, 07:30; campus 14:00, 17:00). R4 Dhanmondi (Asad Gate) ↔ Campus via Gabtoli (07:00; campus 16:00). R5 Savar/Nabinagar local shuttle about every 30 minutes, 07:30–18:00. Add an exam-period extra trips note.
- **Fees (BDT, illustrative):** admission fee 15,000–20,000 one time; tuition per credit CSE/EEE 3,500–4,500, BBA/English 2,500–3,200, Pharmacy 4,000–5,000, Law about 2,800; trimester fee 8,000–12,000; lab/library/ICT fee 1,500–3,000; typical CSE programme (about 140 credits) total around 5–6 lakh.
- **Exam logistics:** exam routine, ID card required, 75% attendance rule, make-up exam application window.
- **Sample content:** 12 plausible clubs (programming, robotics, debate, cultural, photography, business and innovation, sports, language, social service, research, entrepreneurship, rover/scout style); 15 events over the next three weeks with realistic Dhaka times; 30 resource records across departments with small sample PDFs; 8 lost/found posts; 5 class updates; 12 directory links (demo unless real); demo users for student, club admin and admin (write to `docs/DEMO_ACCOUNTS.md`).
- The seed script must be idempotent and runnable with `npm run seed`.

---

## 11. Build phases (stop and report after each phase)

After each phase: run type check and lint, deploy to Vercel, update `PROGRESS.md`, commit with a conventional message (`feat:`, `fix:`, `docs:`, `chore:`), and tell me exactly how to test. Do not start the next phase until I confirm.

| Phase | Work |
|---|---|
| 1 | Project setup, `.env.example`, `.gitignore`, Firebase client/admin, auth, roles, split-screen sign-in, route protection, first deploy |
| 2 | Design system, app shell, i18n (EN/BN), dark mode, footer, DemoBadge, DataNotice |
| 3 | Data model, TypeScript types, `firestore.rules`, seed script skeleton, `/api/upload` (Cloudinary) and FileUploader |
| 4 | Events: feed, filters, detail, admin create/edit, clubs |
| 5 | Registration, waitlist, QR tickets, check-in scanner, attendees CSV, calendar export |
| 6 | Bus module and next-bus countdown |
| 7 | Helpdesk FAQ, admission, fees, exams, contacts |
| 8 | Chatbot (RAG, Gemini, quota fallback, unanswered log) |
| 9 | Resource Hub: upload, browse, search, upvote, report, moderation, AI summary |
| 10 | Lost & Found with claim flow and suggested matches; Complaint Box with tracking |
| 11 | Seed data (official + demo) and verify every module with real data |
| 12 | Class Updates, Directory, Today dashboard, global search, admin dashboard |
| 13 | Notice summariser, club quiz, timetable checker, PWA, notifications, settings |
| 14 | QA pass (all roles, 360/768/1280px, console errors, time zones) → `docs/TEST_REPORT.md` |
| 15 | Security and free-tier audit → `docs/FREE_TIER.md`; Lighthouse → `docs/LIGHTHOUSE.md` |
| 16 | UI polish, accessibility, Bangla rendering, dark mode contrast |
| 17 | README, docs, `/judges` page, final production checks |

Priority if time runs short: phases 1–11 and 17 are mandatory; phases 12–13 add the most points; cut from the end of phase 13 first. Never cut the README, demo accounts or final deployment checks.

---

## 12. Documentation requirements

- **README.md** sections: project name and description; the problem and the six frictions; solution overview; live link and demo credentials; screenshots (placeholders in `docs/screenshots`); modules and how each works; AI features, how they are grounded and limited; tech stack (every service on a free plan with quotas and how the app stays within them); architecture with a Mermaid diagram; data model summary; **real-world usability walkthroughs** for each friction (for example a first-year student checking the Resource Hub the night before an exam instead of messaging five groups; a student checking the next bus on their route instead of searching Messenger; a student seeing a class cancellation for their batch the moment it is posted; a student losing an ID card and finding it listed within hours); **data sources table** separating official data (with URLs) from demo data; how to run locally (prerequisites, install, env vars, Firebase setup, seed, emulator, dev server, tests); deployment steps; security notes; accessibility notes; known limitations; project structure; team members; licence.
- Also create: `.env.example`, `LICENSE` (MIT), `CONTRIBUTING.md` (short), `docs/ARCHITECTURE.md`, `docs/DEMO_ACCOUNTS.md`, `docs/DATA_SOURCES.md`, `docs/FREE_TIER.md`, `docs/TEST_REPORT.md`, `docs/LIGHTHOUSE.md`, issue and PR templates.
- Write in a professional, plain tone without hype.
- `/judges` page: demo credentials for student, club admin and admin; a 2-minute guided path; a table mapping each judging criterion to where it can be seen; a table mapping each friction to its feature; a clear statement of official vs demo data.

---

## 13. Definition of done

- Live Vercel URL; sign-up, login, Google sign-in and email verification work in a private window.
- All four modules work end to end with real Firestore data; demo accounts work for every role.
- No dead buttons, no console errors, correct Dhaka time everywhere, every list handles loading, empty and error states.
- Demo data labelled everywhere; chatbot refuses politely when it lacks data.
- No secrets in the repo; nothing requires a paid plan.
- README and docs complete; repo inside the CPCCU GitHub organisation.
- Demo video recorded (Problem → Solution → Demo → Features → Technical Implementation) and the official submission form filled before **8:00 pm, 8 October 2026**.

---

## 14. Repository presentation (professional GitHub repo)

- In phase 1, replace the default README with a short but real one: title, one-line description, the problem in 2 sentences, stack, local setup and env vars. Improve it every phase; phase 17 completes it. The repo must never look empty.
- .gitignore already exists from GitHub (Node): merge into it, do not overwrite. LICENSE (MIT) already exists: keep it.
- README top section: project name, one-line description, a row of honest badges only (live demo link, MIT licence, Next.js, Firebase, "free-tier only"). No fake "build passing" badge unless a real CI exists. Then a hero screenshot, a table of contents, and a "Live demo and demo credentials" block.
- Screenshots: capture real screens (dashboard, events with QR, resource hub, chatbot in Bangla, lost & found, admin) into docs/screenshots and embed them in the README. No placeholders in the final version.
- Clean history: conventional commits only (feat:, fix:, docs:, chore:), no "wip" or "update" commits, no secrets ever.
- Clean tree: no unused files, no committed .env*, no large binaries; the root contains README, LICENSE, CONTRIBUTING, PROGRESS.md, config files, app/components/lib/types/data/scripts/docs/public.
- After the first deploy, give me this command to set the GitHub About section (replace the URL):
  gh repo edit cpccu/Hackathon2-NoArk --description "CampusOS: unified campus hub for City University" --homepage "https://<vercel-url>" --add-topic nextjs --add-topic firebase --add-topic typescript --add-topic tailwindcss --add-topic gemini --add-topic pwa --add-topic bangladesh --add-topic hackathon
  If org permissions block it, tell me to set it in the repo sidebar (the gear next to About).
