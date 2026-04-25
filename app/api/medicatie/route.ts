import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// --- GET: Ophalen van medicatie ---
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const dogIdRaw = searchParams.get("dogId");

    if (!userId) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    const dogId = dogIdRaw ? parseInt(dogIdRaw) : null;

    // Als er een dogId is, filteren we daarop. Anders alles van de user.
    if (dogId && !isNaN(dogId)) {
      const data = await sql`
        SELECT * FROM medicatie 
        WHERE dog_id = ${dogId} AND user_id = ${userId}
        ORDER BY id DESC
      `;
      return NextResponse.json(data);
    }

    const data = await sql`
      SELECT * FROM medicatie 
      WHERE user_id = ${userId}
      ORDER BY id DESC
    `;
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Fout bij ophalen" }, { status: 500 });
  }
}

// --- POST: Toevoegen van nieuwe medicatie ---
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();

    // BELANGRIJK: Debugging om te zien wat de frontend verstuurt
    console.log("POST Ontvangen data:", body);

    // Controleer of dog_id aanwezig is in de body
    if (body.dog_id === undefined || body.dog_id === null) {
      return NextResponse.json(
        { error: "Veld 'dog_id' ontbreekt in de aanvraag" },
        { status: 400 },
      );
    }

    const numericDogId = parseInt(body.dog_id);

    // Controleer of de omzetting naar een getal is gelukt (voorkomt de NaN error)
    if (isNaN(numericDogId)) {
      console.error("Fout: dog_id is NaN. Ontvangen waarde:", body.dog_id);
      return NextResponse.json(
        { error: `Ongeldig dog_id: ${body.dog_id}. Moet een getal zijn.` },
        { status: 400 },
      );
    }

    const nieuw = await sql`
      INSERT INTO medicatie (naam, dosering, frequentie, notitie, user_id, dog_id)
      VALUES (
        ${body.naam || ""}, 
        ${body.dosering || ""}, 
        ${body.frequentie || ""}, 
        ${body.notitie || ""}, 
        ${userId}, 
        ${numericDogId}
      )
      RETURNING *
    `;

    return NextResponse.json(nieuw[0]);
  } catch (error) {
    console.error("POST Error details:", error);
    return NextResponse.json(
      { error: "Fout bij opslaan in database" },
      { status: 500 },
    );
  }
}
