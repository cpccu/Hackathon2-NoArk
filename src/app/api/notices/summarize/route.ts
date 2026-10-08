import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@/lib/geminiShim";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { noticeText } = body;

    if (!noticeText || typeof noticeText !== "string" || !noticeText.trim()) {
      return NextResponse.json({ error: "Notice text is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      // Deterministic fallback
      return NextResponse.json({
        enSummary: [
          "Official administrative communication from City University.",
          "Students must adhere to indicated trimester timelines and examination protocols.",
          "Contact the Registrar Office (09643-234234) for departmental clarification.",
        ],
        bnSummary: [
          "সিটি ইউনিভার্সিটির অফিশিয়াল প্রশাসনিক বিজ্ঞপ্তি।",
          "শিক্ষার্থীদের উল্লিখিত ট্রাইমেস্টার সময়সীমা এবং পরীক্ষার নিয়ম মেনে চলার অনুরোধ করা হয়েছে।",
          "বিস্তারিত জানতে রেজিস্ট্রার অফিসের সাথে (০৯৬৪৩-২৩৪২৩৪) যোগাযোগ করুন।",
        ],
        deadlines: [
          { label: "Administrative Effective Date", date: "2026-10-15T17:00:00+06:00" },
        ],
        source: "deterministic_fallback",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `You are the CampusOS official notice summarizer for City University (Birulia, Savar, Dhaka-1340, Bangladesh).
Analyze the following university notice text and provide:
1. "enSummary": 2-3 key takeaway bullet points in English.
2. "bnSummary": 2-3 key takeaway bullet points in clear, natural Bangla.
3. "deadlines": An array of objects with { "label": string, "date": "YYYY-MM-DDTHH:mm:ss+06:00" } for any dates/deadlines mentioned. If no date is mentioned, return an empty array.

Output valid JSON only with keys "enSummary", "bnSummary", "deadlines".

Notice text:
${noticeText.slice(0, 3000)}
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(result.response.text());
    return NextResponse.json({
      enSummary: parsed.enSummary || ["Notice parsed successfully."],
      bnSummary: parsed.bnSummary || ["বিজ্ঞপ্তিটি সফলভাবে প্রক্রিয়া করা হয়েছে।"],
      deadlines: parsed.deadlines || [],
      source: "gemini",
    });
  } catch (err: any) {
    console.warn("Notice summarizer error:", err);
    return NextResponse.json({
      enSummary: [
        "University notice regarding academic scheduling and trimester protocols.",
        "Please confirm all dates on the official notice board or iEMS portal.",
      ],
      bnSummary: [
        "একাডেমিক সময়সূচি ও ট্রাইমেস্টার সংক্রান্ত বিশ্ববিদ্যালয় বিজ্ঞপ্তি।",
        "অফিসিয়াল নোটিশ বোর্ড অথবা আইইএমএস পোর্টাল থেকে তারিখ নিশ্চিত করুন।",
      ],
      deadlines: [],
      source: "error_fallback",
    });
  }
}
