import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

// Initialisatie van de AI met de Gemini 3 Flash SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET(req: Request) {
  try {
    // 1. Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dogName = searchParams.get("name") || "mijn hond";
    const dogId = searchParams.get("dogId");

    // 2. Database query: Haal ALLE recente afwijkingen op (is_ok = false)
    const sql = neon(process.env.DATABASE_URL!);

    // We gebruiken geen DISTINCT omdat we ELKE unieke scan willen zien, ook als het 2x ogen is
    let dossierItems;
    
    if (dogId) {
      dossierItems = await sql`
        SELECT tool_id, summary, image_url, created_at 
        FROM scans 
        WHERE user_id = ${userId} AND dog_id = ${dogId} AND is_ok = false 
        ORDER BY created_at DESC 
        LIMIT 20
      `;
    } else {
      dossierItems = await sql`
        SELECT tool_id, summary, image_url, created_at 
        FROM scans 
        WHERE user_id = ${userId} AND is_ok = false 
        ORDER BY created_at DESC 
        LIMIT 20
      `;
    }

    // DEBUG: Check je terminal om te zien of hier 2 of 3 staat!
    console.log(
      `Aantal gevonden afwijkingen voor ${dogName}:`,
      dossierItems.length,
    );

    if (!dossierItems || dossierItems.length === 0) {
      return NextResponse.json({
        brief: `Ik heb momenteel geen bijzonderheden genoteerd voor ${dogName}.`,
        details: [],
      });
    }

    // Voorbereiden van de data voor de AI
    const bevindingen = dossierItems
      .map((item) => `- [Onderdeel: ${item.tool_id}]: ${item.summary}`)
      .join("\n");

    // 3. AI Brief Genereren
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Jij helpt een hondeneigenaar om een kort lijstje met aantekeningen te maken voor de dierenarts. 
                     Het doel is om ALLE waargenomen problemen die hieronder staan kort te benoemen in één natuurlijk verhaal.
                     
                     Hier zijn de waarnemingen van ${dogName}:
                     ${bevindingen}
                     
                     STRIKTE INSTRUCTIES:
                     - Gebruik GEEN titels zoals "Observatieverslag" of "PetCheck".
                     - Gebruik GEEN klinische koppen zoals "Huid:" of "Ogen:".
                     - Schrijf een vloeiend verhaal vanuit de eigenaar (ik-vorm).
                     - VERWERK ELK PUNT uit de bovenstaande lijst. Als er 3 punten staan, noem ze dan alle 3.
                     - Gebruik GEEN AI-clichés of formele afsluitingen.
                     - Vertaal alle termen (Skin -> Huid, Eyes -> Ogen, Dental -> Gebit, Ears -> Oren).
                     - Maak het persoonlijk: "Het viel me op dat Luna... Daarnaast zag ik bij haar... ook..."
                     
                     Begin de tekst direct met: "Aantekeningen voor het bezoek met ${dogName}"`,
            },
          ],
        },
      ],
    });

    const briefTekst = result.text;
    if (!briefTekst) throw new Error("Lege response van AI");

    return NextResponse.json({
      brief: briefTekst,
      details: dossierItems, // Hier zitten de image_url's in
    });
  } catch (error: any) {
    console.error("Rapport API Error:", error);
    return NextResponse.json(
      { error: "Fout bij genereren: " + error.message },
      { status: 500 },
    );
  }
}
