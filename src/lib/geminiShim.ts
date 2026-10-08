// Drop-in replacement for @google/generative-ai using the Gemini Interactions API.
const MODEL_DEFAULT = "gemini-3.8-flash";

function toPrompt(input: any): string {
  if (typeof input === "string") return input;
  if (Array.isArray(input)) {
    return input.map((p) => (typeof p === "string" ? p : p?.text ?? "")).join("\n\n");
  }
  const contents = input?.contents ?? [];
  return contents
    .flatMap((c: any) => (c.parts ?? []).map((p: any) => p.text ?? ""))
    .join("\n\n");
}

export class GoogleGenerativeAI {
  constructor(private apiKey: string) {}
  getGenerativeModel(_opts?: any) {
    const apiKey = this.apiKey;
    return {
      async generateContent(input: any) {
        const model = process.env.GEMINI_MODEL || MODEL_DEFAULT;
        const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
          method: "POST",
          headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({ model, input: toPrompt(input) }),
        });
        if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
        const data = await res.json();
        const steps: any[] = data.steps ?? [];
        const out = [...steps].reverse().find((s) => s.type === "model_output");
        let text: string = (out?.content ?? []).map((c: any) => c.text ?? "").join("").trim();
        if (!text) throw new Error("Gemini returned no text");
        if (text.startsWith("```")) text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
        return { response: { text: () => text } };
      },
    };
  }
}
