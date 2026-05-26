import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { put, del } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";
import sharp from "sharp";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const metadata = sessionClaims?.metadata as
      | { role?: string; trialEndsAt?: string }
      | undefined;
    const isPro = metadata?.role === "pro";
    const trialEndsAt = metadata?.trialEndsAt;
    const isTrialValid =
      trialEndsAt && new Date(trialEndsAt).getTime() > Date.now();

    if (!isPro && !isTrialValid)
      return NextResponse.json({ error: "Toegang geweigerd" }, { status: 403 });

    const { blobUrl, toolId, dogId } = await req.json();
    if (!blobUrl)
      return NextResponse.json(
        { error: "Geen afbeelding URL" },
        { status: 400 },
      );

    // Haal de foto op van Vercel Blob en comprimeer server-side
    const fetchRes = await fetch(blobUrl);
    const rawBuffer = Buffer.from(await fetchRes.arrayBuffer());

    const compressed = await sharp(rawBuffer)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toBuffer();

    // Verwijder ruwe upload — niet fataal als het mislukt
    try {
      await del(blobUrl);
    } catch {
      // niet fataal
    }

    const blob = await put(`scans/${userId}/${Date.now()}.jpg`, compressed, {
      access: "public",
      contentType: "image/jpeg",
    });

    const base64Data = compressed.toString("base64");
    const instruction =
      SYSTEM_PROMPTS[toolId] || "Voer een algemene veterinaire check uit.";

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
