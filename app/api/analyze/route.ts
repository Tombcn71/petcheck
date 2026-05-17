import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";
import { TRIAL_DAYS } from "../../trial-config"; // Dit is nu je enige, centrale bron!

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPTS: Record<string, string> = {
  pain: "Pijn-indicatie: Analyseer de gezichtsuitdrukking (Dog Facial Assessment). Let op samengeknepen ogen, stand van de oren en spanning rond de bek.",
  vomit:
    "Braaksel Analyse: Analyseer de kleur en inhoud van het braaksel op de foto. Herken signalen van gal (geel), bloed (rood/bruin), vreemde voorwerpen of maagzuur (wit schuim) en geef aan of dit duidt op een acute situatie.",
  poop: "Analyseer de ontlasting: beoordeel consistentie (diarree?), kleur (bloed/zwart?), slijm of zichtbare parasieten.",
  eyes: "Focus op de ogen: check op troebelheid (staar), roodheid (ontsteking), afscheiding of zwelling van de oogleden.",
  ears: "Ooranalyse: Kijk in de oorschelp. Zoek naar roodheid, overmatig donker oorsmeer (oormijt), gele afscheiding (infectie) of krabsporen/korstjes.",
  nose: "Neusanalyse: Check op overmatige droogheid, korsten (hyperkeratose) of abnormale neusuitvloeiing.",
  skin: "Huidanalyse: zoek naar kale plekken, roodheid, hotspots, korstjes of schilfering.",
  ticks:
    "Parasieten & Teken Check: Zoek naar actieve insecten zoals vlooien, luizen of mijten, vlooienpoepjes (zwarte puntjes) in de vacht én vastgebeten teken (kleine donkere bultjes op de huid). Identificeer indien van toepassing het risico van de teek.",
  mange:
    "Schurft & Ringworm: Zoek naar cirkelvormige haaruitval of extreme korstvorming en irritatie.",
  dental:
    "Check het gebit: zoek naar tandsteen (geel/bruin), rood tandvlees (gingivitis) of terugwijkend tandvlees.",
  symmetry:
    "Lichaams-Symmetrie Check: Analyseer de stand van de hond (recht van voren of van achteren). Kijk of de hond recht staat, zijn gewicht gelijkmatig verdeelt over his poten en of er asymmetrie is die kan duiden op gewrichtspijn of blessures.",
  coat: "Vachtkwaliteit: Beoordeel glans, dofheid, vettigheid of tekenen van overmatig verharen.",
};

export async function POST(req: Request) {
  try {
    // 1. Auth & Trial Check
    const { userId, sessionClaims } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    // Haal metadata op uit de Clerk sessie
    const metadata = sessionClaims?.metadata as
      | { role?: string; trialEndsAt?: string }
      | undefined;
    const isPro = metadata?.role === "pro";
    const trialEndsAt = metadata?.trialEndsAt;

    // Pak de starttijd van de token (of nu als fallback)
    const tokenIssuedAt = sessionClaims?.iat
      ? sessionClaims.iat * 1000
      : Date.now();

    // Bereken de exacte proefperiode in milliseconden op basis van de variabele bovenaan
    const trialDurationMs = TRIAL_DAYS * 24 * 60 * 60 * 1000;
    const backupTrialExpired = Date.now() - tokenIssuedAt > trialDurationMs;

    // Bepaal of de trial definitief voorbij is
    const trialExpired =
      !isPro &&
      (trialEndsAt
        ? new Date(trialEndsAt).getTime() < Date.now()
        : backupTrialExpired);

    if (trialExpired) {
      return NextResponse.json(
        { error: "Trial verlopen. Upgrade naar een betaald abonnement." },
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

    const cleanJsonString = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const aiData = JSON.parse(cleanJsonString);

    // 5. Database Opslag
    const sql = neon(process.env.DATABASE_URL!);
    try {
      await sql`
        INSERT INTO scans (user_id, dog_id, tool_id, image_url, summary, is_ok, details, advice) 
        VALUES (${userId}, ${dogId}, ${toolId}, ${blob.url}, ${aiData.summary}, ${aiData.isOk}, ${aiData.details}, ${aiData.advice})
      `;
    } catch (dbError) {
      console.error("DB Save Error:", dbError);
    }

    return NextResponse.json(aiData);
  } catch (error: any) {
    console.error("Final API Error:", error);
    return NextResponse.json({ error: "Fout bij verwerken" }, { status: 500 });
  }
}
