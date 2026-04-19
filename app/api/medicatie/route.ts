import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server"; // Importeer auth

export async function GET() {
  try {
    const { userId } = await auth(); // Wacht op de auth promise
    if (!userId)
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    const sql = neon(process.env.DATABASE_URL!);

    // Haal de hond op die bij deze specifieke gebruiker hoort
    const data = await sql`
      SELECT * FROM dogs 
      WHERE user_id = ${userId} 
      LIMIT 1
    `;

    return NextResponse.json(data[0] || null);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Fout bij ophalen" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth(); // Wacht op de auth promise
    if (!userId)
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();

    // We mappen de velden van de Onboarding/Profiel naar de database
    // Let op: we gebruiken de userId van Clerk voor de user_id kolom
    const result = await sql`
      INSERT INTO dogs (user_id, name, breed, age, size, weight, gender, sterilized, image_url)
      VALUES (
        ${userId}, 
        ${body.name}, 
        ${body.breed || ""}, 
        ${body.age?.toString() || ""}, 
        ${body.size || ""}, 
        ${body.weight || ""}, 
        ${body.gender || ""}, 
        ${body.sterilized || ""}, 
        ${body.image_url || body.image || null}
      )
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        breed = EXCLUDED.breed,
        age = EXCLUDED.age,
        size = EXCLUDED.size,
        weight = EXCLUDED.weight,
        gender = EXCLUDED.gender,
        sterilized = EXCLUDED.sterilized,
        image_url = EXCLUDED.image_url
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Fout bij opslaan" }, { status: 500 });
  }
}
