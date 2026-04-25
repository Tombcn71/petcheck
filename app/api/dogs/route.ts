import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // Correcte manier voor Clerk v5+ in Route Handlers
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Haal alle honden op
    const result = await sql`
      SELECT * FROM dogs 
      WHERE user_id = ${userId} 
      ORDER BY created_at ASC
    `;

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

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

    let finalImageUrl = image_url;

    if (image && image.startsWith("data:image")) {
      const base64Data = image.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      const blob = await put(`dogs/${userId}/${Date.now()}.jpg`, buffer, {
        access: "public",
        contentType: "image/jpeg",
      });
      finalImageUrl = blob.url;
    }

    const sql = neon(process.env.DATABASE_URL!);

    await sql`
      INSERT INTO dogs (user_id, name, breed, age, size, image_url, weight, gender, sterilized)
      VALUES (${userId}, ${name}, ${breed}, ${age}, ${size}, ${finalImageUrl}, ${weight}, ${gender}, ${sterilized})
    `;

    return NextResponse.json({ success: true, url: finalImageUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const body = await req.json();
    const {
      dogId,
      name,
      breed,
      age,
      size,
      weight,
      gender,
      sterilized,
      image,
      image_url,
    } = body;

    let finalImageUrl = image_url;

    // Foto upload bij PATCH
    if (image && image.startsWith("data:image")) {
      const base64Data = image.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      const blob = await put(`dogs/${userId}/${Date.now()}.jpg`, buffer, {
        access: "public",
        contentType: "image/jpeg",
      });
      finalImageUrl = blob.url;
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Gebruik dogId om de juiste rij te vinden
    await sql`
      UPDATE dogs 
      SET 
        name = ${name},
        breed = ${breed},
        age = ${age},
        size = ${size},
        weight = ${weight},
        gender = ${gender},
        sterilized = ${sterilized},
        image_url = ${finalImageUrl}
      WHERE id = ${dogId} AND user_id = ${userId}
    `;

    return NextResponse.json({ success: true, url: finalImageUrl });
  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
