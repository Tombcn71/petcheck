import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    // We halen de vaccinaties op, gesorteerd op verloopdatum (eerst wat bijna verloopt)
    const data = await sql`
      SELECT id, type, datum_gegeven, datum_verloop, dierenarts 
      FROM vaccinaties 
      ORDER BY datum_verloop ASC
    `;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Kon vaccinaties niet laden" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { type, datum_gegeven, datum_verloop, dierenarts } =
      await request.json();

    const nieuwRecord = await sql`
      INSERT INTO vaccinaties (type, datum_gegeven, datum_verloop, dierenarts)
      VALUES (${type}, ${datum_gegeven}, ${datum_verloop}, ${dierenarts})
      RETURNING *
    `;

    return NextResponse.json(nieuwRecord[0]);
  } catch (error) {
    return NextResponse.json({ error: "Kon niet opslaan" }, { status: 500 });
  }
}
