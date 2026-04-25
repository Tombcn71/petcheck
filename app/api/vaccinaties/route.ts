import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic"; // Dit voorkomt de 405 en caching errors

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const dogIdRaw = searchParams.get("dogId");

    if (!userId)
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    const sql = neon(process.env.DATABASE_URL!);
    const dogId = dogIdRaw ? parseInt(dogIdRaw) : null;

    if (!dogId) {
      // Als er geen dogId is, pakken we alle vaccinaties van deze gebruiker als fallback
      // of we geven een lege lijst. Laten we voor nu alle van de gebruiker doen:
      const data = await sql`
        SELECT * FROM vaccinaties 
        WHERE user_id = ${userId}
        ORDER BY datum_verloop ASC
      `;
      return NextResponse.json(data);
    }

    const data = await sql`
      SELECT * FROM vaccinaties 
      WHERE dog_id = ${dogId} AND user_id = ${userId}
      ORDER BY datum_verloop ASC
    `;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Fout bij laden" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();
    const { type, datum_gegeven, datum_verloop, dierenarts, dog_id } = body;

    // Zorg dat dog_id een nummer is voor de database
    const numericDogId = parseInt(dog_id);

    const nieuwRecord = await sql`
      INSERT INTO vaccinaties (type, datum_gegeven, datum_verloop, dierenarts, user_id, dog_id)
      VALUES (${type}, ${datum_gegeven}, ${datum_verloop}, ${dierenarts}, ${userId}, ${numericDogId})
      RETURNING *
    `;

    return NextResponse.json(nieuwRecord[0]);
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ error: "Kon niet opslaan" }, { status: 500 });
  }
}
