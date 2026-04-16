import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

// Initialisatie van de AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPTS: Record<string, string> = {
  eyes: "Focus op de ogen: check op troebelheid (staar), roodheid (ontsteking), afscheiding of zwelling van de oogleden.",
  poop: "Analyseer de ontlasting: beoordeel consistentie (diarree?), kleur (bloed/zwart?), slijm of zichtbare parasieten.",
  dental:
    "Check het gebit: zoek naar tandsteen (geel/bruin), rood tandvlees (gingivitis) of terugwijkend tandvlees.",
  skin: "Huidanalyse: zoek naar kale plekken, roodheid, hotspots, korstjes of schilfering.",
  bcs: "Body Condition Score: Beoordeel de bouw van de hond. Zijn de ribben te zichtbaar (ondergewicht) of is er geen taille (overgewicht)?",
  pain: "Pijn-indicatie: Analyseer de gezichtsuitdrukking (Dog Facial Assessment). Let op samengeknepen ogen, stand van de oren en spanning rond de bek.",
  coat: "Vachtkwaliteit: Beoordeel glans, dofheid, vettigheid of tekenen van overmatig verharen.",
  nose: "Neusanalyse: Check op overmatige droogheid, korsten (hyperkeratose) of abnormale neusuitvloeiing.",
  ticks:
    "Teken-check: Zoek naar kleine donkere bultjes of vastgebeten teken op de huid/tussen de haren.",
  fleas:
    "Vlooien/Parasieten: Zoek naar vlooienpoepjes (zwarte puntjes) of actieve insecten in de vacht.",
  mange:
    "Schurft & Ringworm: Zoek naar cirkelvormige haaruitval of extreme korstvorming en irritatie.",
  ears: "Ooranalyse: Kijk in de oorschelp. Zoek naar roodheid, overmatig donker oorsmeer (oormijt), gele afscheiding (infectie) of krabsporen/korstjes.",
};

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    // 2. Input check
    const { image, toolId } = await req.json();
    if (!image)
      return NextResponse.json({ error: "Geen afbeelding" }, { status: 400 });

    const base64Data = image.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const instruction =
      SYSTEM_PROMPTS[toolId] || "Voer een algemene veterinaire check uit.";

    // 3. Blob Upload (Foto opslaan)
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
              text: `Jij bent een AI Veterinaire Expert. 
                     Opdracht: ${instruction}
                     Antwoord in het Nederlands. 
                     STRIKT JSON FORMAAT: {"summary": "string", "isOk": boolean, "details": "string", "advice": "string"}`,
            },
            { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = result.text;
    if (!rawText) throw new Error("Lege response van AI");

    // VEILIGE PARSING: Verwijder Markdown blokken en witruimte
    const cleanJsonString = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const aiData = JSON.parse(cleanJsonString);

    // 5. Database Opslag
    const sql = neon(process.env.DATABASE_URL!);
    try {
      await sql`
        INSERT INTO scans (user_id, tool_id, image_url, summary, is_ok, details, advice) 
        VALUES (${userId}, ${toolId}, ${blob.url}, ${aiData.summary}, ${aiData.isOk}, ${aiData.details}, ${aiData.advice})
      `;
    } catch (dbError) {
      console.error("DB Save Skip (Local):", dbError);
    }

    return NextResponse.json(aiData);
  } catch (error: any) {
    console.error("Final API Error:", error);
    return NextResponse.json(
      { error: "Fout bij verwerken: " + error.message },
      { status: 500 },
    );
  }
}
