import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import officialFacts from "@/data/official-facts.json";
import { INITIAL_FAQS } from "@/data/initialFaqs";
import { INITIAL_BUS_ROUTES, INITIAL_BUS_TRIPS } from "@/data/initialBus";
import { INITIAL_EVENTS } from "@/data/initialEvents";

// In-memory IP/User rate limiting (free plan protection per section 7.3)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(identifier);

  if (!entry || now > entry.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Simple keyword-based chunk retrieval over FAQs, Bus, Events, and Official Facts
function retrieveRelevantChunks(query: string): { chunk: string; source: string; isDemo: boolean }[] {
  const normalizedQuery = query.toLowerCase();
  const results: { chunk: string; source: string; isDemo: boolean }[] = [];

  // 1. FAQs
  for (const faq of INITIAL_FAQS) {
    const textEn = `${faq.question_en} ${faq.answer_en}`.toLowerCase();
    const textBn = `${faq.question_bn} ${faq.answer_bn}`;
    if (
      normalizedQuery.split(/\s+/).some((term) => term.length > 2 && (textEn.includes(term) || textBn.includes(term)))
    ) {
      results.push({
        chunk: `Q: ${faq.question_en} / ${faq.question_bn}\nA: ${faq.answer_en}`,
        source: faq.sourceUrl || "Official FAQ",
        isDemo: faq.source === "demo",
      });
    }
  }

  // 2. Bus Routes
  if (
    normalizedQuery.includes("bus") ||
    normalizedQuery.includes("shuttle") ||
    normalizedQuery.includes("route") ||
    normalizedQuery.includes("transport") ||
    normalizedQuery.includes("মিরপুর") ||
    normalizedQuery.includes("গাবতলী") ||
    normalizedQuery.includes("উত্তরা") ||
    normalizedQuery.includes("সাভার") ||
    normalizedQuery.includes("ধানমন্ডি") ||
    normalizedQuery.includes("বাস")
  ) {
    for (const route of INITIAL_BUS_ROUTES) {
      results.push({
        chunk: `Bus Route ${route.routeNumber}: ${route.name}. Stops: ${route.stops.join(" -> ")}. Description: ${route.description}`,
        source: "Campus Bus Shuttle Schedule (Demo)",
        isDemo: true,
      });
    }
  }

  // 3. Events
  if (
    normalizedQuery.includes("event") ||
    normalizedQuery.includes("workshop") ||
    normalizedQuery.includes("seminar") ||
    normalizedQuery.includes("contest") ||
    normalizedQuery.includes("ইভেন্ট") ||
    normalizedQuery.includes("প্রতিযোগিতা")
  ) {
    for (const evt of INITIAL_EVENTS.slice(0, 5)) {
      results.push({
        chunk: `Campus Event: ${evt.title} by ${evt.clubName} at ${evt.location}. Start: ${evt.startAt}.`,
        source: `Club Event: ${evt.clubName}`,
        isDemo: evt.source === "demo",
      });
    }
  }

  // 4. Always include core official university grounding facts
  results.push({
    chunk: `Official University Facts: Established 2002 by Alhaj Mockbul Hossain. Campus: Khagan, Birulia, Savar, Dhaka-1340. Telephone: 09643-234234. Cell: +8801322917670-73. Medium of instruction: English with Bangla support. Undergraduate eligibility: Min GPA 2.5 each in SSC/HSC, total GPA 6.00. Waiver: Golden GPA 5.0 in both = 100% (retain 3.60 CGPA), GPA 5.0 both = 75% (retain 3.50). Attendance rule: 75% mandatory class attendance for exams. Standing Sexual Harassment Committee (22 Sep 2026) and Anti-Drug Committee (14 Sep 2026).`,
    source: "Official University Registry (cityuniversity.ac.bd)",
    isDemo: false,
  });

  return results.slice(0, 6);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, token } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: "Message exceeds maximum character length of 500." },
        { status: 400 }
      );
    }

    // Rate limiting key (fallback to IP if no user ID provided)
    let rateKey = "anon-" + (req.headers.get("x-forwarded-for") || "local");

    if (token) {
      try {
        if (adminAuth) {
          const decoded = await adminAuth.verifyIdToken(token);
          rateKey = `uid-${decoded.uid}`;
        }
      } catch {
        // Fall back to IP rate limit
      }
    }

    if (!checkRateLimit(rateKey)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait a minute before sending more queries.",
          isRateLimited: true,
        },
        { status: 429 }
      );
    }

    // Retrieve context chunks
    const retrieved = retrieveRelevantChunks(message);
    const contextPrompt = retrieved.map((r) => r.chunk).join("\n\n");
    const sourcesList = Array.from(new Set(retrieved.map((r) => r.source)));

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      // Offline fallback when no Gemini key provided
      const bestFaq = INITIAL_FAQS.find(
        (f) =>
          f.question_en.toLowerCase().includes(message.toLowerCase()) ||
          f.answer_en.toLowerCase().includes(message.toLowerCase()) ||
          message.includes(f.question_bn)
      );

      if (bestFaq) {
        return NextResponse.json({
          reply: `${bestFaq.answer_en}\n\n[বাংলা: ${bestFaq.answer_bn}]`,
          sources: [bestFaq.sourceUrl || "Official FAQ"],
          fallback: true,
        });
      }

      return NextResponse.json({
        reply:
          "I don't have that information in the verified campus records. Please contact the university central desk at 09643-234234 or email admission@cityuniversity.ac.bd.",
        sources: ["City University Central Helpline: 09643-234234"],
        fallback: true,
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `You are CampusOS AI Assistant for City University, Bangladesh (permanent campus at Khagan, Birulia, Savar).
STRICT RULES:
1. Answer ONLY from the provided CONTEXT below. Do NOT hallucinate or guess.
2. If the answer is NOT present in the context, you MUST reply: "I don't have that information. Please contact the university office at 09643-234234."
3. NEVER invent exam times, tuition fees, dates, or academic regulations.
4. Reply in the language used by the user (if they ask in Bangla, reply in natural Bangla; if in English, reply in English).
5. For bus schedules, tuition amounts, or hackathon sample facts, append "(sample data)" or "(নমুনা তথ্য)".
6. Keep the response polite, accurate, concise, and structured.

CONTEXT:
${contextPrompt}
`;

      const result = await model.generateContent([systemPrompt, `User Question: ${message}`]);
      const replyText = result.response.text();

      // Check if unanswered
      const isUnanswered =
        replyText.includes("I don't have that information") ||
        replyText.includes("তথ্যটি আমার কাছে নেই") ||
        replyText.includes("09643-234234");

      if (isUnanswered) {
        // Log to unansweredQuestions collection
        try {
          if (adminDb) {
            await adminDb.collection("unansweredQuestions").add({
              question: message,
              askedAt: new Date().toISOString(),
              resolved: false,
            });
          }
        } catch (logErr) {
          console.warn("Could not log unanswered question to Firestore:", logErr);
        }
      }

      return NextResponse.json({
        reply: replyText,
        sources: sourcesList,
        isUnanswered,
      });
    } catch (aiErr: any) {
      console.warn("Gemini generation error / quota limit reached:", aiErr);

      // On 429 quota or Gemini error: fallback to closest FAQ
      const bestFaq = INITIAL_FAQS[0];
      return NextResponse.json({
        reply: `Notice: AI assistant quota is active. Here is related verified information:\n\n${bestFaq.answer_en}\n\nFor further help, please contact the campus office directly at 09643-234234.`,
        sources: ["Official FAQ Fallback"],
        fallback: true,
      });
    }
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error processing campus query." },
      { status: 500 }
    );
  }
}
