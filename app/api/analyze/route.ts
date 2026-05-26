import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const TRIAL_DAYS = 7;

const SYSTEM_PROMPTS: Record<string, string> = {
  pain: "Pijn-indicatie: Analyseer de gezichtsuitdrukking. Let op ogen, oren en bek.",
  vomit: "Braaksel Analyse: Analyseer de kleur en inhoud.",
  poop: "Ontlasting: beoordeel consistentie en kleur.",
  eyes: "Ogen: check op troebelheid of roodheid.",
  ears: "Oren: check op roodheid en afscheiding.",
  nose: "Neus: check op korsten of uitvloeiing.",
  skin: "Huid: zoek naar kale plekken en roodheid.",
  ticks: "Teken: Zoek naar vlooien en teken.",
  mange: "Schurft: Zoek naar haaruitval of korstjes.",
  dental: "Gebit: zoek naar tandsteen of ontstekingen.",
  symmetry: "Symmetrie: Analyseer de stand en gewicht.",
  coat: "Vacht: Beoordeel glans en kwaliteit.",
};

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    // 1. Metadata check via JWT (Clerk JWT Template)
    const metadata = sessionClaims?.metadata as
      | { role?: string; trialEndsAt?: string }
      | undefined;
    const isPro = metadata?.role === "pro";
    const trialEndsAt = metadata?.trialEndsAt;
    const isTrialValid =
      trialEndsAt && new Date(trialEndsAt).getTime() > Date.now();

    if (!isPro && !isTrialValid) {
      return NextResponse.json({ error: "Toegang geweigerd" }, { status: 403 });
    }

    // 2. Input verwerking
    const { image, toolId, dogId } = await req.json();
    if (!image)
      return NextResponse.json({ error: "Geen afbeelding" }, { status: 400 });

    const base64Data = image.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const instruction =
      SYSTEM_PROMPTS[toolId] || "Voer een algemene veterinaire check uit.";

    // 3. Blob opslag
    const blob = await put(`scans/${userId}/${Date.now()}.jpg`, buffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    // 4. AI Analyse
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Veterinair Expert. Opdracht: ${instruction}. STRIKT JSON: {"summary": "string", "isOk": boolean, "details": "string", "advice": "string"}`,
            },
            { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          ],
        },
      ],
      config: { responseMimeType: "application/json" },
    });

    const aiData = JSON.parse(
      result
        .text!.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim(),
    );

    // 5. Database opslag
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      INSERT INTO scans (user_id, dog_id, tool_id, image_url, summary, is_ok, details, advice) 
      VALUES (${userId}, ${dogId}, ${toolId}, ${blob.url}, ${aiData.summary}, ${aiData.isOk}, ${aiData.details}, ${aiData.advice})
    `;

    return NextResponse.json(aiData);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Fout bij verwerken" }, { status: 500 });
  }
}
