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

    if (!body.name) {
      return NextResponse.json({ error: "Naam is verplicht" }, { status: 400 });
    }

    // GEEN 'ON CONFLICT'. Elke hond krijgt een eigen rij.
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
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      message: "Hond succesvol toegevoegd",
      dog: result[0], // Hier zit het NIEUWE UNIEKE ID in!
    });
  } catch (error) {
    console.error("Onboarding POST Error:", error);
    return NextResponse.json(
      { error: "Kon de hond niet opslaan" },
      { status: 500 },
    );
  }
}
