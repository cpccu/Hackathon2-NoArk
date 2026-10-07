import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, courseCode, courseTitle } = body;

    if (!title || !courseCode) {
      return NextResponse.json({ error: "Missing required fields for summary" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      // Deterministic bilingual summary fallback
      return NextResponse.json({
        en: `Key academic topics in ${courseCode} (${courseTitle || "Course"}): Lecture notes and structured syllabus review covering ${title}. Ideal for exam preparation.`,
        bn: `${courseCode} (${courseTitle || "কোর্স"}) এর মূল একাডেমিক বিষয়ের সারাংশ: ${title} সম্পর্কিত লেকচার নোট ও পরীক্ষা প্রস্তুতির জন্য উপযোগী সারাংশ।`,
        source: "Fallback Generator",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are CampusOS academic summarizer for City University, Bangladesh.
Generate a concise 2-sentence summary in English and natural Bangla for this university course resource.
Return JSON with keys "en" and "bn".

Course: ${courseCode} - ${courseTitle || ""}
Title: ${title}
Description: ${description || "No description provided."}
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const text = result.response.text();
    const parsed = JSON.parse(text);

    return NextResponse.json({
      en: parsed.en || `Summary for ${courseCode}: ${title}`,
      bn: parsed.bn || `${courseCode} কোর্সের একাডেমিক সারাংশ: ${title}`,
    });
  } catch (err: any) {
    console.warn("AI summary generation error:", err);
    return NextResponse.json({
      en: "Structured syllabus materials and core study references for final examination preparation.",
      bn: "পরীক্ষার চূড়ান্ত প্রস্তুতির জন্য প্রয়োজনীয় সিলেবাস ও গুরুত্বপূর্ণ স্টাডি রেফারেন্স।",
    });
  }
}
