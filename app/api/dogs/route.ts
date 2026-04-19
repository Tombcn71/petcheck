import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    const sql = neon(process.env.DATABASE_URL!);
    const result =
      await sql`SELECT * FROM dogs WHERE user_id = ${userId} LIMIT 1`;
    return NextResponse.json(result[0] || null);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Auth check (Exact als analyze)
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    // 2. Input check
    const body = await req.json();
    const {
      name,
      breed,
      age,
      size,
      image,
      image_url,
      weight,
      gender,
      sterilized,
    } = body;

    let finalImageUrl = image_url; // Houd de oude URL vast als er geen nieuwe foto is

    // 3. Blob Upload (Exact dezelfde logica als analyze)
    // We kijken of 'image' een base64 string is (begint met data:image)
    if (image && image.startsWith("data:image")) {
      const base64Data = image.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      const blob = await put(`dogs/${userId}/${Date.now()}.jpg`, buffer, {
        access: "public",
        contentType: "image/jpeg",
      });

      finalImageUrl = blob.url; // De nieuwe Vercel Blob URL
    }

    // 4. Database Opslag (UPSERT)
    const sql = neon(process.env.DATABASE_URL!);

    await sql`
      INSERT INTO dogs (user_id, name, breed, age, size, image_url, weight, gender, sterilized)
      VALUES (
        ${userId}, 
        ${name}, 
        ${breed}, 
        ${age}, 
        ${size}, 
        ${finalImageUrl}, 
        ${weight}, 
        ${gender}, 
        ${sterilized}
      )
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        breed = EXCLUDED.breed,
        age = EXCLUDED.age,
        size = EXCLUDED.size,
        image_url = EXCLUDED.image_url,
        weight = EXCLUDED.weight,
        gender = EXCLUDED.gender,
        sterilized = EXCLUDED.sterilized
    `;

    // 5. Return succes + de URL (voor directe UI update)
    return NextResponse.json({ success: true, url: finalImageUrl });
  } catch (error: any) {
    console.error("Final Dogs API Error:", error);
    return NextResponse.json(
      { error: "Fout bij verwerken: " + error.message },
      { status: 500 },
    );
  }
}
