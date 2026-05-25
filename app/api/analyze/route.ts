import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { auth, clerkClient } from "@clerk/nextjs/server";

const TRIAL_DAYS = 7;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPTS: Record<string, string> = {
  pain: "Pijn-indicatie: Analyseer de gezichtsuitdrukking (Dog Facial Assessment). Let op samengeknepen ogen, stand van de oren en spanning rond de bek.",
  vomit:
    "Braaksel Analyse: Analyseer de kleur en inhoud van het braaksel op de foto. Herken signalen van gal (geel), bloed (rood/bruin), vreemde voorwerpen of maagzuur (wit schuim).",
  poop: "Analyseer de ontlasting: beoordeel consistentie, kleur, slijm of zichtbare parasieten.",
  eyes: "Focus op de ogen: check op troebelheid (staar), roodheid (ontsteking), afscheiding of zwelling.",
  ears: "Ooranalyse: Kijk in de oorschelp op roodheid, overmatig oorsmeer, gele afscheiding of korstjes.",
  nose: "Neusanalyse: Check op overmatige droogheid, korsten of abnormale neusuitvloeiing.",
  skin: "Huidanalyse: zoek naar kale plekken, roodheid, hotspots, korstjes of schilfering.",
  ticks:
    "Parasieten & Teken Check: Zoek naar vlooien, luizen, mijten of vastgebeten teken.",
  mange:
    "Schurft & Ringworm: Zoek naar cirkelvormige haaruitval of extreme korstvorming.",
  dental:
    "Check het gebit: zoek naar tandsteen, rood tandvlees of terugwijkend tandvlees.",
  symmetry:
    "Lichaams-Symmetrie Check: Analyseer de stand van de hond op asymmetrie of gewrichtspijn.",
  coat: "Vachtkwaliteit: Beoordeel glans, dofheid, vettigheid of overmatige verharing.",
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    // 1. Haal user metadata direct op uit Clerk (Geen JWT afhankelijkheid)
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.publicMetadata as {
      role?: string;
      trialEndsAt?: string;
    };

    const isPro = metadata.role === "pro";
    const trialEndsAt = metadata.trialEndsAt;
    const isTrialValid =
      trialEndsAt && new Date(trialEndsAt).getTime() > Date.now();

    // 2. Beveiliging: Alleen Pro of actieve trial mag door
    if (!isPro && !isTrialValid) {
      return NextResponse.json(
        { error: "Trial verlopen. Upgrade naar Pro." },
        { status: 403 },
      );
    }

    // 3. Verwerk de scan
    const { image, toolId, dogId } = await req.json();
    if (!image)
      return NextResponse.json({ error: "Geen afbeelding" }, { status: 400 });

    const base64Data = image.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const instruction =
      SYSTEM_PROMPTS[toolId] || "Voer een algemene veterinaire check uit.";

    const blob = await put(`scans/${userId}/${Date.now()}.jpg`, buffer, {
      access: "public",
      contentType: "image/jpeg",
    });

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

    const aiData = JSON.parse(
      result
        .text!.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim(),
    );

    // 4. Database Opslag
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
