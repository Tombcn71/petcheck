import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Gebruik de nieuwe SDK initialisatie
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { image, toolId } = await req.json();
    if (!image)
      return NextResponse.json({ error: "No image" }, { status: 400 });

    const base64Data = image.split(",")[1];

    // Belangrijk: De nieuwe SDK gebruikt 'ai.models.generateContent'
    // of direct 'ai.generateContent' afhankelijk van de exacte export.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Veterinaire analyse voor: ${toolId}. Antwoord strikt in JSON: {"summary": "...", "isOk": true, "details": "...", "advice": "..."}`,
            },
            { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    // TYPESCRIPT SAFE ACCESS:
    // In de nieuwe SDK (v3.1) is 'text' direct een property van de response
    const responseText = response.text;

    if (!responseText) {
      throw new Error("Geen tekst ontvangen van model");
    }

    return NextResponse.json(JSON.parse(responseText));
  } catch (error: any) {
    console.error("TS Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
