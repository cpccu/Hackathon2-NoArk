# Contributing to CampusOS

Thank you for your interest in contributing to **CampusOS (City University Unified Campus Platform)** for the CPCCU Hackathon 2026!

## Code Quality & Architecture Standards

1. **Strict TypeScript:** No `any` type overrides where interfaces can be defined.
2. **Zero-Cost Constraint:** Every feature, API, and storage pipeline must operate entirely within free-tier quotas (Firebase Spark, Vercel Hobby, Cloudinary Free, Google Gemini API free quota). Never introduce dependencies that require a paid billing account.
3. **Data Integrity & Labeling:**
   - Official university data must include `source: "official"` and a verified reference URL.
   - Sample or mock data must carry `source: "demo"` and display the `DemoBadge`.
4. **Timezone:** All dates, events, countdowns, and timetables must strictly follow **Asia/Dhaka** (`Asia/Dhaka` timeZone with `Intl.DateTimeFormat`).
5. **Conventional Commits:** All git commits must strictly follow standard conventional formatting (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
