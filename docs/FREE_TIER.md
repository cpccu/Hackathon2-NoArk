# Free-Tier Quota & Cost Audit

CampusOS is engineered strictly under **Zero Cost** constraints. No paid billing accounts or credit cards are required.

| Service | Plan | Free Limits | App Strategy to Guarantee Zero Cost |
|---|---|---|---|
| **Vercel** | Hobby | 100 GB bandwidth / mo, serverless execution limits | Pure static page pre-rendering where applicable, lightweight edge functions. |
| **Firebase** | Spark Plan | 50K Firestore reads/day, 20K writes/day, 1GB storage | Client-side memory caching, indexed queries, zero continuous polling loops. |
| **Cloudinary** | Free Tier | 25 monthly credits (~25GB storage/bandwidth) | Client-side image compression before upload, 10MB file ceiling. |
| **Google Gemini** | Free Tier (1.5 Flash) | 15 RPM, 1M TPM, 1,500 requests/day | Keyword pre-filtering (RAG), client/IP rate-limiting, and instant fallback to verified FAQs. |

No service will ever incur cost or downgrade without an explicit administrative prompt.
