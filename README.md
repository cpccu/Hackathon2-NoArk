# CampusOS – City University

> Unified web portal and campus life operating system for City University (Khagan, Birulia, Savar, Dhaka-1340, Bangladesh).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Spark%20Free-orange)](https://firebase.google.com/)
[![Hosting](https://img.shields.io/badge/Vercel-Hobby%20Free-black)](https://vercel.com/)
[![Free Tier Only](https://img.shields.io/badge/Cost-100%25%20Free%20Plan-success)](#)

---

## The Problem

Campus information at City University is currently scattered across fragmented Facebook groups, ephemeral Messenger group chats, ad-hoc Google Forms, and physical notice boards. Students miss registration deadlines, struggle with unpredictable bus schedules, miss sudden class cancellations, and have no centralized place to retrieve verified academic resources or report lost items.

CampusOS solves this by providing a single, authoritative, and role-aware campus operating system built specifically for City University students, club leaders, faculty, and administrators.

---

## Core Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS (Editorial Academic Palette: Deep Navy & Restrained Gold)
- **Authentication**: Firebase Authentication (Google Sign-In & Email/Password with Verification)
- **Database**: Cloud Firestore (Spark Free Tier)
- **Media Uploads**: Cloudinary (Free Tier)
- **AI Intelligence**: Google Gemini API (Free Tier, server-side only)
- **Deployment**: Vercel Hobby

---

## Local Setup

### 1. Prerequisites
- Node.js >= 18 (recommended: v20 LTS)
- npm >= 9

### 2. Clone & Install
```bash
git clone https://github.com/cpccu/Hackathon2-NoArk.git
cd Hackathon2-NoArk
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and fill in the Firebase credentials:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development Phases

CampusOS is engineered methodically through 17 structured phases for the CPCCU Hackathon 2026. See [PROGRESS.md](PROGRESS.md) for live progress logs.
