# CampusOS Architecture & System Design

CampusOS is a production-grade, zero-cost, multi-tenant academic portal tailored specifically for City University (Khagan, Birulia, Savar, Dhaka-1340).

## 1. System Topology & Mermaid Diagram

```mermaid
graph TD
    Client[Next.js 14 App Router / React 18 / Tailwind]
    
    subgraph "Authentication & User Layer"
        FirebaseAuth[Firebase Auth: Email/Pass & Google]
        RBAC[Role-Based Access Control: Student, Club Admin, Admin]
    end

    subgraph "Database & Storage Layer"
        Firestore[Cloud Firestore: Spark Free Plan]
        Cloudinary[Cloudinary CDN: Documents & Images]
    end

    subgraph "AI & Intelligence Layer"
        ChatRoute["Server Route: /api/chat"]
        SummarizeRoute["Server Route: /api/resources/summarize"]
        Gemini[Google Gemini 1.5 Flash Free Tier]
        Grounding[Official Facts Grounding & FAQs Cache]
    end

    Client --> FirebaseAuth
    Client --> RBAC
    Client --> Firestore
    Client --> Cloudinary
    Client --> ChatRoute
    Client --> SummarizeRoute
    ChatRoute --> Grounding
    ChatRoute --> Gemini
    SummarizeRoute --> Gemini
```

## 2. Key Architectural Guarantees

1. **Zero Billing Overhead:** Configured exclusively using free tiers (Vercel Hobby + Firebase Spark + Cloudinary Free + Google Gemini API).
2. **Deterministic Fallbacks:** If Firestore or Gemini API quotas are exhausted, in-memory local caches and structured FAQs serve immediate answers with 0 downtime.
3. **Strict Dhaka Time Synchronization:** Timers, calendar exports, and schedules use `Asia/Dhaka` Intl formatting.
