import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";
import { TRIAL_DAYS } from "../../trial-config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPTS: Record<string, string> = {
  pain: "Pijn-indicatie: Analyseer de gezichtsuitdrukking (Dog Facial Assessment). Let op samengeknepen ogen, stand van de oren en spanning rond de bek.",
  vomit:
    "Braaksel Analyse: Analyseer de kleur en inhoud van het braaksel op de foto.",
  poop: "Analyseer de ontlasting: beoordeel consistentie, kleur, slijm of parasieten.",
  eyes: "Focus op de ogen: check op troebelheid, roodheid of afscheiding.",
  ears: "Ooranalyse: Kijk in de oorschelp op roodheid, oorsmeer of infectie.",
  nose: "Neusanalyse: Check op droogheid, korsten of uitvloeiing.",
  skin: "Huidanalyse: zoek naar kale plekken, roodheid, hotspots of korstjes.",
  ticks:
    "Parasieten & Teken Check: Zoek naar vlooien, luizen, mijten en teken.",
  mange:
    "Schurft & Ringworm: Zoek naar cirkelvormige haaruitval of korstvorming.",
  dental:
    "Check het gebit: zoek naar tandsteen, rood tandvlees of ontstekingen.",
  symmetry:
    "Lichaams-Symmetrie Check: Analyseer de stand en gewichtsverdeling van de hond.",
  coat: "Vachtkwaliteit: Beoordeel glans, dofheid of voedingstekorten.",
};

export async function POST(req: Request) {
  try {
    // 1. Auth & Trial Check
    const { userId, sessionClaims } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    const metadata = sessionClaims?.metadata as
      | { role?: string; trialEndsAt?: string }
      | undefined;
    const isPro = metadata?.role === "pro";
    const trialEndsAt = metadata?.trialEndsAt;

    // STRIKTE CHECK: Alleen toegang als Pro OF geldige trial datum
    const isTrialValid =
      trialEndsAt && new Date(trialEndsAt).getTime() > Date.now();

    if (!isPro && !isTrialValid) {
      return NextResponse.json(
        { error: "Toegang geweigerd: Abonnement of trial verlopen." },
        { status: 403 },
      );
    }

    // 2. Input check
    const { image, toolId, dogId } = await req.json();
    if (!image)
      return NextResponse.json({ error: "Geen afbeelding" }, { status: 400 });

    const base64Data = image.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const instruction =
      SYSTEM_PROMPTS[toolId] || "Voer een algemene veterinaire check uit.";

    // 3. Blob Upload
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
              text: `Jij bent een AI Veterinaire Expert. Opdracht: ${instruction}. STRIKT JSON: {"summary": "string", "isOk": boolean, "details": "string", "advice": "string"}`,
            },
            { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          ],
        },
      ],
      config: { responseMimeType: "application/json" },
    });

    const rawText = result.text;
    if (!rawText) throw new Error("Lege response");
    const aiData = JSON.parse(
      rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim(),
    );

    // 5. Database Opslag
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
