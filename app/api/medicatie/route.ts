import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    // We halen alles op uit de tabel 'medicatie'
    const data = await sql`
      SELECT * FROM medicatie 
      ORDER BY id DESC
    `;
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Fout bij ophalen" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();

    // Loggen om te debuggen in je terminal
    console.log("Ontvangen in API:", body);

    // We gebruiken de veldnamen uit je frontend: naam, dosering, frequentie, notitie
    const nieuw = await sql`
      INSERT INTO medicatie (naam, dosering, frequentie, notitie)
      VALUES (${body.naam}, ${body.dosering}, ${body.frequentie}, ${body.notitie})
      RETURNING *
    `;

    return NextResponse.json(nieuw[0]);
  } catch (error) {
    console.error("POST Error:", error);
    // Geeft een gedetailleerde fout terug aan de frontend
    return NextResponse.json(
      { error: "Fout bij opslaan in database" },
      { status: 500 },
    );
  }
}
