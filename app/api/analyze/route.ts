import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

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
  // Posture is nu Ears geworden
  ears: "Ooranalyse: Kijk in de oorschelp. Zoek naar roodheid, overmatig donker oorsmeer (oormijt), gele afscheiding (infectie) of krabsporen/korstjes.",
};

export async function POST(req: Request) {
  try {
    const { image, toolId } = await req.json();
    const base64Data = image.split(",")[1];

    const instruction =
      SYSTEM_PROMPTS[toolId] || "Voer een algemene veterinaire check uit.";

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Jij bent een AI Veterinaire Expert. 
                     Opdracht: ${instruction}
                     
                     Antwoord ALTIJD in het Nederlands en STRIKT in dit JSON formaat:
                     {
                       "summary": "Korte krachtige status (bijv: Gezond, Actie vereist, Kritiek)",
                       "isOk": true of false,
                       "details": "Wat zie je precies op de foto? Wees klinisch en nauwkeurig.",
                       "advice": "Concreet advies voor het baasje. Moeten ze naar een arts?"
                     }`,
            },
            { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.text;
    if (!responseText) throw new Error("Lege response");

    return NextResponse.json(JSON.parse(responseText));
  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json(
      {
        error:
          "De AI kon de foto niet verwerken. Controleer de afbeeldingsgrootte of belichting.",
      },
      { status: 500 },
    );
  }
}
