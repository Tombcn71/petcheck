import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();

    // Controleer of de minimale data aanwezig is
    if (!body.name) {
      return NextResponse.json({ error: "Naam is verplicht" }, { status: 400 });
    }

    // We voeren de INSERT uit met ON CONFLICT voor het geval de user_id al bestaat
    const result = await sql`
      INSERT INTO dogs (
        user_id, 
        name, 
        breed, 
        age, 
        size, 
        weight, 
        gender, 
        sterilized, 
        image_url
      )
      VALUES (
        ${userId}, 
        ${body.name}, 
        ${body.breed || ""}, 
        ${body.age?.toString() || ""}, 
        ${body.size || "middel"}, 
        ${body.weight || ""}, 
        ${body.gender || ""}, 
        ${body.sterilized || ""}, 
        ${body.image_url || null}
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

    return NextResponse.json({
      success: true,
      message: "Onboarding succesvol afgerond",
      dog: result[0],
    });
  } catch (error) {
    console.error("Onboarding POST Error:", error);
    return NextResponse.json(
      { error: "Kon de onboarding data niet opslaan" },
      { status: 500 },
    );
  }
}
